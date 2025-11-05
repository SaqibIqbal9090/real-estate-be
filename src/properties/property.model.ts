import {
  Table,
  Column,
  Model,
  DataType,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../users/user.model';

@Table({
  tableName: 'properties',
  timestamps: true,
})
export class Property extends Model<Property> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  declare id: string;

  // Property Status
  @Column({
    type: DataType.ENUM('draft', 'published'),
    defaultValue: 'draft',
    allowNull: false,
  })
  status: 'draft' | 'published';

  // Listing Information
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  listType: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    allowNull: false,
  })
  listPrice: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  listDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  ExpDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  alsoForLease: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  townhouseCondo: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
    defaultValue: 0,
  })
  priceAtLotValue: number;

  // Address Information
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  streetNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  stDirection: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  streetName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  streetType: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  unitNo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  unitLevel: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  city: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  state: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  zipCode: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  zipCodeExt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  county: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subDivision: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  section: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sectionNo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  legalDescription: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  legalsubDivision: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  masterPlannedCommunity: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  masterPlannedCommunityName: string;

  // Tax Information
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  taxId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  keyMap: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  censusTract: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  taxId2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  taxId3: string;

  // Area Information
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  area: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  marketArea: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  etjCity: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  directions: string;

  // School Information
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  elementrySchool: string;

  // Additional School Field (frontend sends this)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  elementarySchool: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  middleSchool: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  highSchool: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  secondMiddleSchool: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  schoolDistrict: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  publicImprovementDistrict: string;

  // Building Information
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  buildingSqft: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sqftSourceDirection: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  yearBuilt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  yearBuiltSource: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  stories: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  newConstruction: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  newConstructionDesc: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  builderName: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  approxCompletionDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expirationDate: Date;

  // Garage Information
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  garadgeDimenssion: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  utilityDistrict: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  garadgeAptQtrs: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  SqftSource: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  guestHouseSqft: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  guestHouseSqftSource: string;

  // Lot Information
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  lotSize: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lotSizeSource: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  acres: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  acreage: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lotDimenssions: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  garage: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  carport: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  carportDescription: string;

  // Array Fields (stored as JSON)
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  access: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  garageDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  garageCarportDescriptions: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  restrictions: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  propertyType: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  style: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  lotDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  waterfrontFeatures: string[];

  // Appliances
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  microwave: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  dishwasher: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  disposal: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  
  subDivisionLakeAccess: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  compactor: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  separateIceMaker: string;

  // Fireplace
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fireplaceNo: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  fireplaceDescription: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  counterTops: string;

  // Bedrooms and Bathrooms
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  bedrooms: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  bedroomsMax: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  bathsFull: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  bathshalf: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  bedrommDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  roomDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  bathroomDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  kitchenDescription: string[];

  // Room Details
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  room: Array<{
    roomType: string;
    roomDimension: string;
    roomLocation: string;
  }>;

  // Additional Rooms Field (frontend sends this)
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  rooms: Array<{
    id: string;
    roomType: string;
    roomLocation: string;
    roomDimension: string;
    features: string[];
  }>;

  // Additional Garage Fields (frontend sends these)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  garageDimensions: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  garageAptQtrsSqFt: number;

  // Additional Sqft Field (frontend sends this)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sqftSource: string;

  // Additional Guest House Field (frontend sends this)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  guestHouseSqFt: number;

  // Additional Property Features (frontend sends these)
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  frontDoorFaces: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  ovenType: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  stoveType: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  washerDryerConnection: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  privatePoolDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  interiorFeatures: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  flooring: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  exteriorDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  constructionMaterials: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  roofDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  foundationDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  energyFeatures: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  greenEnergyCertifications: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  heatingSystemDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  coolingSystemDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  waterSewerDescription: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  streetSurface: string[];

  // HQA Information
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHQA: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHQACoName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHQACoPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHQACoWebsite: string;

  // Additional HOA Management Fields (frontend sends these)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHOA: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHOAMgmtCoName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHOAMgmtCoPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mandatoryHOAMgmtCoWebsite: string;

  // Financial Information
  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  financingConsideration: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  disclosures: string[];

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  exclusions: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lossMitigation: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  activeCommunity: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  affordableHousingProgramDescription: string;

  // Maintenance Fees
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  maintainanceFee: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  maintainanceFeeAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  maintainanceFeeSche: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  maintananceFeeIncludes: string[];

  // Additional Maintenance Fields (frontend sends these)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  maintenanceFee: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  maintenanceFeeAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  maintenanceFeePaymentSched: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  maintenanceFeeIncludes: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otherMandatoryFees: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  otherMandatoryFeesAmount: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  otherMandatoryFeesIncludes: string;

  // Tax Information
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  taxYear: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  taxes: number;

  @Column({
    type: DataType.DECIMAL(10, 4),
    allowNull: true,
  })
  totalTaxRate: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  exemptions: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  ownershipType: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  vacationRentalAllowed: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  sellerEmail: string;

  // Auction Information
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subjectToAuction: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  auctionDate: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  onlineBidding: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  biddingDeadline: string;

  // Agent Information
  @Column({
    type: DataType.STRING,
    defaultValue: 'realestatemarketplaceintl',
  })
  listAgent: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  teamId: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  liscensedSupervisor: string;

  // Additional Team and Supervisor Fields (frontend sends these)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  listTeamID: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  licensedSupervisor: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  appointmentPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  appointmentPhoneDesc: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  officePhoneExt: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  agentAlternatePhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  alternatePhoneDesc: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nightPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  faxPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  allowOnlineAppointmentsViaMatrix: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  idxContactInfo: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'realestatemarketplaceintl',
  })
  coListAgent: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  showingInstructions: string[];

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  buyerAgencyCompensation: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  subAgencyCompensation: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bonus: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  bonusEndDate: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  variableCompensation: number;

  // Links and Media
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  link2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  floorPlanUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  videoTourLink: string;

  // Additional Virtual Tour and Floor Plan Fields (frontend sends these)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  videoTourLink1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  virtualTourLink1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  virtualTourLink2: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  interactiveFloorPlanURL: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  webHyperLink1: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  webHyperLink2: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  images: Array<{ image_url: string }>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  golfCourseName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  poolArea: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  poolPrivate: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  remarks: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  agentRemarks: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  mlsNumber: string;

  // Relationships
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  declare userId: string;

  @BelongsTo(() => User)
  user: User;

  // Timestamps
  @CreatedAt
  declare createdAt: Date;

  @UpdatedAt
  declare updatedAt: Date;
} 