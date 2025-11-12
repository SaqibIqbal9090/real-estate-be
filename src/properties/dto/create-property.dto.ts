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

  @ApiPropertyOptional({ description: 'Section', example: 'Section A' })
  section?: string;

  @ApiPropertyOptional({ description: 'Section number', example: '1' })
  sectionNo?: string;

  @ApiPropertyOptional({ description: 'Legal description', example: 'Lot 5, Block 3' })
  legalDescription?: string;

  @ApiPropertyOptional({ description: 'Legal subdivision', example: 'Riverside Estates' })
  legalsubDivision?: string;

  @ApiPropertyOptional({ description: 'Master planned community', example: true, type: 'boolean' })
  masterPlannedCommunity?: boolean;

  @ApiPropertyOptional({ description: 'Master planned community name', example: 'Riverside Community' })
  masterPlannedCommunityName?: string;

  // Tax Information
  @ApiPropertyOptional({ description: 'Tax ID', example: '123456789' })
  taxId?: string;

  @ApiPropertyOptional({ description: 'Key map', example: 'MAP-001' })
  keyMap?: string;

  @ApiPropertyOptional({ description: 'Census tract', example: '0012.03' })
  censusTract?: string;

  @ApiPropertyOptional({ description: 'Tax ID 2', example: '987654321' })
  taxId2?: string;

  @ApiPropertyOptional({ description: 'Tax ID 3', example: '456789123' })
  taxId3?: string;

  // Area Information
  @ApiPropertyOptional({ description: 'Area', example: 'Downtown' })
  area?: string;

  @ApiPropertyOptional({ description: 'Market area', example: 'Central Austin' })
  marketArea?: string;

  @ApiPropertyOptional({ description: 'ETJ city', example: 'Austin' })
  etjCity?: string;

  @ApiPropertyOptional({ description: 'Directions to property', example: 'From I-35, take exit 234' })
  directions?: string;

  // School Information
  @ApiPropertyOptional({ description: 'Elementary school (alternative spelling)', example: 'Riverside Elementary' })
  elementrySchool?: string;

  // Additional School Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Elementary school name', example: 'Riverside Elementary' })
  elementarySchool?: string;

  @ApiPropertyOptional({ description: 'Middle school name', example: 'Riverside Middle School' })
  middleSchool?: string;

  @ApiPropertyOptional({ description: 'High school name', example: 'Riverside High School' })
  highSchool?: string;

  @ApiPropertyOptional({ description: 'Second middle school', example: 'Riverside Middle School 2' })
  secondMiddleSchool?: string;

  @ApiPropertyOptional({ description: 'School district', example: 'Austin ISD' })
  schoolDistrict?: string;

  @ApiPropertyOptional({ description: 'Public improvement district', example: 'PID-001' })
  publicImprovementDistrict?: string;

  // Building Information
  @ApiPropertyOptional({ description: 'Building square footage', example: 2500, type: 'number' })
  buildingSqft?: number;

  @ApiPropertyOptional({ description: 'Square footage source direction', example: 'North' })
  sqftSourceDirection?: string;

  @ApiPropertyOptional({ description: 'Year the property was built', example: '2010' })
  yearBuilt?: string;

  @ApiPropertyOptional({ description: 'Year built source', example: 'County Records' })
  yearBuiltSource?: string;

  @ApiPropertyOptional({ description: 'Number of stories', example: '2' })
  stories?: string;

  @ApiPropertyOptional({ description: 'New construction', example: false, type: 'boolean' })
  newConstruction?: boolean;

  @ApiPropertyOptional({ description: 'New construction description', example: 'Under construction, completion expected Q2 2024' })
  newConstructionDesc?: string;

  @ApiPropertyOptional({ description: 'Builder name', example: 'ABC Construction' })
  builderName?: string;

  @ApiPropertyOptional({ description: 'Approximate completion date', example: '2024-06-30' })
  approxCompletionDate?: string;

  @ApiPropertyOptional({ description: 'Expiration date', example: '2024-12-31' })
  expirationDate?: string;

  // Garage Information
  @ApiPropertyOptional({ description: 'Garage dimensions (alternative spelling)', example: '20x20' })
  garadgeDimenssion?: string;

  // Additional Garage Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Garage dimensions', example: '20x20' })
  garageDimensions?: string;

  @ApiPropertyOptional({ description: 'Utility district', example: 'Austin Energy' })
  utilityDistrict?: string;

  @ApiPropertyOptional({ description: 'Garage apartment quarters (alternative spelling)', example: '1BR' })
  garadgeAptQtrs?: string;

  // Additional Garage Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Garage apartment quarters square footage', example: 500, type: 'number' })
  garageAptQtrsSqFt?: number;

  @ApiPropertyOptional({ description: 'Square footage source (alternative spelling)', example: 'Appraiser' })
  SqftSource?: string;

  // Additional Sqft Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Square footage source', example: 'Appraiser' })
  sqftSource?: string;

  @ApiPropertyOptional({ description: 'Guest house square footage (alternative spelling)', example: 800, type: 'number' })
  guestHouseSqft?: number;

  // Additional Guest House Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Guest house square footage', example: 800, type: 'number' })
  guestHouseSqFt?: number;

  @ApiPropertyOptional({ description: 'Guest house square footage source', example: 'Builder' })
  guestHouseSqftSource?: string;

  // Lot Information
  @ApiPropertyOptional({ description: 'Lot size in square feet', example: 10000, type: 'number' })
  lotSize?: number;

  @ApiPropertyOptional({ description: 'Lot size source', example: 'Survey' })
  lotSizeSource?: string;

  @ApiPropertyOptional({ description: 'Acres', example: '0.25' })
  acres?: string;
  
  @ApiPropertyOptional({ description: 'Acreage', example: '0.25 acres' })
  acreage?: string;

  @ApiPropertyOptional({ description: 'Lot dimensions (alternative spelling)', example: '100x150' })
  lotDimenssions?: string;

  @ApiPropertyOptional({ description: 'Garage', example: '2 Car Attached' })
  garage?: string;

  @ApiPropertyOptional({ description: 'Carport', example: '1 Car' })
  carport?: string;

  @ApiPropertyOptional({ description: 'Carport description', example: 'Covered carport with storage', type: [String], isArray: true })
  carportDescription?: string;

  // Array Fields
  @ApiPropertyOptional({ description: 'Access methods', example: ['Gated', 'Keypad'], type: [String], isArray: true })
  access?: string[];

  @ApiPropertyOptional({ description: 'Garage description', example: ['Attached', 'Workshop'], type: [String], isArray: true })
  garageDescription?: string[];

  @ApiPropertyOptional({ description: 'Garage and carport descriptions', example: ['2 Car Attached', 'Covered'], type: [String], isArray: true })
  garageCarportDescriptions?: string[];

  @ApiPropertyOptional({ description: 'Property restrictions', example: ['HOA', 'Deed Restrictions'], type: [String], isArray: true })
  restrictions?: string[];

  @ApiPropertyOptional({ 
    description: 'Property type(s) - array of property types',
    example: ['Single Family', 'Residential'],
    type: [String],
    isArray: true,
  })
  propertyType?: string[];

  @ApiPropertyOptional({ description: 'Property style', example: ['Modern', 'Contemporary'], type: [String], isArray: true })
  style?: string[];

  @ApiPropertyOptional({ description: 'Lot description', example: ['Corner Lot', 'Cul-de-sac'], type: [String], isArray: true })
  lotDescription?: string[];

  @ApiPropertyOptional({ description: 'Waterfront features', example: ['Lake View', 'Boat Dock'], type: [String], isArray: true })
  waterfrontFeatures?: string[];

  // Additional Property Features (frontend sends these)
  @ApiPropertyOptional({ description: 'Front door faces direction', example: ['North'], type: [String], isArray: true })
  frontDoorFaces?: string[];

  @ApiPropertyOptional({ description: 'Oven type', example: ['Gas', 'Electric'], type: [String], isArray: true })
  ovenType?: string[];

  @ApiPropertyOptional({ description: 'Stove type', example: ['Gas', 'Induction'], type: [String], isArray: true })
  stoveType?: string[];

  @ApiPropertyOptional({ description: 'Washer and dryer connection', example: ['Gas', 'Electric'], type: [String], isArray: true })
  washerDryerConnection?: string[];

  @ApiPropertyOptional({ description: 'Private pool description', example: ['In-ground', 'Heated'], type: [String], isArray: true })
  privatePoolDescription?: string[];

  @ApiPropertyOptional({ 
    description: 'Interior features - array of features',
    example: ['crown-molding', 'hardwood-floors', 'granite-countertops'],
    type: [String],
    isArray: true,
  })
  interiorFeatures?: string[];

  @ApiPropertyOptional({ description: 'Flooring types', example: ['Hardwood', 'Tile', 'Carpet'], type: [String], isArray: true })
  flooring?: string[];

  @ApiPropertyOptional({ description: 'Exterior description', example: ['Brick', 'Stone'], type: [String], isArray: true })
  exteriorDescription?: string[];

  @ApiPropertyOptional({ description: 'Construction materials', example: ['Brick', 'Concrete'], type: [String], isArray: true })
  constructionMaterials?: string[];

  @ApiPropertyOptional({ description: 'Roof description', example: ['Tile', 'Metal'], type: [String], isArray: true })
  roofDescription?: string[];

  @ApiPropertyOptional({ description: 'Foundation description', example: ['Slab', 'Crawl Space'], type: [String], isArray: true })
  foundationDescription?: string[];

  @ApiPropertyOptional({ description: 'Energy features', example: ['Solar Panels', 'Energy Star'], type: [String], isArray: true })
  energyFeatures?: string[];

  @ApiPropertyOptional({ description: 'Green energy certifications', example: ['LEED', 'Energy Star'], type: [String], isArray: true })
  greenEnergyCertifications?: string[];

  @ApiPropertyOptional({ description: 'Heating system description', example: ['Central Air', 'Heat Pump'], type: [String], isArray: true })
  heatingSystemDescription?: string[];

  @ApiPropertyOptional({ description: 'Cooling system description', example: ['Central Air', 'Window Units'], type: [String], isArray: true })
  coolingSystemDescription?: string[];

  @ApiPropertyOptional({ description: 'Water and sewer description', example: ['Public Water', 'Septic'], type: [String], isArray: true })
  waterSewerDescription?: string[];

  @ApiPropertyOptional({ description: 'Street surface', example: ['Paved', 'Concrete'], type: [String], isArray: true })
  streetSurface?: string[];

  // Appliances
  @ApiPropertyOptional({ description: 'Microwave', example: 'Built-in' })
  microwave?: string;

  @ApiPropertyOptional({ description: 'Dishwasher', example: 'Yes' })
  dishwasher?: string;

  @ApiPropertyOptional({ description: 'Garbage disposal', example: 'Yes' })
  disposal?: string;

  @ApiPropertyOptional({ description: 'Subdivision lake access', example: 'Yes' })
  subDivisionLakeAccess?: string;

  @ApiPropertyOptional({ description: 'Trash compactor', example: 'Yes' })
  compactor?: string;

  @ApiPropertyOptional({ description: 'Separate ice maker', example: 'Yes' })
  separateIceMaker?: string;

  // Fireplace
  @ApiPropertyOptional({ description: 'Number of fireplaces', example: '2' })
  fireplaceNo?: string;

  @ApiPropertyOptional({ description: 'Fireplace description', example: ['Gas', 'Wood Burning'], type: [String], isArray: true })
  fireplaceDescription?: string[];

  @ApiPropertyOptional({ description: 'Countertops', example: 'Granite' })
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

  @ApiPropertyOptional({ description: 'Bedroom description (alternative spelling)', example: ['Master Suite', 'Walk-in Closet'], type: [String], isArray: true })
  bedrommDescription?: string[];

  @ApiPropertyOptional({ description: 'Room description', example: ['Living Room', 'Dining Room'], type: [String], isArray: true })
  roomDescription?: string[];

  @ApiPropertyOptional({ description: 'Bathroom description', example: ['Master Bath', 'Guest Bath'], type: [String], isArray: true })
  bathroomDescription?: string[];

  @ApiPropertyOptional({ description: 'Kitchen description', example: ['Gourmet', 'Island'], type: [String], isArray: true })
  kitchenDescription?: string[];

  // Room Details
  @ApiPropertyOptional({
    description: 'Room details (legacy format)',
    example: [
      {
        roomType: 'Living Room',
        roomDimension: '20x15',
        roomLocation: 'Main Floor'
      }
    ],
    type: 'array',
    isArray: true,
  })
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
  @ApiPropertyOptional({ description: 'Mandatory HQA (alternative spelling)', example: 'Yes' })
  mandatoryHQA?: string;

  // Additional HOA Fields (frontend sends these)
  @ApiPropertyOptional({ description: 'Mandatory HOA', example: 'Yes' })
  mandatoryHOA?: string;

  @ApiPropertyOptional({ description: 'HOA company name (alternative spelling)', example: 'Riverside HOA' })
  mandatoryHQACoName?: string;

  // Additional HOA Management Fields (frontend sends these)
  @ApiPropertyOptional({ description: 'HOA management company name', example: 'Riverside Management Co' })
  mandatoryHOAMgmtCoName?: string;

  @ApiPropertyOptional({ description: 'HOA company phone (alternative spelling)', example: '512-555-1234' })
  mandatoryHQACoPhone?: string;

  // Additional HOA Management Fields (frontend sends these)
  @ApiPropertyOptional({ description: 'HOA management company phone', example: '512-555-1234' })
  mandatoryHOAMgmtCoPhone?: string;

  @ApiPropertyOptional({ description: 'HOA company website (alternative spelling)', example: 'https://riversidehoa.com' })
  mandatoryHQACoWebsite?: string;

  // Additional HOA Management Fields (frontend sends these)
  @ApiPropertyOptional({ description: 'HOA management company website', example: 'https://riversidehoa.com' })
  mandatoryHOAMgmtCoWebsite?: string;

  // Financial Information
  @ApiPropertyOptional({ description: 'Financing considerations', example: ['VA Loan', 'FHA'], type: [String], isArray: true })
  financingConsideration?: string[];

  @ApiPropertyOptional({ description: 'Disclosures', example: ['Seller Disclosure', 'Lead Paint'], type: [String], isArray: true })
  disclosures?: string[];

  @ApiPropertyOptional({ description: 'Exclusions', example: ['Chandelier', 'Refrigerator'], type: [String], isArray: true })
  exclusions?: string[];

  @ApiPropertyOptional({ description: 'Loss mitigation', example: 'Short Sale' })
  lossMitigation?: string;

  @ApiPropertyOptional({ description: 'Active community', example: '55+ Community' })
  activeCommunity?: string;

  @ApiPropertyOptional({ description: 'Affordable housing program description', example: 'First-time buyer program' })
  affordableHousingProgramDescription?: string;

  // Maintenance Fees
  @ApiPropertyOptional({ description: 'Maintenance fee (alternative spelling)', example: 'Monthly' })
  maintainanceFee?: string;

  // Additional Maintenance Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Maintenance fee', example: 'Monthly' })
  maintenanceFee?: string;

  @ApiPropertyOptional({ description: 'Maintenance fee amount (alternative spelling)', example: 200, type: 'number' })
  maintainanceFeeAmount?: number;

  // Additional Maintenance Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Maintenance fee amount', example: 200, type: 'number' })
  maintenanceFeeAmount?: number;

  @ApiPropertyOptional({ description: 'Maintenance fee schedule (alternative spelling)', example: 'Monthly' })
  maintainanceFeeSche?: string;

  // Additional Maintenance Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Maintenance fee payment schedule', example: 'Monthly' })
  maintenanceFeePaymentSched?: string;

  @ApiPropertyOptional({ description: 'Maintenance fee includes (alternative spelling)', example: ['Landscaping', 'Pool'], type: [String], isArray: true })
  maintananceFeeIncludes?: string[];

  // Additional Maintenance Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Maintenance fee includes', example: ['Landscaping', 'Pool'], type: [String], isArray: true })
  maintenanceFeeIncludes?: string[];

  @ApiPropertyOptional({ description: 'Other mandatory fees', example: 'Transfer Fee' })
  otherMandatoryFees?: string;

  @ApiPropertyOptional({ description: 'Other mandatory fees amount', example: 500, type: 'number' })
  otherMandatoryFeesAmount?: number;

  @ApiPropertyOptional({ description: 'Other mandatory fees includes', example: 'HOA Transfer Fee' })
  otherMandatoryFeesIncludes?: string;

  // Tax Information
  @ApiPropertyOptional({ description: 'Tax year', example: '2023' })
  taxYear?: string;

  @ApiPropertyOptional({ description: 'Annual taxes', example: 8500, type: 'number' })
  taxes?: number;

  @ApiPropertyOptional({ description: 'Total tax rate', example: 2.5, type: 'number' })
  totalTaxRate?: number;

  @ApiPropertyOptional({ description: 'Tax exemptions', example: 'Homestead' })
  exemptions?: string;

  @ApiPropertyOptional({ description: 'Ownership type', example: 'Fee Simple' })
  ownershipType?: string;

  @ApiPropertyOptional({ description: 'Vacation rental allowed', example: true, type: 'boolean' })
  vacationRentalAllowed?: boolean;

  @ApiPropertyOptional({ description: 'Seller email', example: 'seller@example.com', format: 'email' })
  sellerEmail?: string;

  // Auction Information
  @ApiPropertyOptional({ description: 'Subject to auction', example: 'Yes' })
  subjectToAuction?: string;

  @ApiPropertyOptional({ description: 'Auction date', example: '2024-03-15' })
  auctionDate?: string;

  @ApiPropertyOptional({ description: 'Online bidding available', example: true, type: 'boolean' })
  onlineBidding?: boolean;

  @ApiPropertyOptional({ description: 'Bidding deadline', example: '2024-03-15T18:00:00Z' })
  biddingDeadline?: string;

  // Agent Information
  @ApiPropertyOptional({ description: 'Listing agent name', example: 'John Doe' })
  listAgent?: string;

  @ApiPropertyOptional({ description: 'Team ID', example: 'TEAM-001' })
  teamId?: string;

  // Additional Team Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Listing team ID', example: 'TEAM-001' })
  listTeamID?: string;

  @ApiPropertyOptional({ description: 'Licensed supervisor (alternative spelling)', example: 'Jane Smith' })
  liscensedSupervisor?: string;

  // Additional Supervisor Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Licensed supervisor', example: 'Jane Smith' })
  licensedSupervisor?: string;

  @ApiPropertyOptional({ description: 'Appointment phone', example: '512-555-1234' })
  appointmentPhone?: string;

  @ApiPropertyOptional({ description: 'Appointment phone description', example: 'Call for showing' })
  appointmentPhoneDesc?: string;

  @ApiPropertyOptional({ description: 'Office phone extension', example: '123' })
  officePhoneExt?: string;

  @ApiPropertyOptional({ description: 'Agent alternate phone', example: '512-555-5678' })
  agentAlternatePhone?: string;

  @ApiPropertyOptional({ description: 'Alternate phone description', example: 'Mobile' })
  alternatePhoneDesc?: string;

  @ApiPropertyOptional({ description: 'Night phone', example: '512-555-9999' })
  nightPhone?: string;

  @ApiPropertyOptional({ description: 'Fax phone', example: '512-555-0000' })
  faxPhone?: string;

  @ApiPropertyOptional({ description: 'Allow online appointments via Matrix', example: 'Yes' })
  allowOnlineAppointmentsViaMatrix?: string;

  @ApiPropertyOptional({ description: 'IDX contact info', example: 'Contact via MLS' })
  idxContactInfo?: string;

  @ApiPropertyOptional({ description: 'Co-listing agent', example: 'Bob Johnson' })
  coListAgent?: string;

  @ApiPropertyOptional({ description: 'Showing instructions', example: ['Call ahead', 'Lockbox'], type: [String], isArray: true })
  showingInstructions?: string[];

  @ApiPropertyOptional({ description: 'Buyer agency compensation', example: '2.5%' })
  buyerAgencyCompensation?: string;

  @ApiPropertyOptional({ description: 'Sub-agency compensation', example: '2.0%' })
  subAgencyCompensation?: string;

  @ApiPropertyOptional({ description: 'Bonus', example: '$5000' })
  bonus?: string;

  @ApiPropertyOptional({ description: 'Bonus end date', example: '2024-12-31' })
  bonusEndDate?: string;

  @ApiPropertyOptional({ description: 'Variable compensation', example: 1000, type: 'number' })
  variableCompensation?: number;

  // Links and Media
  @ApiPropertyOptional({ description: 'Link 1', example: 'https://example.com/link1' })
  link1?: string;

  @ApiPropertyOptional({ description: 'Link 2', example: 'https://example.com/link2' })
  link2?: string;

  @ApiPropertyOptional({ description: 'Floor plan URL', example: 'https://example.com/floorplan.pdf' })
  floorPlanUrl?: string;

  // Additional Floor Plan Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Interactive floor plan URL', example: 'https://example.com/interactive-floorplan' })
  interactiveFloorPlanURL?: string;

  @ApiPropertyOptional({ description: 'Video tour link', example: 'https://youtube.com/watch?v=123' })
  videoTourLink?: string;

  // Additional Video Tour Field (frontend sends this)
  @ApiPropertyOptional({ description: 'Video tour link 1', example: 'https://youtube.com/watch?v=123' })
  videoTourLink1?: string;

  @ApiPropertyOptional({ description: 'Web hyperlink 1', example: 'https://example.com/tour1' })
  webHyperLink1?: string;

  // Additional Virtual Tour Fields (frontend sends these)
  @ApiPropertyOptional({ description: 'Virtual tour link 1', example: 'https://example.com/virtual-tour1' })
  virtualTourLink1?: string;

  @ApiPropertyOptional({ description: 'Web hyperlink 2', example: 'https://example.com/tour2' })
  webHyperLink2?: string;

  // Additional Virtual Tour Fields (frontend sends these)
  @ApiPropertyOptional({ description: 'Virtual tour link 2', example: 'https://example.com/virtual-tour2' })
  virtualTourLink2?: string;

  @ApiPropertyOptional({
    description: 'Property images - array of image objects',
    example: [{ image_url: 'https://example.com/image1.jpg' }],
    type: 'array',
    isArray: true,
  })
  images?: Array<{ image_url: string }>;

  @ApiPropertyOptional({ description: 'Golf course name', example: 'Riverside Golf Club' })
  golfCourseName?: string;

  @ApiPropertyOptional({ description: 'Pool area', example: 'Community Pool' })
  poolArea?: string;

  @ApiPropertyOptional({ description: 'Private pool', example: 'Yes' })
  poolPrivate?: string;

  @ApiPropertyOptional({ description: 'Public remarks', example: 'Beautiful home in great neighborhood' })
  remarks?: string;

  @ApiPropertyOptional({ description: 'Agent remarks', example: 'Motivated seller, bring offers' })
  agentRemarks?: string;

  @ApiPropertyOptional({ description: 'MLS number', example: 'MLS-123456' })
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