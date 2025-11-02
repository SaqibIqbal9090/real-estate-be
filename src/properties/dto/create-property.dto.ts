// Backend validations removed per requirements. Keep a loose DTO shape only.

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
  // Property Status
  status?: 'draft' | 'published';

  // Listing Information
  listType: string;

  listPrice: number;

  listDate?: string;

  ExpDate?: string;

  alsoForLease?: boolean;

  priceAtLotValue?: number;

  // Address Information
  streetNo: string;

  stDirection?: string;

  streetName: string;

  streetType?: string;

  unitNo?: string;

  city: string;

  state: string;

  zipCode: string;

  zipCodeExt?: string;

  county?: string;

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

  // School Information
  elementrySchool?: string;

  // Additional School Field (frontend sends this)
  elementarySchool?: string;

  middleSchool?: string;

  highSchool?: string;

  secondMiddleSchool?: string;

  schoolDistrict?: string;

  publicImprovementDistrict?: string;

  // Building Information
  buildingSqft?: number;

  sqftSourceDirection?: string;

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
  bedrooms?: number;

  bedroomsMax?: number;

  bathsFull?: number;

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

  images?: Array<{ image_url: string }>;

  golfCourseName?: string;

  poolArea?: string;

  poolPrivate?: string;

  // User relationship
  userId: string;
} 