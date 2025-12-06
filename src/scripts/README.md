# HAR Data Import Script

This script fetches property listing data from the HAR.com API and imports it into your database.

## Prerequisites

1. **Environment Variables**: Set up the following environment variables in your `.env` file:

```env
# HAR OData API Configuration (paste the full OData URL you got from HAR, INCLUDING access_token)
# Example: https://api.bridgedataoutput.com/api/v2/OData/har/Property?access_token=YOUR_TOKEN_HERE
HAR_API_URL="https://api.bridgedataoutput.com/api/v2/OData/har/Property?access_token=YOUR_TOKEN_HERE"

# Database User ID (UUID of an existing user in your database)
HAR_IMPORT_USER_ID=your-user-uuid-here

# Optional: Limit the number of listings to import (useful for testing)
MAX_LISTINGS=100
```

2. **Database User**: You need to have a user in your database. The script will use this user's ID for all imported properties. You can find a user ID by:
   - Querying your database: `SELECT id, email FROM users LIMIT 1;`
   - Or creating a system user specifically for imports

## Usage

### Basic Import

Import all available listings from HAR API:

```bash
npm run har:import
```

### Import with Limit (for testing)

Set `MAX_LISTINGS` in your `.env` file or export it before running:

```bash
MAX_LISTINGS=50 npm run har:import
```

## How It Works

1. **Authentication**: The script connects to the HAR OData API using the `access_token` embedded in `HAR_API_URL`
2. **OData Queries**: Uses OData `$filter` syntax to query properties (default: City='Houston' and PropertyType='Residential')
3. **Pagination**: Fetches listings in batches using `$top` and follows `@odata.nextLink` for subsequent pages
4. **Deduplication**: Skips properties that already exist (based on MLS number)
5. **Mapping**: Maps HAR API fields to your Property model fields
6. **Import**: Creates new property records in your database

## Field Mapping

The script maps HAR API fields to your Property model. Key mappings include:

- **Address**: Street number, name, city, state, zip code
- **Property Details**: Type, bedrooms, bathrooms, square footage, lot size
- **Financial**: List price, taxes, HOA fees
- **Features**: Interior/exterior features, appliances, amenities
- **Media**: Property images from HAR
- **Agent Info**: Listing agent and office information

## Error Handling

- **Duplicate Properties**: Automatically skipped (based on MLS number)
- **API Errors**: Logged with details, script continues with next batch
- **Database Errors**: Logged per property, doesn't stop the import

## Rate Limiting

The script includes a 1-second delay between batches to avoid rate limiting. You can adjust this in the script if needed.

## Output

The script provides real-time feedback:
- ✅ Successfully imported properties
- ⏭️ Skipped (duplicate) properties
- ❌ Errors (with details)
- 📊 Final summary with counts

## Troubleshooting

### "User not found" error
- Make sure `HAR_IMPORT_USER_ID` is set to a valid UUID from your users table
- Verify the user exists: `SELECT * FROM users WHERE id = 'your-uuid';`

### "HAR_API_URL must be an OData endpoint" error
- Make sure your `HAR_API_URL` points to the OData endpoint: `/api/v2/OData/har/Property`
- The URL should include `access_token` as a query parameter
- Example: `https://api.bridgedataoutput.com/api/v2/OData/har/Property?access_token=YOUR_TOKEN`

### API authentication errors
- Verify your `access_token` is valid and included in the URL
- Check that your token has access to the Property entity in the HAR OData API

### Database connection errors
- Verify your database configuration in `src/config/database.config.ts`
- Check that your database is running and accessible
- Ensure environment variables for database are set correctly

## Notes

- Properties are imported with `status: 'published'` by default
- The script preserves all available data from HAR API
- Missing or null fields are handled gracefully
- Images are imported as an array in the `images` field

