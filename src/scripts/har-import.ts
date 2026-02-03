import axios from 'axios';
import { Sequelize } from 'sequelize-typescript';
import { Property } from '../properties/property.model';
import { User } from '../users/user.model';
import * as dotenv from 'dotenv';

dotenv.config();

interface HarListing {
  ListingKey: string;
  ListingId: string;
  ListPrice: number;
  ListingContractDate?: string;
  PropertyType: string;
  PropertySubType?: string;
  StandardStatus: string;
  MlsStatus: string;
  StreetNumber?: string;
  StreetDirPrefix?: string;
  StreetName?: string;
  StreetSuffix?: string;
  StreetDirSuffix?: string;
  UnitNumber?: string;
  City?: string;
  StateOrProvince?: string;
  PostalCode?: string;
  PostalCodePlus4?: string;
  CountyOrParish?: string;
  SubdivisionName?: string;
  Latitude?: number;
  Longitude?: number;
  BedroomsTotal?: number;
  BathroomsTotalDecimal?: number;
  BathroomsFull?: number;
  BathroomsHalf?: number;
  LivingArea?: number;
  LotSizeAcres?: number;
  LotSizeSquareFeet?: number;
  LotSizeDimensions?: string;
  YearBuilt?: number;
  YearBuiltSource?: string;
  PublicRemarks?: string;
  Directions?: string;
  TaxLegalDescription?: string;
  ParcelNumber?: string;
  TaxAnnualAmount?: number;
  TaxYear?: number;
  TaxExemptions?: string[];
  ListAgentFullName?: string;
  ListAgentEmail?: string;
  ListAgentPreferredPhone?: string;
  ListOfficeName?: string;
  ListOfficePhone?: string;
  Media?: Array<{
    MediaURL: string;
    MediaCategory: string;
    Order: number;
  }>;
  [key: string]: any;
}

interface ODataResponse {
  value: HarListing[];
  '@odata.nextLink'?: string;
  '@odata.context': string;
  '@odata.count'?: number;
}

class HarImporter {
  private sequelize: Sequelize;
  private harApiUrl: string;
  private userId: string;
  private batchSize: number = 100;
  private delayBetweenBatches: number = 1000; // 1 second
  private isExternalSequelize: boolean = false;

  constructor(sequelize?: Sequelize) {
    this.harApiUrl = process.env.HAR_API_URL || '';
    this.userId = process.env.HAR_IMPORT_USER_ID || '';

    // Require an access_token on HAR_API_URL (OData endpoint)
    const urlHasAccessToken = this.harApiUrl.includes('access_token=');
    if (!urlHasAccessToken) {
      throw new Error('HAR_API_URL must include an access_token query parameter (full OData URL from HAR).');
    }

    // Ensure we're using the OData endpoint
    if (!this.harApiUrl.includes('/OData/')) {
      throw new Error('HAR_API_URL must be an OData endpoint (e.g., https://api.bridgedataoutput.com/api/v2/OData/har/Property?access_token=...)');
    }

    if (!this.userId) {
      throw new Error('HAR_IMPORT_USER_ID environment variable is required (UUID of a user in the database)');
    }

    if (sequelize) {
      this.sequelize = sequelize;
      this.isExternalSequelize = true;
    } else {
      // Initialize Sequelize using environment variables (same defaults as app)
      const dbName = process.env.DB_NAME || 'real_estate';
      const dbUser = process.env.DB_USERNAME || 'postgres';
      const dbPass = process.env.DB_PASSWORD || 'admin';
      const dbHost = process.env.DB_HOST || 'localhost';
      const dbPort = parseInt(process.env.DB_PORT ?? '5432', 10);

      this.sequelize = new Sequelize(dbName, dbUser, dbPass, {
        host: dbHost,
        port: dbPort,
        dialect: 'postgres',
        logging: process.env.NODE_ENV === 'development',
        models: [Property, User],
      });
    }
  }

  /**
   * Maps HAR API listing data to Property model format
   */
  private mapHarToProperty(harListing: HarListing): Partial<Property> {
    const property: Partial<Property> = {
      userId: this.userId,
      status: 'published',

      // Listing Information
      listType: this.determineListType(harListing),
      listPrice: harListing.ListPrice || 0,
      listDate: harListing.ListingContractDate ? new Date(harListing.ListingContractDate) : new Date(),
      mlsNumber: harListing.ListingId || harListing.ListingKey,

      // Address Information
      streetNo: harListing.StreetNumber || '0',
      stDirection: harListing.StreetDirPrefix || undefined,
      streetName: harListing.StreetName || '',
      streetType: harListing.StreetSuffix || undefined,
      unitNo: harListing.UnitNumber || undefined,
      city: harListing.City || '',
      state: harListing.StateOrProvince || 'TX',
      zipCode: harListing.PostalCode || '',
      zipCodeExt: harListing.PostalCodePlus4 || undefined,
      county: harListing.CountyOrParish || undefined,
      subDivision: harListing.SubdivisionName || undefined,

      // Location
      legalDescription: harListing.TaxLegalDescription || undefined,
      taxId: harListing.ParcelNumber || undefined,
      censusTract: harListing.HAR_CensusTract
        ? String(harListing.HAR_CensusTract)
        : undefined,

      // Property Type
      propertyType: this.mapPropertyType(harListing),

      // Building Information
      buildingSqft: harListing.LivingArea ?? undefined,
      sqftSource: harListing.LivingAreaSource || undefined,
      yearBuilt: harListing.YearBuilt ? String(harListing.YearBuilt) : undefined,
      yearBuiltSource: harListing.YearBuiltSource || undefined,
      stories: harListing.StoriesTotal ? String(harListing.StoriesTotal) : undefined,
      newConstruction: harListing.NewConstructionYN || false,
      builderName: harListing.BuilderName || null,

      // Lot Information
      lotSize: harListing.LotSizeSquareFeet
        ? Number(harListing.LotSizeSquareFeet)
        : undefined,
      lotSizeSource: harListing.LotSizeSource || undefined,
      acres: harListing.LotSizeAcres ? String(harListing.LotSizeAcres) : undefined,
      lotDimenssions: harListing.LotSizeDimensions || undefined,

      // Bedrooms and Bathrooms
      bedrooms: harListing.BedroomsTotal ?? undefined,
      bathsFull: harListing.BathroomsFull ?? undefined,
      bathshalf: harListing.BathroomsHalf ?? undefined,

      // Garage Information
      garage: harListing.GarageSpaces ? String(harListing.GarageSpaces) : undefined,
      garageDimensions: harListing.HAR_GarageDimension || undefined,
      carport: harListing.CarportSpaces ? String(harListing.CarportSpaces) : undefined,

      // School Information
      elementarySchool: harListing.ElementarySchool || undefined,
      middleSchool: harListing.MiddleOrJuniorSchool || undefined,
      highSchool: harListing.HighSchool || undefined,
      schoolDistrict: harListing.HighSchoolDistrict || undefined,

      // Tax Information
      taxYear: harListing.TaxYear ? String(harListing.TaxYear) : undefined,
      taxes: harListing.TaxAnnualAmount ?? undefined,
      totalTaxRate: harListing.HAR_TaxRate || null,
      exemptions: harListing.TaxExemptions?.join(', ') || undefined,

      // HOA Information
      mandatoryHOA: harListing.AssociationYN ? 'Yes' : 'No',
      maintenanceFee: harListing.AssociationFee ? 'Yes' : 'No',
      maintenanceFeeAmount: harListing.AssociationFee ?? undefined,
      maintenanceFeePaymentSched: harListing.AssociationFeeFrequency || undefined,
      maintenanceFeeIncludes: harListing.AssociationFeeIncludes || [],

      // Features
      restrictions: harListing.HAR_Restrictions || [],
      waterfrontFeatures: harListing.WaterfrontFeatures || [],
      lotDescription: harListing.LotFeatures || [],
      interiorFeatures: harListing.InteriorFeatures || [],
      flooring: harListing.Flooring || [],
      constructionMaterials: harListing.ConstructionMaterials || [],
      roofDescription: harListing.Roof || [],
      foundationDescription: harListing.FoundationDetails || [],
      heatingSystemDescription: harListing.Heating || [],
      coolingSystemDescription: harListing.Cooling || [],
      waterSewerDescription: this.mapWaterSewer(harListing),
      streetSurface: harListing.RoadSurfaceType || [],

      // Appliances (individual fields)
      microwave: harListing.Appliances?.includes('Microwave') ? 'Yes' : undefined,
      dishwasher: harListing.Appliances?.includes('Dishwasher') ? 'Yes' : undefined,
      disposal: harListing.Appliances?.includes('Disposal') ? 'Yes' : undefined,

      // Fireplace
      fireplaceNo: harListing.FireplacesTotal
        ? String(harListing.FireplacesTotal)
        : undefined,
      fireplaceDescription: harListing.FireplaceFeatures || [],

      // Kitchen
      kitchenDescription: harListing.RoomKitchenFeatures || [],

      // Room Description
      roomDescription: harListing.RoomType || [],

      // Disclosures
      disclosures: harListing.Disclosures || [],
      exclusions: harListing.Exclusions ? [harListing.Exclusions] : [],

      // Listing Terms
      financingConsideration: harListing.ListingTerms || [],

      // Remarks
      remarks: harListing.PublicRemarks || undefined,
      directions: harListing.Directions || undefined,

      // Agent Information
      listAgent: harListing.ListAgentFullName || undefined,
      appointmentPhone: harListing.ListAgentPreferredPhone || undefined,
      agentAlternatePhone: harListing.HAR_PhoneAlt || null,

      // Virtual Tours
      virtualTourLink1: harListing.VirtualTourURLUnbranded || null,
      virtualTourLink2: harListing.VirtualTourURLBranded || null,

      // Images
      images: this.mapImages(harListing.Media || []),

      // Additional Fields
      masterPlannedCommunity: harListing.HAR_MasterPlannedCommunityYN || false,
      masterPlannedCommunityName: harListing.HAR_MasterPlannedCommunity || null,
      marketArea: harListing.HAR_GeoMarketArea || null,
      area: harListing.MLSAreaMajor || null,
      poolPrivate: harListing.PoolPrivateYN ? 'Yes' : 'No',
      poolArea: harListing.HAR_PoolArea ? 'Yes' : 'No',
      golfCourseName: harListing.HAR_GolfCourse || null,
      utilityDistrict: harListing.HAR_UtilityDistrict ? 'Yes' : 'No',

      // Additional HAR-specific mappings
      priceAtLotValue: harListing.HAR_LotValue ? Number(harListing.HAR_LotValue) : 0,
      alsoForLease: harListing.LeaseConsideredYN || false,

      // Style/Architecture (if field exists in model)
      style: harListing.ArchitecturalStyle || [],

      // Green/Energy Features
      energyFeatures: harListing.GreenEnergyEfficient || [],
      greenEnergyCertifications: harListing.GreenBuildingVerificationType || [],
    };

    return property;
  }

  private determineListType(harListing: HarListing): string {
    if (harListing.PropertyType === 'Residential Lease' || harListing.LeaseConsideredYN) {
      return 'lease';
    }
    // Check if property is also available for lease
    if (harListing.LeaseConsideredYN === true) {
      return 'both';
    }
    return 'sale';
  }

  private mapPropertyType(harListing: HarListing): string[] {
    const types: string[] = [];
    if (harListing.PropertyType) {
      types.push(harListing.PropertyType);
    }
    if (harListing.PropertySubType) {
      types.push(harListing.PropertySubType);
    }
    if (harListing.CurrentUse && Array.isArray(harListing.CurrentUse)) {
      types.push(...harListing.CurrentUse);
    }
    return types.length > 0 ? types : ['Residential'];
  }

  private mapWaterSewer(harListing: HarListing): string[] {
    const waterSewer: string[] = [];
    if (harListing.WaterSource && Array.isArray(harListing.WaterSource)) {
      waterSewer.push(...harListing.WaterSource);
    }
    if (harListing.Sewer && Array.isArray(harListing.Sewer)) {
      waterSewer.push(...harListing.Sewer);
    }
    return waterSewer;
  }


  private mapImages(media: HarListing['Media']): Array<{ image_url: string }> {
    if (!media || !Array.isArray(media)) {
      return [];
    }

    return media
      .filter(m => m.MediaCategory === 'Photo' && m.MediaURL)
      .sort((a, b) => (a.Order || 0) - (b.Order || 0))
      .map(m => ({ image_url: m.MediaURL }));
  }

  /**
   * Fetches listings from HAR OData API with pagination
   */
  private async fetchHarListings(nextLink?: string, top: number = 100): Promise<ODataResponse> {
    try {
      let url: string;

      if (nextLink) {
        // Use the nextLink for pagination (it already includes access_token and filter)
        url = nextLink;
      } else {
        // Build initial OData query URL
        const urlObj = new URL(this.harApiUrl);
        const accessToken = urlObj.searchParams.get('access_token') || '';

        // Get base URL without query params
        const baseUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;

        // Build OData filter query
        const filter = encodeURIComponent("(City eq 'Houston') and (PropertyType eq 'Residential')");
        url = `${baseUrl}?access_token=${accessToken}&$filter=${filter}&$top=${top}`;
      }

      const response = await axios.get<ODataResponse>(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return this.validateResponse(response.data);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data || error.message;
        throw new Error(`Failed to fetch HAR listings: ${error.message} - ${JSON.stringify(errorData)}`);
      }
      throw error;
    }
  }

  private validateResponse(data: any): ODataResponse {
    if (!data.value || !Array.isArray(data.value)) {
      throw new Error(`HAR OData API returned invalid response: missing value array`);
    }
    return data;
  }

  /**
   * Checks if a property already exists by MLS number
   */
  private async propertyExists(mlsNumber: string): Promise<boolean> {
    const count = await Property.count({
      where: { mlsNumber },
    });
    return count > 0;
  }

  /**
   * Imports a single listing
   */
  private async importListing(harListing: HarListing): Promise<boolean> {
    try {
      // Check if property already exists
      const mlsNumber = harListing.ListingId || harListing.ListingKey;
      if (await this.propertyExists(mlsNumber)) {
        console.log(`  ⏭️  Skipping existing property: ${mlsNumber}`);
        return false;
      }

      // Map HAR data to Property format
      const propertyData = this.mapHarToProperty(harListing);

      // Create property
      await Property.create(propertyData as any);
      console.log(`  ✅ Imported: ${mlsNumber} - ${propertyData.streetNo} ${propertyData.streetName}, ${propertyData.city}`);
      return true;
    } catch (error: any) {
      console.error(`  ❌ Error importing listing ${harListing.ListingKey}:`, error.message);
      return false;
    }
  }

  /**
   * Imports listings in batches using OData pagination
   */
  async importListings(maxListings?: number): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log('✅ Database connection established');

      // Verify user exists
      const user = await User.findByPk(this.userId);
      if (!user) {
        throw new Error(`User with ID ${this.userId} not found in database`);
      }
      console.log(`✅ Using user: ${user.email || this.userId}`);

      let nextLink: string | undefined = undefined;
      const top = this.batchSize;
      let totalImported = 0;
      let totalSkipped = 0;
      let totalErrors = 0;
      let batchNumber = 0;

      console.log('\n🚀 Starting HAR import using OData API...\n');

      while (true) {
        batchNumber++;
        console.log(`📥 Fetching batch #${batchNumber}${nextLink ? ' (using nextLink)' : ''}`);

        const response = await this.fetchHarListings(nextLink, top);

        if (!response.value || response.value.length === 0) {
          console.log('\n✅ No more listings to import');
          break;
        }

        console.log(`📦 Processing ${response.value.length} listings...`);
        if (response['@odata.count']) {
          console.log(`📊 Total available: ${response['@odata.count']} listings`);
        }

        for (const listing of response.value) {
          if (maxListings && totalImported >= maxListings) {
            console.log(`\n⏹️  Reached max listings limit: ${maxListings}`);
            break;
          }

          try {
            const imported = await this.importListing(listing);
            if (imported) {
              totalImported++;
            } else {
              totalSkipped++;
            }
          } catch (error: any) {
            totalErrors++;
            console.error(`  ❌ Error processing listing: ${error.message}`);
          }
        }

        // Check if we've reached the end or max limit
        if (maxListings && totalImported >= maxListings) {
          break;
        }

        // Check for next page
        nextLink = response['@odata.nextLink'];
        if (!nextLink) {
          console.log('\n✅ Reached end of listings');
          break;
        }

        // Delay between batches to avoid rate limiting
        console.log(`\n⏳ Waiting ${this.delayBetweenBatches}ms before next batch...\n`);
        await new Promise(resolve => setTimeout(resolve, this.delayBetweenBatches));
      }

      console.log('\n📊 Import Summary:');
      console.log(`   ✅ Imported: ${totalImported}`);
      console.log(`   ⏭️  Skipped: ${totalSkipped}`);
      console.log(`   ❌ Errors: ${totalErrors}`);
      console.log('\n✨ Import completed!');

    } catch (error: any) {
      console.error('\n❌ Import failed:', error.message);
      throw error;
    } finally {
      if (!this.isExternalSequelize) {
        await this.sequelize.close();
      }
    }
  }
}

// Main execution
async function main() {
  const maxListings = process.env.MAX_LISTINGS ? parseInt(process.env.MAX_LISTINGS) : undefined;

  const importer = new HarImporter();
  await importer.importListings(maxListings);
}

// Run if executed directly
if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { HarImporter };

