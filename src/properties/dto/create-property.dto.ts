// Backend validations removed per requirements. Keep a loose DTO shape only.

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreatePropertyDto - Comprehensive property creation data transfer object
 * 
 * REQUIRED FIELDS (for published status):
 * - listType: Type of listing (sale, lease, both)
 * - listPrice: Listing price of the property
 * - streetNo: Street number
 * - streetName: Street name
 * - city: City where property is located
 * - state: State where property is located
 * - zipCode: ZIP code
 * 
 * OPTIONAL FIELDS (200+ fields available):
 * - Address details: stDirection, streetType, unitNo, zipCodeExt, county, subDivision, etc.
 * - Tax information: taxId, keyMap, censusTract, taxId2, taxId3
 * - Area information: area, marketArea, etjCity
 * - School information: elementarySchool, middleSchool, highSchool, schoolDistrict, etc.
 * - Building details: buildingSqft, yearBuilt, stories, newConstruction, builderName, etc.
 * - Garage information: garageDimensions, utilityDistrict, garageAptQtrsSqFt, etc.
 * - Lot information: lotSize, acres, lotDimensions, garage, carport, etc.
 * - Property features: propertyType, style, lotDescription, waterfrontFeatures, etc.
 * - Interior features: interiorFeatures, flooring, counterTops, appliances, etc.
 * - Exterior features: exteriorDescription, constructionMaterials, roofDescription, etc.
 * - Systems: heatingSystemDescription, coolingSystemDescription, waterSewerDescription, etc.
 * - Room details: bedrooms, bathsFull, bathshalf, roomDescription, etc.
 * - HOA information: mandatoryHOA, maintenanceFee, maintenanceFeeIncludes, etc.
 * - Financial details: taxYear, taxAmount, exemptions, ownershipType, etc.
 * - And many more specialized fields for comprehensive property documentation
 */
export class CreatePropertyDto {
  // Property Status
  @ApiPropertyOptional({
    description: 'Property status. Defaults to "draft" if not provided. Use "published" to create a complete listing (requires all required fields).',
    enum: ['draft', 'published'],
    example: 'draft',
  })
  status?: 'draft' | 'published';

  // Listing Information
  @ApiProperty({
    description: 'Type of listing',
    example: 'sale',
    enum: ['sale', 'lease', 'both'],
  })
  listType: string;

  @ApiProperty({
    description: 'Listing price of the property',
    example: 450000,
    type: 'number',
  })
  listPrice: number;

  @ApiPropertyOptional({ description: 'Listing date', example: '2024-01-15' })
  listDate?: string;

  @ApiPropertyOptional({ description: 'Expiration date', example: '2024-12-31' })
  ExpDate?: string;

  @ApiPropertyOptional({ description: 'Also available for lease', example: false, type: 'boolean' })
  alsoForLease?: boolean;

  @ApiPropertyOptional({ description: 'Townhouse or Condo', example: 'Condo' })
  townhouseCondo?: string;

  @ApiPropertyOptional({ description: 'Price at lot value', example: 100000, type: 'number' })
  priceAtLotValue?: number;

  // Address Information
  @ApiProperty({
    description: 'Street number',
    example: '123',
  })
  streetNo: string;

  @ApiPropertyOptional({ description: 'Street direction (N, S, E, W, NE, etc.)', example: 'N' })
  stDirection?: string;

  @ApiProperty({
    description: 'Street name',
    example: 'Main',
  })
  streetName: string;

  @ApiPropertyOptional({ description: 'Street type (St, Ave, Blvd, etc.)', example: 'St' })
  streetType?: string;

  @ApiPropertyOptional({ description: 'Unit number', example: 'Apt 4B' })
  unitNo?: string;

  @ApiPropertyOptional({ description: 'Unit level', example: '2nd Floor' })
  unitLevel?: string;

  @ApiProperty({
    description: 'City where property is located',
    example: 'Austin',
  })
  city: string;

  @ApiProperty({
    description: 'State where property is located (2-letter code)',
    example: 'TX',
  })
  state: string;

  @ApiProperty({
    description: 'ZIP code',
    example: '78701',
  })
  zipCode: string;

  @ApiPropertyOptional({ description: 'ZIP code extension', example: '1234' })
  zipCodeExt?: string;

  @ApiPropertyOptional({ description: 'County name', example: 'Travis' })
  county?: string;

  @ApiPropertyOptional({ description: 'Subdivision name', example: 'Riverside Estates' })
  subDivision?: string;

  section?: string;

  sectionNo?: string;

  legalDescription?: string;

  legalsubDivision?: string;

  masterPlannedCommunity?: boolean;

  masterPlannedCommunityName?: string;

  // Tax Information
  taxId?: string;

  keyMap?: string;

  censusTract?: string;

  taxId2?: string;

  taxId3?: string;

  // Area Information
  area?: string;

  marketArea?: string;

  etjCity?: string;

  directions?: string;

  // School Information
  elementrySchool?: string;

  // Additional School Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Elementary school name', example: 'Riverside Elementary' })
  elementarySchool?: string;

  @ApiPropertyOptional({ description: 'Middle school name', example: 'Riverside Middle School' })
  middleSchool?: string;

  @ApiPropertyOptional({ description: 'High school name', example: 'Riverside High School' })
  highSchool?: string;

  secondMiddleSchool?: string;

  schoolDistrict?: string;

  publicImprovementDistrict?: string;

  // Building Information
  @ApiPropertyOptional({ description: 'Building square footage', example: 2500, type: 'number' })
  buildingSqft?: number;

  sqftSourceDirection?: string;

  @ApiPropertyOptional({ description: 'Year the property was built', example: '2010' })
  yearBuilt?: string;

  yearBuiltSource?: string;

  stories?: string;

  newConstruction?: boolean;

  newConstructionDesc?: string;

  builderName?: string;

  approxCompletionDate?: string;

  expirationDate?: string;

  // Garage Information
  garadgeDimenssion?: string;

  // Additional Garage Field (frontend sends this)
  garageDimensions?: string;

  utilityDistrict?: string;

  garadgeAptQtrs?: string;

  // Additional Garage Field (frontend sends this)
  garageAptQtrsSqFt?: number;

  SqftSource?: string;

  // Additional Sqft Field (frontend sends this)
  sqftSource?: string;

  guestHouseSqft?: number;

  // Additional Guest House Field (frontend sends this)
  guestHouseSqFt?: number;

  guestHouseSqftSource?: string;

  // Lot Information
  @ApiPropertyOptional({ description: 'Lot size in square feet', example: 10000, type: 'number' })
  lotSize?: number;

  lotSizeSource?: string;

  acres?: string;
  

  acreage?: string;

  lotDimenssions?: string;

  garage?: string;

  carport?: string;

  carportDescription?: string;

  // Array Fields
  access?: string[];

  garageDescription?: string[];

  garageCarportDescriptions?: string[];

  restrictions?: string[];

  @ApiPropertyOptional({ 
    description: 'Property type(s) - array of property types',
    example: ['Single Family', 'Residential'],
    type: [String],
    isArray: true,
  })
  propertyType?: string[];

  style?: string[];

  lotDescription?: string[];

  waterfrontFeatures?: string[];

  // Additional Property Features (frontend sends these)
  frontDoorFaces?: string[];

  ovenType?: string[];

  stoveType?: string[];

  washerDryerConnection?: string[];

  privatePoolDescription?: string[];

  @ApiPropertyOptional({ 
    description: 'Interior features - array of features',
    example: ['crown-molding', 'hardwood-floors', 'granite-countertops'],
    type: [String],
    isArray: true,
  })
  interiorFeatures?: string[];

  flooring?: string[];

  exteriorDescription?: string[];

  constructionMaterials?: string[];

  roofDescription?: string[];

  foundationDescription?: string[];

  energyFeatures?: string[];

  greenEnergyCertifications?: string[];

  heatingSystemDescription?: string[];

  coolingSystemDescription?: string[];

  waterSewerDescription?: string[];

  streetSurface?: string[];

  // Appliances
  microwave?: string;

  dishwasher?: string;

  disposal?: string;

  subDivisionLakeAccess?: string;

  compactor?: string;

  separateIceMaker?: string;

  // Fireplace
  fireplaceNo?: string;

  fireplaceDescription?: string[];

  counterTops?: string;

  // Bedrooms and Bathrooms
  @ApiPropertyOptional({ description: 'Number of bedrooms', example: 3, type: 'number' })
  bedrooms?: number;

  @ApiPropertyOptional({ description: 'Maximum number of bedrooms', example: 4, type: 'number' })
  bedroomsMax?: number;

  @ApiPropertyOptional({ description: 'Number of full bathrooms', example: 2, type: 'number' })
  bathsFull?: number;

  @ApiPropertyOptional({ description: 'Number of half bathrooms', example: 1, type: 'number' })
  bathshalf?: number;

  bedrommDescription?: string[];

  roomDescription?: string[];

  bathroomDescription?: string[];

  kitchenDescription?: string[];

  // Room Details
  room?: Array<{
    roomType: string;
    roomDimension: string;
    roomLocation: string;
  }>;

  // Additional Rooms Field (frontend sends this)
  @ApiPropertyOptional({
    description: 'Room details - array of room objects',
    example: [
      {
        id: 'room-1',
        roomType: 'Living Room',
        roomLocation: 'Main Floor',
        roomDimension: '20x15',
        features: ['fireplace', 'hardwood-floors']
      }
    ],
    type: 'array',
    isArray: true,
  })
  rooms?: Array<{
    id: string;
    roomType: string;
    roomLocation: string;
    roomDimension: string;
    features: string[];
  }>;

  // HQA Information
  mandatoryHQA?: string;

  // Additional HOA Fields (frontend sends these)
  mandatoryHOA?: string;

  mandatoryHQACoName?: string;

  // Additional HOA Management Fields (frontend sends these)
  mandatoryHOAMgmtCoName?: string;

  mandatoryHQACoPhone?: string;

  // Additional HOA Management Fields (frontend sends these)
  mandatoryHOAMgmtCoPhone?: string;

  mandatoryHQACoWebsite?: string;

  // Additional HOA Management Fields (frontend sends these)
  mandatoryHOAMgmtCoWebsite?: string;

  // Financial Information
  financingConsideration?: string[];

  disclosures?: string[];

  exclusions?: string[];

  lossMitigation?: string;

  activeCommunity?: string;

  affordableHousingProgramDescription?: string;

  // Maintenance Fees
  maintainanceFee?: string;

  // Additional Maintenance Field (frontend sends this)
  maintenanceFee?: string;

  maintainanceFeeAmount?: number;

  // Additional Maintenance Field (frontend sends this)
  maintenanceFeeAmount?: number;

  maintainanceFeeSche?: string;

  // Additional Maintenance Field (frontend sends this)
  maintenanceFeePaymentSched?: string;

  maintananceFeeIncludes?: string[];

  // Additional Maintenance Field (frontend sends this)
  maintenanceFeeIncludes?: string[];

  otherMandatoryFees?: string;

  otherMandatoryFeesAmount?: number;

  otherMandatoryFeesIncludes?: string;

  // Tax Information
  taxYear?: string;

  taxes?: number;

  totalTaxRate?: number;

  exemptions?: string;

  ownershipType?: string;

  vacationRentalAllowed?: boolean;

  sellerEmail?: string;

  // Auction Information
  subjectToAuction?: string;

  auctionDate?: string;

  onlineBidding?: boolean;

  biddingDeadline?: string;

  // Agent Information
  listAgent?: string;

  teamId?: string;

  // Additional Team Field (frontend sends this)
  listTeamID?: string;

  liscensedSupervisor?: string;

  // Additional Supervisor Field (frontend sends this)
  licensedSupervisor?: string;

  appointmentPhone?: string;

  appointmentPhoneDesc?: string;

  officePhoneExt?: string;

  agentAlternatePhone?: string;

  alternatePhoneDesc?: string;

  nightPhone?: string;

  faxPhone?: string;

  allowOnlineAppointmentsViaMatrix?: string;

  idxContactInfo?: string;

  coListAgent?: string;

  showingInstructions?: string[];

  buyerAgencyCompensation?: string;

  subAgencyCompensation?: string;

  bonus?: string;

  bonusEndDate?: string;

  variableCompensation?: number;

  // Links and Media
  link1?: string;

  link2?: string;

  floorPlanUrl?: string;

  // Additional Floor Plan Field (frontend sends this)
  interactiveFloorPlanURL?: string;

  videoTourLink?: string;

  // Additional Video Tour Field (frontend sends this)
  videoTourLink1?: string;

  webHyperLink1?: string;

  // Additional Virtual Tour Fields (frontend sends these)
  virtualTourLink1?: string;

  webHyperLink2?: string;

  // Additional Virtual Tour Fields (frontend sends these)
  virtualTourLink2?: string;

  @ApiPropertyOptional({
    description: 'Property images - array of image objects',
    example: [{ image_url: 'https://example.com/image1.jpg' }],
    type: 'array',
    isArray: true,
  })
  images?: Array<{ image_url: string }>;

  golfCourseName?: string;

  poolArea?: string;

  poolPrivate?: string;

  remarks?: string;

  agentRemarks?: string;

  mlsNumber?: string;

  // User relationship (automatically set from JWT token, not required in request)
  @ApiPropertyOptional({
    description: 'User ID (automatically set from authenticated user, do not include in request)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    readOnly: true,
  })
  userId?: string;

  // Note: This DTO contains 200+ additional optional fields not shown here for brevity.
  // All fields from the CreatePropertyDto class are accepted in the request body.
  // Swagger will display all fields when @ApiPropertyOptional is used, but only key fields
  // are explicitly documented above. Other fields include:
  // - Tax information (taxId, keyMap, censusTract, etc.)
  // - School information (elementarySchool, middleSchool, highSchool, etc.)
  // - Lot information (lotSize, acres, lotDimensions, etc.)
  // - HOA information (mandatoryHOA, maintenanceFee, etc.)
  // - Financial details (taxYear, taxes, exemptions, etc.)
  // - Agent information (listAgent, teamId, etc.)
  // - Media links (videoTourLink, virtualTourLink, images, etc.)
  // And many more - see the full DTO class definition for complete field list.
} 