import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsDateString, IsEmail, IsIn, Min, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * CreatePropertyDto - Comprehensive property creation data transfer object
 * 
 * REQUIRED FIELDS:
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
  // Listing Information
  @ApiProperty({
    description: 'Type of property listing',
    enum: ['sale', 'lease', 'both'],
    example: 'sale',
  })
  @IsString()
  @IsIn(['sale', 'lease', 'both'])
  listType: string;

  @ApiProperty({
    description: 'Listing price of the property',
    example: 450000,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  listPrice: number;

  @ApiPropertyOptional({
    description: 'Date when the property was listed',
    example: '2024-01-15',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  listDate?: string;

  @ApiPropertyOptional({
    description: 'Expiration date of the listing',
    example: '2024-07-15',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  ExpDate?: string;

  @ApiPropertyOptional({
    description: 'Whether the property is also available for lease',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  alsoForLease?: boolean;

  @ApiPropertyOptional({
    description: 'Price at lot value',
    example: 150000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  priceAtLotValue?: number;

  // Address Information
  @ApiProperty({
    description: 'Street number of the property',
    example: '123',
  })
  @IsString()
  streetNo: string;

  @ApiPropertyOptional({
    description: 'Street direction (N, S, E, W, NE, NW, SE, SW)',
    example: 'N',
  })
  @IsOptional()
  @IsString()
  stDirection?: string;

  @ApiProperty({
    description: 'Street name',
    example: 'Main',
  })
  @IsString()
  streetName: string;

  @ApiPropertyOptional({
    description: 'Street type (St, Ave, Blvd, Dr, etc.)',
    example: 'St',
  })
  @IsOptional()
  @IsString()
  streetType?: string;

  @ApiPropertyOptional({
    description: 'Unit number (for apartments/condos)',
    example: 'Apt 2B',
  })
  @IsOptional()
  @IsString()
  unitNo?: string;

  @ApiProperty({
    description: 'City where the property is located',
    example: 'Austin',
  })
  @IsString()
  city: string;

  @ApiProperty({
    description: 'State where the property is located',
    example: 'TX',
  })
  @IsString()
  state: string;

  @ApiProperty({
    description: 'ZIP code of the property',
    example: '78701',
  })
  @IsString()
  zipCode: string;

  @ApiPropertyOptional({
    description: 'ZIP code extension',
    example: '1234',
  })
  @IsOptional()
  @IsString()
  zipCodeExt?: string;

  @ApiPropertyOptional({
    description: 'County where the property is located',
    example: 'Travis County',
  })
  @IsOptional()
  @IsString()
  county?: string;

  @ApiPropertyOptional({
    description: 'Subdivision name',
    example: 'Sunset Hills',
  })
  @IsOptional()
  @IsString()
  subDivision?: string;

  @ApiPropertyOptional({
    description: 'Section number',
    example: '1',
  })
  @IsOptional()
  @IsString()
  section?: string;

  @ApiPropertyOptional({
    description: 'Section number',
    example: '1',
  })
  @IsOptional()
  @IsString()
  sectionNo?: string;

  @ApiPropertyOptional({
    description: 'Legal description of the property',
    example: 'Lot 15, Block 3, Sunset Hills Subdivision',
  })
  @IsOptional()
  @IsString()
  legalDescription?: string;

  @ApiPropertyOptional({
    description: 'Legal subdivision name',
    example: 'Sunset Hills Subdivision',
  })
  @IsOptional()
  @IsString()
  legalsubDivision?: string;

  @ApiPropertyOptional({
    description: 'Whether the property is in a master planned community',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  masterPlannedCommunity?: boolean;

  @ApiPropertyOptional({
    description: 'Name of the master planned community',
    example: 'The Woodlands',
  })
  @IsOptional()
  @IsString()
  masterPlannedCommunityName?: string;

  // Tax Information
  @ApiPropertyOptional({
    description: 'Tax ID or parcel number',
    example: '123-456-789',
  })
  @IsOptional()
  @IsString()
  taxId?: string;

  @ApiPropertyOptional({
    description: 'Key map identifier',
    example: 'KM123456',
  })
  @IsOptional()
  @IsString()
  keyMap?: string;

  @ApiPropertyOptional({
    description: 'Census tract number',
    example: '1234.56',
  })
  @IsOptional()
  @IsString()
  censusTract?: string;

  @ApiPropertyOptional({
    description: 'Additional tax ID',
    example: '987-654-321',
  })
  @IsOptional()
  @IsString()
  taxId2?: string;

  @ApiPropertyOptional({
    description: 'Third tax ID',
    example: '456-789-123',
  })
  @IsOptional()
  @IsString()
  taxId3?: string;

  // Area Information
  @ApiPropertyOptional({
    description: 'Area name or identifier',
    example: 'Downtown',
  })
  @IsOptional()
  @IsString()
  area?: string;

  @ApiPropertyOptional({
    description: 'Market area designation',
    example: 'Central Austin',
  })
  @IsOptional()
  @IsString()
  marketArea?: string;

  @ApiPropertyOptional({
    description: 'Extra territorial jurisdiction city',
    example: 'Austin',
  })
  @IsOptional()
  @IsString()
  etjCity?: string;

  // School Information
  @ApiPropertyOptional({
    description: 'Elementary school name (legacy field)',
    example: 'Austin Elementary',
  })
  @IsOptional()
  @IsString()
  elementrySchool?: string;

  // Additional School Field (frontend sends this)
  @ApiPropertyOptional({
    description: 'Elementary school name',
    example: 'Austin Elementary',
  })
  @IsOptional()
  @IsString()
  elementarySchool?: string;

  @ApiPropertyOptional({
    description: 'Middle school name',
    example: 'Austin Middle School',
  })
  @IsOptional()
  @IsString()
  middleSchool?: string;

  @ApiPropertyOptional({
    description: 'High school name',
    example: 'Austin High School',
  })
  @IsOptional()
  @IsString()
  highSchool?: string;

  @ApiPropertyOptional({
    description: 'Second middle school name',
    example: 'Austin Middle School North',
  })
  @IsOptional()
  @IsString()
  secondMiddleSchool?: string;

  @ApiPropertyOptional({
    description: 'School district name',
    example: 'Austin Independent School District',
  })
  @IsOptional()
  @IsString()
  schoolDistrict?: string;

  @ApiPropertyOptional({
    description: 'Public improvement district name',
    example: 'Downtown Austin PID',
  })
  @IsOptional()
  @IsString()
  publicImprovementDistrict?: string;

  // Building Information
  @ApiPropertyOptional({
    description: 'Building square footage',
    example: 2500,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  buildingSqft?: number;

  @ApiPropertyOptional({
    description: 'Source direction for square footage',
    example: 'North',
  })
  @IsOptional()
  @IsString()
  sqftSourceDirection?: string;

  @ApiPropertyOptional({
    description: 'Year the property was built',
    example: '2020',
  })
  @IsOptional()
  @IsString()
  yearBuilt?: string;

  @ApiPropertyOptional({
    description: 'Source of year built information',
    example: 'Builder',
  })
  @IsOptional()
  @IsString()
  yearBuiltSource?: string;

  @ApiPropertyOptional({
    description: 'Number of stories',
    example: '2',
  })
  @IsOptional()
  @IsString()
  stories?: string;

  @ApiPropertyOptional({
    description: 'Whether this is new construction',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  newConstruction?: boolean;

  @ApiPropertyOptional({
    description: 'New construction description',
    example: 'Custom built home with modern amenities',
  })
  @IsOptional()
  @IsString()
  newConstructionDesc?: string;

  @ApiPropertyOptional({
    description: 'Name of the builder',
    example: 'ABC Construction Company',
  })
  @IsOptional()
  @IsString()
  builderName?: string;

  @ApiPropertyOptional({
    description: 'Approximate completion date',
    example: '2024-06-15',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  approxCompletionDate?: string;

  @ApiPropertyOptional({
    description: 'Expiration date of the listing',
    example: '2024-12-31',
    format: 'date',
  })
  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  // Garage Information
  @IsOptional()
  @IsString()
  garadgeDimenssion?: string;

  // Additional Garage Field (frontend sends this)
  @IsOptional()
  @IsString()
  garageDimensions?: string;

  @IsOptional()
  @IsString()
  utilityDistrict?: string;

  @IsOptional()
  @IsString()
  garadgeAptQtrs?: string;

  // Additional Garage Field (frontend sends this)
  @IsOptional()
  @IsNumber()
  garageAptQtrsSqFt?: number;

  @IsOptional()
  @IsString()
  SqftSource?: string;

  // Additional Sqft Field (frontend sends this)
  @IsOptional()
  @IsString()
  sqftSource?: string;

  @IsOptional()
  @IsNumber()
  guestHouseSqft?: number;

  // Additional Guest House Field (frontend sends this)
  @IsOptional()
  @IsNumber()
  guestHouseSqFt?: number;

  @IsOptional()
  @IsString()
  guestHouseSqftSource?: string;

  // Lot Information
  @ApiPropertyOptional({
    description: 'Lot size in square feet',
    example: 10000,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  lotSize?: number;

  @ApiPropertyOptional({
    description: 'Source of lot size information',
    example: 'Survey',
  })
  @IsOptional()
  @IsString()
  lotSizeSource?: string;

  @ApiPropertyOptional({
    description: 'Lot size in acres',
    example: '0.25',
  })
  @IsOptional()
  @IsString()
  acres?: string;
  

  @ApiPropertyOptional({
    description: 'Acreage of the lot',
    example: '0.25 acres',
  })
  @IsOptional()
  @IsString()
  acreage?: string;

  @ApiPropertyOptional({
    description: 'Lot dimensions',
    example: '100x100',
  })
  @IsOptional()
  @IsString()
  lotDimenssions?: string;

  @ApiPropertyOptional({
    description: 'Garage information',
    example: '2 car attached',
  })
  @IsOptional()
  @IsString()
  garage?: string;

  @ApiPropertyOptional({
    description: 'Carport information',
    example: '1 car covered',
  })
  @IsOptional()
  @IsString()
  carport?: string;

  @ApiPropertyOptional({
    description: 'Carport description',
    example: 'Covered carport with storage',
  })
  @IsOptional()
  @IsString()
  carportDescription?: string;

  // Array Fields
  @ApiPropertyOptional({
    description: 'Access information',
    example: ['Gated', 'Private road'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  access?: string[];

  @ApiPropertyOptional({
    description: 'Garage descriptions',
    example: ['2 car attached', 'Workshop area'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  garageDescription?: string[];

  @ApiPropertyOptional({
    description: 'Garage and carport descriptions',
    example: ['2 car attached garage', 'Covered carport'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  garageCarportDescriptions?: string[];

  @ApiPropertyOptional({
    description: 'Property restrictions',
    example: ['HOA restrictions', 'No pets'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  restrictions?: string[];

  @ApiPropertyOptional({
    description: 'Property types',
    example: ['Single Family', 'Residential'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  propertyType?: string[];

  @ApiPropertyOptional({
    description: 'Architectural styles',
    example: ['Modern', 'Contemporary'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  style?: string[];

  @ApiPropertyOptional({
    description: 'Lot descriptions',
    example: ['Corner lot', 'Cul-de-sac'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  lotDescription?: string[];

  @ApiPropertyOptional({
    description: 'Waterfront features',
    example: ['Lake view', 'Water access'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  waterfrontFeatures?: string[];

  // Additional Property Features (frontend sends these)
  @IsOptional()
  @IsString()
  frontDoorFaces?: string;

  @IsOptional()
  @IsString()
  ovenType?: string;

  @IsOptional()
  @IsString()
  stoveType?: string;

  @IsOptional()
  @IsString()
  washerDryerConnection?: string;

  @IsOptional()
  @IsString()
  privatePoolDescription?: string;

  @IsOptional()
  @IsString()
  interiorFeatures?: string;

  @IsOptional()
  @IsString()
  flooring?: string;

  @IsOptional()
  @IsString()
  exteriorDescription?: string;

  @IsOptional()
  @IsString()
  constructionMaterials?: string;

  @IsOptional()
  @IsString()
  roofDescription?: string;

  @IsOptional()
  @IsString()
  foundationDescription?: string;

  @IsOptional()
  @IsString()
  energyFeatures?: string;

  @IsOptional()
  @IsString()
  greenEnergyCertifications?: string;

  @IsOptional()
  @IsString()
  heatingSystemDescription?: string;

  @IsOptional()
  @IsString()
  coolingSystemDescription?: string;

  @IsOptional()
  @IsString()
  waterSewerDescription?: string;

  @IsOptional()
  @IsString()
  streetSurface?: string;

  // Appliances
  @IsOptional()
  @IsString()
  microwave?: string;

  @IsOptional()
  @IsString()
  dishwasher?: string;

  @IsOptional()
  @IsString()
  disposal?: string;

  @IsOptional()
  @IsString()
  subDivisionLakeAccess?: string;

  @IsOptional()
  @IsString()
  compactor?: string;

  @IsOptional()
  @IsString()
  separateIceMaker?: string;

  // Fireplace
  @IsOptional()
  @IsString()
  fireplaceNo?: string;

  @IsOptional()
  @IsArray()
  fireplaceDescription?: string[];

  @IsOptional()
  @IsString()
  counterTops?: string;

  // Bedrooms and Bathrooms
  @ApiPropertyOptional({
    description: 'Number of bedrooms',
    example: ['3'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  bedrooms?: string[];

  @ApiPropertyOptional({
    description: 'Maximum number of bedrooms',
    example: ['4'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  bedroomsMax?: string[];

  @ApiPropertyOptional({
    description: 'Number of full bathrooms',
    example: ['2'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  bathsFull?: string[];

  @ApiPropertyOptional({
    description: 'Number of half bathrooms',
    example: ['1'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  bathshalf?: string[];

  @IsOptional()
  @IsArray()
  bedrommDescription?: string[];

  @IsOptional()
  @IsArray()
  roomDescription?: string[];

  @IsOptional()
  @IsArray()
  bathroomDescription?: string[];

  @IsOptional()
  @IsArray()
  kitchenDescription?: string[];

  // Room Details
  @IsOptional()
  @IsArray()
  room?: Array<{
    roomType: string;
    roomDimension: string;
    roomLocation: string;
  }>;

  // Additional Rooms Field (frontend sends this)
  @IsOptional()
  @IsArray()
  rooms?: Array<{
    id: string;
    roomType: string;
    roomLocation: string;
    roomDimension: string;
    features: string[];
  }>;

  // HQA Information
  @IsOptional()
  @IsString()
  mandatoryHQA?: string;

  // Additional HOA Fields (frontend sends these)
  @IsOptional()
  @IsString()
  mandatoryHOA?: string;

  @IsOptional()
  @IsString()
  mandatoryHQACoName?: string;

  // Additional HOA Management Fields (frontend sends these)
  @IsOptional()
  @IsString()
  mandatoryHOAMgmtCoName?: string;

  @IsOptional()
  @IsString()
  mandatoryHQACoPhone?: string;

  // Additional HOA Management Fields (frontend sends these)
  @IsOptional()
  @IsString()
  mandatoryHOAMgmtCoPhone?: string;

  @IsOptional()
  @IsString()
  mandatoryHQACoWebsite?: string;

  // Additional HOA Management Fields (frontend sends these)
  @IsOptional()
  @IsString()
  mandatoryHOAMgmtCoWebsite?: string;

  // Financial Information
  @IsOptional()
  @IsArray()
  financingConsideration?: string[];

  @IsOptional()
  @IsArray()
  disclosures?: string[];

  @IsOptional()
  @IsArray()
  exclusions?: string[];

  @IsOptional()
  @IsString()
  lossMitigation?: string;

  @IsOptional()
  @IsString()
  activeCommunity?: string;

  @IsOptional()
  @IsString()
  affordableHousingProgramDescription?: string;

  // Maintenance Fees
  @IsOptional()
  @IsString()
  maintainanceFee?: string;

  // Additional Maintenance Field (frontend sends this)
  @IsOptional()
  @IsString()
  maintenanceFee?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maintainanceFeeAmount?: number;

  // Additional Maintenance Field (frontend sends this)
  @IsOptional()
  @IsNumber()
  @Min(0)
  maintenanceFeeAmount?: number;

  @IsOptional()
  @IsString()
  maintainanceFeeSche?: string;

  // Additional Maintenance Field (frontend sends this)
  @IsOptional()
  @IsString()
  maintenanceFeePaymentSched?: string;

  @IsOptional()
  @IsArray()
  maintananceFeeIncludes?: string[];

  // Additional Maintenance Field (frontend sends this)
  @IsOptional()
  @IsArray()
  maintenanceFeeIncludes?: string[];

  @IsOptional()
  @IsString()
  otherMandatoryFees?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  otherMandatoryFeesAmount?: number;

  @IsOptional()
  @IsString()
  otherMandatoryFeesIncludes?: string;

  // Tax Information
  @IsOptional()
  @IsString()
  taxYear?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  taxes?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalTaxRate?: number;

  @IsOptional()
  @IsString()
  exemptions?: string;

  @IsOptional()
  @IsString()
  ownershipType?: string;

  @IsOptional()
  @IsBoolean()
  vacationRentalAllowed?: boolean;

  @IsOptional()
  @IsEmail()
  sellerEmail?: string;

  // Auction Information
  @IsOptional()
  @IsString()
  subjectToAuction?: string;

  @IsOptional()
  @IsDateString()
  auctionDate?: string;

  @IsOptional()
  @IsBoolean()
  onlineBidding?: boolean;

  @IsOptional()
  @IsString()
  biddingDeadline?: string;

  // Agent Information
  @IsOptional()
  @IsString()
  listAgent?: string;

  @IsOptional()
  @IsString()
  teamId?: string;

  // Additional Team Field (frontend sends this)
  @IsOptional()
  @IsString()
  listTeamID?: string;

  @IsOptional()
  @IsString()
  liscensedSupervisor?: string;

  // Additional Supervisor Field (frontend sends this)
  @IsOptional()
  @IsString()
  licensedSupervisor?: string;

  @IsOptional()
  @IsString()
  appointmentPhone?: string;

  @IsOptional()
  @IsString()
  appointmentPhoneDesc?: string;

  @IsOptional()
  @IsString()
  officePhoneExt?: string;

  @IsOptional()
  @IsString()
  agentAlternatePhone?: string;

  @IsOptional()
  @IsString()
  alternatePhoneDesc?: string;

  @IsOptional()
  @IsString()
  nightPhone?: string;

  @IsOptional()
  @IsString()
  faxPhone?: string;

  @IsOptional()
  @IsString()
  allowOnlineAppointmentsViaMatrix?: string;

  @IsOptional()
  @IsString()
  idxContactInfo?: string;

  @IsOptional()
  @IsString()
  coListAgent?: string;

  @IsOptional()
  @IsArray()
  showingInstructions?: string[];

  @IsOptional()
  @IsString()
  buyerAgencyCompensation?: string;

  @IsOptional()
  @IsString()
  subAgencyCompensation?: string;

  @IsOptional()
  @IsString()
  bonus?: string;

  @IsOptional()
  @IsDateString()
  bonusEndDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  variableCompensation?: number;

  // Links and Media
  @IsOptional()
  @IsString()
  link1?: string;

  @IsOptional()
  @IsString()
  link2?: string;

  @IsOptional()
  @IsString()
  floorPlanUrl?: string;

  // Additional Floor Plan Field (frontend sends this)
  @IsOptional()
  @IsString()
  interactiveFloorPlanURL?: string;

  @IsOptional()
  @IsString()
  videoTourLink?: string;

  // Additional Video Tour Field (frontend sends this)
  @IsOptional()
  @IsString()
  videoTourLink1?: string;

  @IsOptional()
  @IsString()
  webHyperLink1?: string;

  // Additional Virtual Tour Fields (frontend sends these)
  @IsOptional()
  @IsString()
  virtualTourLink1?: string;

  @IsOptional()
  @IsString()
  webHyperLink2?: string;

  // Additional Virtual Tour Fields (frontend sends these)
  @IsOptional()
  @IsString()
  virtualTourLink2?: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  // User relationship
  @IsUUID()
  userId: string;
} 