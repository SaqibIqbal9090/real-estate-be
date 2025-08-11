import { IsString, IsNumber, IsBoolean, IsOptional, IsArray, IsDateString, IsEmail, IsIn, Min, IsUUID } from 'class-validator';

export class CreatePropertyDto {
  // Listing Information
  @IsString()
  @IsIn(['sale', 'lease', 'both'])
  listType: string;

  @IsNumber()
  @Min(0)
  listPrice: number;

  @IsOptional()
  @IsDateString()
  listDate?: string;

  @IsOptional()
  @IsDateString()
  ExpDate?: string;

  @IsOptional()
  @IsBoolean()
  alsoForLease?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  priceAtLotValue?: number;

  // Address Information
  @IsString()
  streetNo: string;

  @IsOptional()
  @IsString()
  stDirection?: string;

  @IsString()
  streetName: string;

  @IsOptional()
  @IsString()
  streetType?: string;

  @IsOptional()
  @IsString()
  unitNo?: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  zipCode: string;

  @IsOptional()
  @IsString()
  zipCodeExt?: string;

  @IsOptional()
  @IsString()
  county?: string;

  @IsOptional()
  @IsString()
  subDivision?: string;

  @IsOptional()
  @IsString()
  section?: string;

  @IsOptional()
  @IsString()
  sectionNo?: string;

  @IsOptional()
  @IsString()
  legalDescription?: string;

  @IsOptional()
  @IsString()
  legalsubDivision?: string;

  @IsOptional()
  @IsBoolean()
  masterPlannedCommunity?: boolean;

  @IsOptional()
  @IsString()
  masterPlannedCommunityName?: string;

  // Tax Information
  @IsOptional()
  @IsString()
  taxId?: string;

  @IsOptional()
  @IsString()
  keyMap?: string;

  @IsOptional()
  @IsString()
  censusTract?: string;

  @IsOptional()
  @IsString()
  taxId2?: string;

  @IsOptional()
  @IsString()
  taxId3?: string;

  // Area Information
  @IsOptional()
  @IsString()
  area?: string;

  @IsOptional()
  @IsString()
  marketArea?: string;

  @IsOptional()
  @IsString()
  etjCity?: string;

  // School Information
  @IsOptional()
  @IsString()
  elementrySchool?: string;

  // Additional School Field (frontend sends this)
  @IsOptional()
  @IsString()
  elementarySchool?: string;

  @IsOptional()
  @IsString()
  middleSchool?: string;

  @IsOptional()
  @IsString()
  highSchool?: string;

  @IsOptional()
  @IsString()
  secondMiddleSchool?: string;

  @IsOptional()
  @IsString()
  schoolDistrict?: string;

  @IsOptional()
  @IsString()
  publicImprovementDistrict?: string;

  // Building Information
  @IsOptional()
  @IsNumber()
  buildingSqft?: number;

  @IsOptional()
  @IsString()
  sqftSourceDirection?: string;

  @IsOptional()
  @IsString()
  yearBuilt?: string;

  @IsOptional()
  @IsString()
  yearBuiltSource?: string;

  @IsOptional()
  @IsString()
  stories?: string;

  @IsOptional()
  @IsBoolean()
  newConstruction?: boolean;

  @IsOptional()
  @IsString()
  newConstructionDesc?: string;

  @IsOptional()
  @IsString()
  builderName?: string;

  @IsOptional()
  @IsDateString()
  approxCompletionDate?: string;

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
  @IsOptional()
  @IsNumber()
  lotSize?: number;

  @IsOptional()
  @IsString()
  lotSizeSource?: string;

  @IsOptional()
  @IsString()
  acres?: string;
  

  @IsOptional()
  @IsString()
  acreage?: string;

  @IsOptional()
  @IsString()
  lotDimenssions?: string;

  @IsOptional()
  @IsString()
  garage?: string;

  @IsOptional()
  @IsString()
  carport?: string;

  @IsOptional()
  @IsString()
  carportDescription?: string;

  // Array Fields
  @IsOptional()
  @IsArray()
  access?: string[];

  @IsOptional()
  @IsArray()
  garageDescription?: string[];

  @IsOptional()
  @IsArray()
  garageCarportDescriptions?: string[];

  @IsOptional()
  @IsArray()
  restrictions?: string[];

  @IsOptional()
  @IsArray()
  propertyType?: string[];

  @IsOptional()
  @IsArray()
  style?: string[];

  @IsOptional()
  @IsArray()
  lotDescription?: string[];

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
  @IsOptional()
  @IsArray()
  bedrooms?: string[];

  @IsOptional()
  @IsArray()
  bedroomsMax?: string[];

  @IsOptional()
  @IsArray()
  bathsFull?: string[];

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