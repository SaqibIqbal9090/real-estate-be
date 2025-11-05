import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Property } from './property.model';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectModel(Property)
    private propertyModel: typeof Property,
  ) {}

  // Helper function to map property data to frontend expected format
  private mapPropertyToFrontendFormat(propertyData: any): any {
    return {
      ...propertyData,
      // Ensure rooms field is present
      rooms: propertyData.rooms || propertyData.room || [],
      // Map other fields to frontend expected names
      garageDimensions: propertyData.garageDimensions || propertyData.garadgeDimenssion,
      garageAptQtrsSqFt: propertyData.garageAptQtrsSqFt,
      sqftSource: propertyData.sqftSource || propertyData.SqftSource,
      guestHouseSqFt: propertyData.guestHouseSqFt || propertyData.guestHouseSqft,
      maintenanceFee: propertyData.maintenanceFee || propertyData.maintainanceFee,
      maintenanceFeeAmount: propertyData.maintenanceFeeAmount || propertyData.maintainanceFeeAmount,
      maintenanceFeePaymentSched: propertyData.maintenanceFeePaymentSched || propertyData.maintainanceFeeSche,
      maintenanceFeeIncludes: propertyData.maintenanceFeeIncludes || propertyData.maintananceFeeIncludes,
      listTeamID: propertyData.listTeamID || propertyData.teamId,
      licensedSupervisor: propertyData.licensedSupervisor || propertyData.liscensedSupervisor,
      mandatoryHOA: propertyData.mandatoryHOA || propertyData.mandatoryHQA,
      videoTourLink1: propertyData.videoTourLink1 || propertyData.videoTourLink,
      virtualTourLink1: propertyData.virtualTourLink1,
      virtualTourLink2: propertyData.virtualTourLink2,
      interactiveFloorPlanURL: propertyData.interactiveFloorPlanURL || propertyData.floorPlanUrl,
      // Add all the new fields that should be in the response
      frontDoorFaces: propertyData.frontDoorFaces,
      ovenType: propertyData.ovenType,
      stoveType: propertyData.stoveType,
      washerDryerConnection: propertyData.washerDryerConnection,
      privatePoolDescription: propertyData.privatePoolDescription,
      interiorFeatures: propertyData.interiorFeatures,
      flooring: propertyData.flooring,
      exteriorDescription: propertyData.exteriorDescription,
      constructionMaterials: propertyData.constructionMaterials,
      roofDescription: propertyData.roofDescription,
      foundationDescription: propertyData.foundationDescription,
      energyFeatures: propertyData.energyFeatures,
      greenEnergyCertifications: propertyData.greenEnergyCertifications,
      heatingSystemDescription: propertyData.heatingSystemDescription,
      coolingSystemDescription: propertyData.coolingSystemDescription,
      waterSewerDescription: propertyData.waterSewerDescription,
      streetSurface: propertyData.streetSurface,
      mandatoryHOAMgmtCoName: propertyData.mandatoryHOAMgmtCoName,
      mandatoryHOAMgmtCoPhone: propertyData.mandatoryHOAMgmtCoPhone,
      mandatoryHOAMgmtCoWebsite: propertyData.mandatoryHOAMgmtCoWebsite,
    };
  }

  // Helper function to convert string values to null for numeric fields
  private convertToNumeric(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }
    if (typeof value === 'number') {
      return isNaN(value) ? null : value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim().toLowerCase();
      // Convert empty strings, "no", "yes" to null
      if (trimmed === '' || trimmed === 'no' || trimmed === 'yes' || trimmed === 'n/a' || trimmed === 'na') {
        return null;
      }
      // Try to parse as number
      const parsed = parseFloat(trimmed);
      return isNaN(parsed) ? null : parsed;
    }
    return null;
  }

  // Helper function to map frontend data to database format
  private mapFrontendToDatabaseFormat(propertyData: any): any {
    const mapped = {
      ...propertyData,
      // Map rooms to the correct field
      rooms: propertyData.rooms || propertyData.room,
      // Map other fields that might have different names
      garageDimensions: propertyData.garageDimensions || propertyData.garadgeDimenssion,
      garageAptQtrsSqFt: this.convertToNumeric(propertyData.garageAptQtrsSqFt),
      sqftSource: propertyData.sqftSource || propertyData.SqftSource,
      guestHouseSqFt: this.convertToNumeric(propertyData.guestHouseSqFt || propertyData.guestHouseSqft),
      maintenanceFee: propertyData.maintenanceFee || propertyData.maintainanceFee,
      maintenanceFeeAmount: this.convertToNumeric(propertyData.maintenanceFeeAmount || propertyData.maintainanceFeeAmount),
      maintenanceFeePaymentSched: propertyData.maintenanceFeePaymentSched || propertyData.maintainanceFeeSche,
      maintenanceFeeIncludes: propertyData.maintenanceFeeIncludes || propertyData.maintananceFeeIncludes,
      listTeamID: propertyData.listTeamID || propertyData.teamId,
      licensedSupervisor: propertyData.licensedSupervisor || propertyData.liscensedSupervisor,
      mandatoryHOA: propertyData.mandatoryHOA || propertyData.mandatoryHQA,
      videoTourLink1: propertyData.videoTourLink1 || propertyData.videoTourLink,
      virtualTourLink1: propertyData.virtualTourLink1,
      virtualTourLink2: propertyData.virtualTourLink2,
      interactiveFloorPlanURL: propertyData.interactiveFloorPlanURL || propertyData.floorPlanUrl,
      // Map all the new fields
      frontDoorFaces: propertyData.frontDoorFaces,
      ovenType: propertyData.ovenType,
      stoveType: propertyData.stoveType,
      washerDryerConnection: propertyData.washerDryerConnection,
      privatePoolDescription: propertyData.privatePoolDescription,
      interiorFeatures: propertyData.interiorFeatures,
      flooring: propertyData.flooring,
      exteriorDescription: propertyData.exteriorDescription,
      constructionMaterials: propertyData.constructionMaterials,
      roofDescription: propertyData.roofDescription,
      foundationDescription: propertyData.foundationDescription,
      energyFeatures: propertyData.energyFeatures,
      greenEnergyCertifications: propertyData.greenEnergyCertifications,
      heatingSystemDescription: propertyData.heatingSystemDescription,
      coolingSystemDescription: propertyData.coolingSystemDescription,
      waterSewerDescription: propertyData.waterSewerDescription,
      streetSurface: propertyData.streetSurface,
      mandatoryHOAMgmtCoName: propertyData.mandatoryHOAMgmtCoName,
      mandatoryHOAMgmtCoPhone: propertyData.mandatoryHOAMgmtCoPhone,
      mandatoryHOAMgmtCoWebsite: propertyData.mandatoryHOAMgmtCoWebsite,
      // Convert numeric fields that might receive string values
      variableCompensation: this.convertToNumeric(propertyData.variableCompensation),
      otherMandatoryFeesAmount: this.convertToNumeric(propertyData.otherMandatoryFeesAmount),
      maintainanceFeeAmount: this.convertToNumeric(propertyData.maintainanceFeeAmount),
      taxes: this.convertToNumeric(propertyData.taxes),
      totalTaxRate: this.convertToNumeric(propertyData.totalTaxRate),
      buildingSqft: this.convertToNumeric(propertyData.buildingSqft),
      lotSize: this.convertToNumeric(propertyData.lotSize),
      guestHouseSqft: this.convertToNumeric(propertyData.guestHouseSqft),
    };
    return mapped;
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    // Map frontend data to database format
    const propertyData = this.mapFrontendToDatabaseFormat(createPropertyDto);
    
    // Set default status to 'draft' if not provided
    const status = propertyData.status || 'draft';
    
    // Validate required fields only if status is 'published'
    if (status === 'published') {
      this.validateRequiredFields(createPropertyDto);
    }
    
    // Set status in property data
    propertyData.status = status;
    
    // Create property with all data
    const createdProperty = await this.propertyModel.create(propertyData as any);
    
    // Return the exact same structure as the payload
    return this.mapPropertyToFrontendFormat(createdProperty.toJSON());
  }

  // Validate required fields for published properties
  private validateRequiredFields(propertyDto: CreatePropertyDto): void {
    const requiredFields = [
      'listType',
      'listPrice',
      'streetNo',
      'streetName',
      'city',
      'state',
      'zipCode',
    ];

    const missingFields = requiredFields.filter(field => !propertyDto[field]);
    
    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Cannot publish property. Missing required fields: ${missingFields.join(', ')}`
      );
    }
  }

  async findAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    listType?: string;
    minPrice?: number;
    maxPrice?: number;
    city?: string;
    state?: string;
    zipCode?: string;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string | string[];
    minSqft?: number;
    maxSqft?: number;
    amenities?: string[];
    includeDrafts?: boolean;
  } = {}): Promise<{ properties: any[]; total: number; page: number; totalPages: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      listType,
      minPrice,
      maxPrice,
      city,
      state,
      zipCode,
      bedrooms,
      bathrooms,
      propertyType,
      minSqft,
      maxSqft,
      amenities,
      includeDrafts = false,
    } = options;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Only show published properties in public listings unless includeDrafts is true
    if (!includeDrafts) {
      where.status = 'published';
    }

    // Filter by list type
    if (listType) {
      where.listType = listType;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      where.listPrice = {};
      if (minPrice) where.listPrice[Op.gte] = minPrice;
      if (maxPrice) where.listPrice[Op.lte] = maxPrice;
    }

    // Filter by location
    if (city) {
      where.city = { [Op.iLike]: `%${city}%` };
    }

    if (state) {
      where.state = { [Op.iLike]: `%${state}%` };
    }

    // Filter by zip code (exact match)
    if (zipCode) {
      where.zipCode = zipCode;
    }

    // Build AND conditions for complex filters
    const andConditions: any[] = [];

    // Search functionality
    if (search) {
      andConditions.push({
        [Op.or]: [
          { streetName: { [Op.iLike]: `%${search}%` } },
          { city: { [Op.iLike]: `%${search}%` } },
          { state: { [Op.iLike]: `%${search}%` } },
          { subDivision: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    // Filter by property type (propertyType is stored as JSON array)
    if (propertyType) {
      const propertyTypes = Array.isArray(propertyType) ? propertyType : [propertyType];
      const propertyTypeConditions = propertyTypes.map((type: string) => {
        // Check if the JSON array contains the property type (case-insensitive)
        return Sequelize.literal(`EXISTS (
          SELECT 1 FROM jsonb_array_elements_text("propertyType"::jsonb) AS element
          WHERE LOWER(element) = LOWER('${type.replace(/'/g, "''")}')
        )`);
      });
      andConditions.push({ [Op.or]: propertyTypeConditions });
    }

    // Filter by bedrooms (bedrooms is stored as INTEGER after migration)
    if (bedrooms !== undefined && bedrooms !== null) {
      andConditions.push({
        bedrooms: bedrooms,
      });
    }

    // Filter by bathrooms (bathsFull is stored as INTEGER after migration)
    if (bathrooms !== undefined && bathrooms !== null) {
      andConditions.push({
        bathsFull: bathrooms,
      });
    }

    // Filter by square footage range (buildingSqft)
    if (minSqft !== undefined && minSqft !== null) {
      where.buildingSqft = where.buildingSqft || {};
      where.buildingSqft[Op.gte] = minSqft;
    }
    if (maxSqft !== undefined && maxSqft !== null) {
      where.buildingSqft = where.buildingSqft || {};
      where.buildingSqft[Op.lte] = maxSqft;
    }

    // Filter by amenities (interiorFeatures is stored as JSON array)
    if (amenities && amenities.length > 0) {
      const amenitiesConditions = amenities.map((amenity: string) => {
        // Check if the JSON array contains the amenity (case-insensitive)
        return Sequelize.literal(`EXISTS (
          SELECT 1 FROM jsonb_array_elements_text("interiorFeatures"::jsonb) AS element
          WHERE LOWER(element) = LOWER('${amenity.replace(/'/g, "''")}')
        )`);
      });
      // All amenities must be present (AND condition)
      andConditions.push({
        [Op.and]: amenitiesConditions,
      });
    }

    // Apply all AND conditions
    if (andConditions.length > 0) {
      // If where already has Op.and, merge them; otherwise create new
      if (where[Op.and]) {
        where[Op.and] = [...(Array.isArray(where[Op.and]) ? where[Op.and] : [where[Op.and]]), ...andConditions];
      } else {
        where[Op.and] = andConditions;
      }
    }

    const { count, rows } = await this.propertyModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: require('../users/user.model').User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
    });

    // Map the properties to include all expected fields
    const mappedProperties = rows.map(property => {
      const propertyData = property.get({ plain: true });
      return this.mapPropertyToFrontendFormat(propertyData);
    });

    return {
      properties: mappedProperties,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async findOne(id: string): Promise<any> {
    const property = await this.propertyModel.findByPk(id, {
      include: [
        {
          model: require('../users/user.model').User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    // Ensure all fields are properly mapped in the response
    const propertyData = property.get({ plain: true });
    const mappedProperty = this.mapPropertyToFrontendFormat(propertyData);

    // Rooms data is now properly handled in mapPropertyToFrontendFormat

    console.log('Found property:', {
      id: mappedProperty.id,
      userId: mappedProperty.userId,
      user: mappedProperty.user,
      rooms: mappedProperty.rooms,
      rawData: mappedProperty
    });

    return mappedProperty;
  }

  async findByUserId(userId: string, options: {
    page?: number;
    limit?: number;
    status?: 'draft' | 'published';
  } = {}): Promise<{ properties: any[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, status } = options;
    const offset = (page - 1) * limit;

    const where: any = { userId };
    // Allow filtering by status, but by default show all (drafts and published) for user's own properties
    if (status) {
      where.status = status;
    }

    const { count, rows } = await this.propertyModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    // Map the properties to include all expected fields
    const mappedProperties = rows.map(property => {
      const propertyData = property.get({ plain: true });
      return this.mapPropertyToFrontendFormat(propertyData);
    });

    return {
      properties: mappedProperties,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async update(id: string, updatePropertyDto: Partial<CreatePropertyDto>, userId: string): Promise<any> {
    // First, let's try to get the property directly without includes to see if userId exists
    const propertyDirect = await this.propertyModel.findByPk(id);
    console.log('Direct property query:', {
      id: propertyDirect?.id,
      userId: propertyDirect?.userId,
      rawData: propertyDirect?.get({ plain: true })
    });

    const property = await this.findOne(id);
    console.log('Property userId:', property.userId, 'Request userId:', userId);

    // Check if user owns the property
    if (property.userId !== userId) {
      throw new ForbiddenException('You can only update your own properties');
    }

    // Map frontend fields to database fields for update
    const updateData = this.mapFrontendToDatabaseFormat(updatePropertyDto);

    // If status is being changed to 'published', validate required fields
    if (updateData.status === 'published' && property.status !== 'published') {
      // Merge existing property data with update data for validation
      const mergedData = { ...property, ...updatePropertyDto };
      this.validateRequiredFields(mergedData as CreatePropertyDto);
    }

    // Update the property and return the updated instance
    if (!propertyDirect) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    const updatedProperty = await propertyDirect.update(updateData as any);
    
    // Fetch the updated property with user information
    return this.findOne(id);
  }

  async publish(id: string, userId: string): Promise<any> {
    const property = await this.findOne(id);

    // Check if user owns the property
    if (property.userId !== userId) {
      throw new ForbiddenException('You can only publish your own properties');
    }

    // Check if already published
    if (property.status === 'published') {
      return property;
    }

    // Validate required fields before publishing
    this.validateRequiredFields(property as CreatePropertyDto);

    // Update status to published
    const propertyDirect = await this.propertyModel.findByPk(id);
    if (!propertyDirect) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    await propertyDirect.update({ status: 'published' });

    // Return updated property
    return this.findOne(id);
  }

  async unpublish(id: string, userId: string): Promise<any> {
    const property = await this.findOne(id);

    // Check if user owns the property
    if (property.userId !== userId) {
      throw new ForbiddenException('You can only unpublish your own properties');
    }

    // Check if already draft
    if (property.status === 'draft') {
      return property;
    }

    // Update status to draft
    const propertyDirect = await this.propertyModel.findByPk(id);
    if (!propertyDirect) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    await propertyDirect.update({ status: 'draft' });

    // Return updated property
    return this.findOne(id);
  }

  async remove(id: string, userId: string): Promise<void> {
    const propertyInstance = await this.propertyModel.findByPk(id);
    if (!propertyInstance) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    if (propertyInstance.userId !== userId) {
      throw new ForbiddenException('You can only delete your own properties');
    }

    await propertyInstance.destroy();
  }

  async searchProperties(searchTerm: string, options: {
    page?: number;
    limit?: number;
    includeDrafts?: boolean;
  } = {}): Promise<{ properties: any[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10, includeDrafts = false } = options;
    const offset = (page - 1) * limit;

    const where: any = {
      [Op.or]: [
        { streetName: { [Op.iLike]: `%${searchTerm}%` } },
        { city: { [Op.iLike]: `%${searchTerm}%` } },
        { state: { [Op.iLike]: `%${searchTerm}%` } },
        { zipCode: { [Op.iLike]: `%${searchTerm}%` } },
        { subDivision: { [Op.iLike]: `%${searchTerm}%` } },
        { legalDescription: { [Op.iLike]: `%${searchTerm}%` } },
      ],
    };

    // Only show published properties in public search unless includeDrafts is true
    if (!includeDrafts) {
      where.status = 'published';
    }

    const { count, rows } = await this.propertyModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: require('../users/user.model').User,
          as: 'user',
          attributes: ['id', 'fullName', 'email'],
        },
      ],
    });

    // Map the properties to include all expected fields
    const mappedProperties = rows.map(property => {
      const propertyData = property.get({ plain: true });
      return this.mapPropertyToFrontendFormat(propertyData);
    });

    return {
      properties: mappedProperties,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  }

  async getPropertyStats(): Promise<{
    totalProperties: number;
    averagePrice: number;
    propertiesByType: { [key: string]: number };
    propertiesByState: { [key: string]: number };
  }> {
    const totalProperties = await this.propertyModel.count();

    const averagePriceResult = await this.propertyModel.findOne({
      attributes: [
        [require('sequelize').fn('AVG', require('sequelize').col('listPrice')), 'averagePrice'],
      ],
    });

    const propertiesByType = await this.propertyModel.findAll({
      attributes: [
        'listType',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      ],
      group: ['listType'],
    });

    const propertiesByState = await this.propertyModel.findAll({
      attributes: [
        'state',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      ],
      group: ['state'],
    });

    return {
      totalProperties,
      averagePrice: parseFloat((averagePriceResult as any)?.getDataValue('averagePrice') || '0'),
      propertiesByType: propertiesByType.reduce((acc, item) => {
        acc[item.listType] = parseInt((item as any).getDataValue('count'));
        return acc;
      }, {} as { [key: string]: number }),
      propertiesByState: propertiesByState.reduce((acc, item) => {
        acc[item.state] = parseInt((item as any).getDataValue('count'));
        return acc;
      }, {} as { [key: string]: number }),
    };
  }
} 