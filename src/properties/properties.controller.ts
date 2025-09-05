import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { GenerateSignedUrlDto, SingleFileSignedUrlDto } from './dto/generate-signed-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from './s3.service';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPropertyDto: CreatePropertyDto, @Request() req: any) {
    // Set the userId from the authenticated user
    createPropertyDto.userId = req.user.userId;
    
    const property = await this.propertiesService.create(createPropertyDto);
    return {
      message: 'Property created successfully',
      property,
    };
  }

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('searchTerm') searchTerm?: string,
    @Query('listType') listType?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('city') city?: string,
    @Query('state') state?: string,
    @Query('bedrooms') bedrooms?: string,
    @Query('bathrooms') bathrooms?: string,
  ) {
    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      searchTerm,
      listType,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      city,
      
      state,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
    };

    return this.propertiesService.findAll(options);
  }

  @Get('search')
  async searchProperties(
    @Query('q') searchTerm: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    if (!searchTerm) {
      return this.propertiesService.findAll({
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
      });
    }

    return this.propertiesService.searchProperties(searchTerm, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
  }

  @Get('stats')
  async getPropertyStats() {
    return this.propertiesService.getPropertyStats();
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard)
  async findMyProperties(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    };

    return this.propertiesService.findByUserId(req.user.userId, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    return {
      message: 'Property retrieved successfully',
      property,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: Partial<CreatePropertyDto>,
    @Request() req: any,
  ) {
    const property = await this.propertiesService.update(id, updatePropertyDto, req.user.userId);
    return {
      message: 'Property updated successfully',
      property,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.propertiesService.remove(id, req.user.userId);
    return {
      message: 'Property deleted successfully',
    };
  }

  // Additional endpoints for specific property features

  @Get(':id/details')
  async getPropertyDetails(@Param('id') id: string) {
    const property = await this.propertiesService.findOne(id);
    
    // Return detailed property information
    return {
      message: 'Property details retrieved successfully',
      property: {
        ...property.toJSON(),
        // Add computed fields
        fullAddress: `${property.streetNo} ${property.stDirection || ''} ${property.streetName} ${property.streetType || ''}, ${property.city}, ${property.state} ${property.zipCode}`,
        priceFormatted: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(property.listPrice),
        // Add more computed fields as needed
      },
    };
  }

  @Get('featured')
  async getFeaturedProperties(
    @Query('limit') limit?: string,
  ) {
    // Get featured properties (you can implement your own logic)
    const featuredLimit = limit ? parseInt(limit) : 6;
    
    return this.propertiesService.findAll({
      limit: featuredLimit,
      page: 1,
    });
  }

  @Get('recent')
  async getRecentProperties(
    @Query('limit') limit?: string,
  ) {
    const recentLimit = limit ? parseInt(limit) : 10;
    
    return this.propertiesService.findAll({
      limit: recentLimit,
      page: 1,
    });
  }

  @Get('by-location/:city')
  async getPropertiesByCity(
    @Param('city') city: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      city,
    };

    return this.propertiesService.findAll(options);
  }

  @Get('by-price-range')
  async getPropertiesByPriceRange(
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      minPrice: parseFloat(minPrice),
      maxPrice: parseFloat(maxPrice),
    };

    return this.propertiesService.findAll(options);
  }

  // S3 Signed URL endpoints for image uploads
  @Post('upload/signed-url')
  @UseGuards(JwtAuthGuard)
  async generateSignedUrl(@Body() generateSignedUrlDto: GenerateSignedUrlDto) {
    const { files, expiresIn } = generateSignedUrlDto;
    
    const signedUrls = await this.s3Service.generateMultipleSignedUrls(files, expiresIn);
    
    return {
      message: 'Signed URLs generated successfully',
      signedUrls,
    };
  }

  @Post('upload/single-signed-url')
  @UseGuards(JwtAuthGuard)
  async generateSingleSignedUrl(@Body() singleFileDto: SingleFileSignedUrlDto) {
    const { fileName, contentType, expiresIn } = singleFileDto;
    
    const result = await this.s3Service.generateSignedUrl(fileName, contentType, expiresIn);
    
    return {
      message: 'Signed URL generated successfully',
      signedUrl: result.signedUrl,
      fileKey: result.fileKey,
    };
  }
} 