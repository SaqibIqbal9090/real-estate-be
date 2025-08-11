# Real Estate Properties API Documentation

## Overview

The Properties API provides comprehensive functionality for managing real estate listings in your platform. It includes CRUD operations, search, filtering, and advanced features for property management.

## Base URL

```
http://localhost:3200/properties
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create Property

**POST** `/properties`

Creates a new property listing.

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "listType": "sale",
  "listPrice": 450000,
  "listDate": "2024-01-15",
  "streetNo": "123",
  "streetName": "Main Street",
  "city": "Austin",
  "state": "TX",
  "zipCode": "78701",
  "bedrooms": ["3", "4"],
  "bathsFull": ["2", "2.5"],
  "buildingSqft": 2500,
  "lotSize": 0.25,
  "yearBuilt": "2020",
  "propertyType": ["Single Family"],
  "style": ["Modern"],
  "images": ["url1", "url2"],
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "message": "Property created successfully",
  "property": {
    "id": "property-uuid",
    "listType": "sale",
    "listPrice": 450000,
    "streetNo": "123",
    "streetName": "Main Street",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T10:00:00Z"
  }
}
```

### 2. Get All Properties

**GET** `/properties`

Retrieves all properties with optional filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for address, city, state, subdivision
- `listType` (optional): Filter by list type (sale, lease, both)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `city` (optional): Filter by city
- `state` (optional): Filter by state
- `bedrooms` (optional): Filter by number of bedrooms
- `bathrooms` (optional): Filter by number of bathrooms

**Example:**
```
GET /properties?page=1&limit=20&search=austin&minPrice=300000&maxPrice=500000&bedrooms=3
```

**Response:**
```json
{
  "properties": [
    {
      "id": "property-uuid",
      "listType": "sale",
      "listPrice": 450000,
      "streetNo": "123",
      "streetName": "Main Street",
      "city": "Austin",
      "state": "TX",
      "zipCode": "78701",
      "bedrooms": ["3", "4"],
      "bathsFull": ["2", "2.5"],
      "buildingSqft": 2500,
      "user": {
        "id": "user-uuid",
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "total": 150,
  "page": 1,
  "totalPages": 8
}
```

### 3. Search Properties

**GET** `/properties/search`

Advanced search functionality for properties.

**Query Parameters:**
- `q` (required): Search term
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**
```
GET /properties/search?q=austin downtown&page=1&limit=10
```

### 4. Get Property Statistics

**GET** `/properties/stats`

Returns platform statistics.

**Response:**
```json
{
  "totalProperties": 1250,
  "averagePrice": 425000,
  "propertiesByType": {
    "sale": 800,
    "lease": 300,
    "both": 150
  },
  "propertiesByState": {
    "TX": 450,
    "CA": 300,
    "FL": 200
  }
}
```

### 5. Get My Properties

**GET** `/properties/my-properties`

Retrieves properties owned by the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page

### 6. Get Property by ID

**GET** `/properties/:id`

Retrieves a specific property by ID.

**Example:**
```
GET /properties/property-uuid
```

**Response:**
```json
{
  "message": "Property retrieved successfully",
  "property": {
    "id": "property-uuid",
    "listType": "sale",
    "listPrice": 450000,
    "streetNo": "123",
    "streetName": "Main Street",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "bedrooms": ["3", "4"],
    "bathsFull": ["2", "2.5"],
    "buildingSqft": 2500,
    "lotSize": 0.25,
    "yearBuilt": "2020",
    "propertyType": ["Single Family"],
    "style": ["Modern"],
    "images": ["url1", "url2"],
    "user": {
      "id": "user-uuid",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 7. Get Property Details

**GET** `/properties/:id/details`

Retrieves detailed property information with computed fields.

**Response:**
```json
{
  "message": "Property details retrieved successfully",
  "property": {
    "id": "property-uuid",
    "listType": "sale",
    "listPrice": 450000,
    "fullAddress": "123 Main Street, Austin, TX 78701",
    "priceFormatted": "$450,000.00",
    "streetNo": "123",
    "streetName": "Main Street",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701"
  }
}
```

### 8. Update Property

**PATCH** `/properties/:id`

Updates an existing property (owner only).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "listPrice": 475000,
  "buildingSqft": 2600,
  "images": ["url1", "url2", "url3"]
}
```

**Response:**
```json
{
  "message": "Property updated successfully",
  "property": {
    "id": "property-uuid",
    "listPrice": 475000,
    "buildingSqft": 2600,
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### 9. Delete Property

**DELETE** `/properties/:id`

Deletes a property (owner only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "Property deleted successfully"
}
```

### 10. Get Featured Properties

**GET** `/properties/featured`

Retrieves featured properties.

**Query Parameters:**
- `limit` (optional): Number of featured properties (default: 6)

### 11. Get Recent Properties

**GET** `/properties/recent`

Retrieves recently added properties.

**Query Parameters:**
- `limit` (optional): Number of recent properties (default: 10)

### 12. Get Properties by City

**GET** `/properties/by-location/:city`

Retrieves properties in a specific city.

**Example:**
```
GET /properties/by-location/austin?page=1&limit=20
```

### 13. Get Properties by Price Range

**GET** `/properties/by-price-range`

Retrieves properties within a price range.

**Query Parameters:**
- `minPrice` (required): Minimum price
- `maxPrice` (required): Maximum price
- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**
```
GET /properties/by-price-range?minPrice=300000&maxPrice=500000&page=1&limit=20
```

## Property Model Fields

### Required Fields
- `listType`: "sale" | "lease" | "both"
- `listPrice`: number (minimum 0)
- `streetNo`: string
- `streetName`: string
- `city`: string
- `state`: string
- `zipCode`: string
- `userId`: UUID (automatically set from JWT token)

### Optional Fields

#### Basic Information
- `listDate`: Date
- `ExpDate`: Date
- `alsoForLease`: boolean
- `priceAtLotValue`: number

#### Address
- `stDirection`: string
- `streetType`: string
- `unitNo`: string
- `zipCodeExt`: string
- `county`: string
- `subDivision`: string
- `section`: string
- `sectionNo`: string
- `legalDescription`: text
- `legalsubDivision`: string

#### Community
- `masterPlannedCommunity`: boolean
- `masterPlannedCommunityName`: string

#### Tax Information
- `taxId`: string
- `keyMap`: string
- `censusTract`: string
- `taxId2`: string
- `taxId3`: string

#### Area & Schools
- `area`: string
- `marketArea`: string
- `etjCity`: string
- `elementrySchool`: string
- `middleSchool`: string
- `highSchool`: string
- `secondMiddleSchool`: string
- `schoolDistrict`: string
- `publicImprovementDistrict`: string

#### Building Details
- `buildingSqft`: number
- `sqftSourceDirection`: string
- `yearBuilt`: string
- `yearBuiltSource`: string
- `stories`: string
- `newConstruction`: boolean
- `newConstructionDesc`: string
- `builderName`: string
- `approxCompletionDate`: Date
- `expirationDate`: Date

#### Garage & Lot
- `garadgeDimenssion`: string
- `utilityDistrict`: string
- `garadgeAptQtrs`: string
- `SqftSource`: string
- `guestHouseSqft`: number
- `guestHouseSqftSource`: string
- `lotSize`: number
- `lotSizeSource`: string
- `acres`: string
- `acreage`: string
- `lotDimenssions`: string
- `garage`: string
- `carport`: string
- `carportDescription`: string

#### Array Fields (JSON)
- `access`: string[]
- `garageDescription`: string[]
- `garageCarportDescriptions`: string[]
- `restrictions`: string[]
- `propertyType`: string[]
- `style`: string[]
- `lotDescription`: string[]
- `waterfrontFeatures`: string[]
- `fireplaceDescription`: string[]
- `bedrooms`: string[]
- `bedroomsMax`: string[]
- `bathsFull`: string[]
- `bathshalf`: string[]
- `bedrommDescription`: string[]
- `roomDescription`: string[]
- `bathroomDescription`: string[]
- `kitchenDescription`: string[]
- `room`: Array<{roomType: string, roomDimension: string, roomLocation: string}>
- `financingConsideration`: string[]
- `disclosures`: string[]
- `exclusions`: string[]
- `maintananceFeeIncludes`: string[]
- `showingInstructions`: string[]
- `images`: string[]

#### Appliances & Features
- `microwave`: string
- `dishwasher`: string
- `disposal`: string
- `subDivisionLakeAccess`: string
- `compactor`: string
- `separateIceMaker`: string
- `fireplaceNo`: string
- `counterTops`: string

#### HQA Information
- `mandatoryHQA`: string
- `mandatoryHQACoName`: string
- `mandatoryHQACoPhone`: string
- `mandatoryHQACoWebsite`: string

#### Financial Information
- `lossMitigation`: string
- `activeCommunity`: string
- `affordableHousingProgramDescription`: text
- `maintainanceFee`: string
- `maintainanceFeeAmount`: number
- `maintainanceFeeSche`: string
- `otherMandatoryFees`: string
- `otherMandatoryFeesAmount`: number
- `otherMandatoryFeesIncludes`: string
- `taxYear`: string
- `taxes`: number
- `totalTaxRate`: number
- `exemptions`: string
- `ownershipType`: string
- `vacationRentalAllowed`: boolean
- `sellerEmail`: email

#### Auction Information
- `subjectToAuction`: string
- `auctionDate`: Date
- `onlineBidding`: boolean
- `biddingDeadline`: string

#### Agent Information
- `listAgent`: string (default: "realestatemarketplaceintl")
- `teamId`: string
- `liscensedSupervisor`: string
- `appointmentPhone`: string
- `appointmentPhoneDesc`: string
- `officePhoneExt`: string
- `agentAlternatePhone`: string
- `alternatePhoneDesc`: string
- `nightPhone`: string
- `faxPhone`: string
- `allowOnlineAppointmentsViaMatrix`: string
- `idxContactInfo`: string
- `coListAgent`: string (default: "realestatemarketplaceintl")
- `buyerAgencyCompensation`: string
- `subAgencyCompensation`: string
- `bonus`: string
- `bonusEndDate`: Date
- `variableCompensation`: number

#### Links & Media
- `link1`: string
- `link2`: string
- `floorPlanUrl`: string
- `videoTourLink`: string
- `webHyperLink1`: string
- `webHyperLink2`: string

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["listPrice must be a positive number", "listType must be one of the following values: sale, lease, both"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own properties",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Property with ID property-uuid not found",
  "error": "Not Found"
}
```

## Usage Examples

### Create a Property
```bash
curl -X POST http://localhost:3200/properties \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "listType": "sale",
    "listPrice": 450000,
    "streetNo": "123",
    "streetName": "Main Street",
    "city": "Austin",
    "state": "TX",
    "zipCode": "78701",
    "bedrooms": ["3", "4"],
    "bathsFull": ["2", "2.5"],
    "buildingSqft": 2500,
    "propertyType": ["Single Family"]
  }'
```

### Search Properties
```bash
curl "http://localhost:3200/properties?search=austin&minPrice=300000&maxPrice=500000&bedrooms=3&page=1&limit=20"
```

### Get Property Details
```bash
curl http://localhost:3200/properties/property-uuid/details
```

### Update Property
```bash
curl -X PATCH http://localhost:3200/properties/property-uuid \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "listPrice": 475000,
    "buildingSqft": 2600
  }'
```

## Notes

- All array fields are stored as JSON in the database
- Date fields should be in ISO 8601 format (YYYY-MM-DD)
- Price fields should be positive numbers
- Email fields are validated for proper email format
- The `userId` field is automatically set from the JWT token
- Only property owners can update or delete their properties
- Search is case-insensitive and supports partial matching
- Pagination is available on all list endpoints 