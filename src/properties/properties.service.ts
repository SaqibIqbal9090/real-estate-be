import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  // Helper function to map frontend data to database format
  private mapFrontendToDatabaseFormat(propertyData: any): any {
    return {
      ...propertyData,
      // Map rooms to the correct field
      rooms: propertyData.rooms || propertyData.room,
      // Map other fields that might have different names
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
    };
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    // Map frontend data to database format
    const propertyData = this.mapFrontendToDatabaseFormat(createPropertyDto);
    
    // Create property with all data
    const createdProperty = await this.propertyModel.create(propertyData as any);
    
    // Return the exact same structure as the payload
    return this.mapPropertyToFrontendFormat(createdProperty.toJSON());
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
    bedrooms?: number;
    bathrooms?: number;
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
      bedrooms,
      bathrooms,
    } = options;

    const offset = (page - 1) * limit;
    const where: any = {};

    // Search functionality
    if (search) {
      where[Op.or] = [
        { streetName: { [Op.iLike]: `%${search}%` } },
        { city: { [Op.iLike]: `%${search}%` } },
        { state: { [Op.iLike]: `%${search}%` } },
        { subDivision: { [Op.iLike]: `%${search}%` } },
      ];
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

    // Filter by bedrooms (if bedrooms array contains the specified number)
    // Temporarily disabled to debug JSON field issues
    // if (bedrooms) {
    //   where.bedrooms = Sequelize.literal(`bedrooms::jsonb @> '["${bedrooms}"]'::jsonb`);
    // }

    // Filter by bathrooms (if bathsFull array contains the specified number)
    // Temporarily disabled to debug JSON field issues
    // if (bathrooms) {
    //   where.bathsFull = Sequelize.literal(`"bathsFull"::jsonb @> '["${bathsFull}"]'::jsonb`);
    // }

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
  } = {}): Promise<{ properties: any[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const { count, rows } = await this.propertyModel.findAndCountAll({
      where: { userId },
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

    // Update the property and return the updated instance
    if (!propertyDirect) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    const updatedProperty = await propertyDirect.update(updateData as any);
    
    // Fetch the updated property with user information
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
  } = {}): Promise<{ properties: any[]; total: number; page: number; totalPages: number }> {
    const { page = 1, limit = 10 } = options;
    const offset = (page - 1) * limit;

    const where = {
      [Op.or]: [
        { streetName: { [Op.iLike]: `%${searchTerm}%` } },
        { city: { [Op.iLike]: `%${searchTerm}%` } },
        { state: { [Op.iLike]: `%${searchTerm}%` } },
        { zipCode: { [Op.iLike]: `%${searchTerm}%` } },
        { subDivision: { [Op.iLike]: `%${searchTerm}%` } },
        { legalDescription: { [Op.iLike]: `%${searchTerm}%` } },
      ],
    };

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