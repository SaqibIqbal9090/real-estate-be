# HAR Data Import Script

This script fetches property listing data from the HAR.com API and imports it into your database.

## Prerequisites

1. **Environment Variables**: Set up the following environment variables in your `.env` file:

```env
# HAR API Configuration (paste the full URL you got from HAR, INCLUDING access_token)
HAR_API_URL="https://api.bridgedataoutput.com/api/v2/har/listings?access_token=YOUR_TOKEN_HERE"

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

1. **Authentication**: The script connects to the HAR API using the `access_token` embedded in `HAR_API_URL`
2. **Pagination**: Fetches listings in batches of 100 (configurable)
3. **Deduplication**: Skips properties that already exist (based on MLS number)
4. **Mapping**: Maps HAR API fields to your Property model fields
5. **Import**: Creates new property records in your database

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

### "HAR_API_KEY is required" error
- Set the `HAR_API_KEY` environment variable
- Verify your API key is valid and has access to listings

### API authentication errors
- Check if your API uses Bearer token or query parameter authentication
- The script supports both - it will use Bearer token if the key is long (>50 chars) or starts with "Bearer "
- Otherwise, it uses `access_token` query parameter

### Database connection errors
- Verify your database configuration in `src/config/database.config.ts`
- Check that your database is running and accessible
- Ensure environment variables for database are set correctly

## Notes

- Properties are imported with `status: 'published'` by default
- The script preserves all available data from HAR API
- Missing or null fields are handled gracefully
- Images are imported as an array in the `images` field

