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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { GenerateSignedUrlDto, SingleFileSignedUrlDto } from './dto/generate-signed-url.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from './s3.service';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly s3Service: S3Service,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create a new property',
    description: 'Create a new property listing with all required details'
  })
  @ApiBody({ type: CreatePropertyDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Property successfully created',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Property created successfully' },
        property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            listType: { type: 'string', example: 'sale' },
            listPrice: { type: 'number', example: 450000 },
            streetNo: { type: 'string', example: '123' },
            streetName: { type: 'string', example: 'Main' },
            city: { type: 'string', example: 'Austin' },
            state: { type: 'string', example: 'TX' },
            zipCode: { type: 'string', example: '78701' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' } },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Get all properties',
    description: 'Retrieve a paginated list of properties with optional filtering'
  })
  @ApiQuery({ name: 'page', required: false, type: 'string', description: 'Page number', example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: 'string', description: 'Number of items per page', example: '10' })
  @ApiQuery({ name: 'searchTerm', required: false, type: 'string', description: 'Search term for property search' })
  @ApiQuery({ name: 'listType', required: false, type: 'string', description: 'Type of listing' })
  @ApiQuery({ name: 'minPrice', required: false, type: 'string', description: 'Minimum price filter', example: '100000' })
  @ApiQuery({ name: 'maxPrice', required: false, type: 'string', description: 'Maximum price filter', example: '500000' })
  @ApiQuery({ name: 'city', required: false, type: 'string', description: 'City filter', example: 'Austin' })
  @ApiQuery({ name: 'state', required: false, type: 'string', description: 'State filter', example: 'TX' })
  @ApiQuery({ name: 'bedrooms', required: false, type: 'string', description: 'Number of bedrooms', example: '3' })
  @ApiQuery({ name: 'bathrooms', required: false, type: 'string', description: 'Number of bathrooms', example: '2' })
  @ApiResponse({ 
    status: 200, 
    description: 'Properties retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        properties: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid' },
              listType: { type: 'string', example: 'sale' },
              listPrice: { type: 'number', example: 450000 },
              streetNo: { type: 'string', example: '123' },
              streetName: { type: 'string', example: 'Main' },
              city: { type: 'string', example: 'Austin' },
              state: { type: 'string', example: 'TX' },
              zipCode: { type: 'string', example: '78701' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 100 },
            totalPages: { type: 'number', example: 10 }
          }
        }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Search properties',
    description: 'Search properties by term with pagination'
  })
  @ApiQuery({ name: 'q', required: true, type: 'string', description: 'Search term', example: 'downtown austin' })
  @ApiQuery({ name: 'page', required: false, type: 'string', description: 'Page number', example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: 'string', description: 'Number of items per page', example: '10' })
  @ApiResponse({ 
    status: 200, 
    description: 'Search results retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        properties: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid' },
              listType: { type: 'string', example: 'sale' },
              listPrice: { type: 'number', example: 450000 },
              streetNo: { type: 'string', example: '123' },
              streetName: { type: 'string', example: 'Main' },
              city: { type: 'string', example: 'Austin' },
              state: { type: 'string', example: 'TX' },
              zipCode: { type: 'string', example: '78701' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 25 }
          }
        }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Get property by ID',
    description: 'Retrieve a specific property by its ID'
  })
  @ApiParam({ name: 'id', description: 'Property ID', example: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Property retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Property retrieved successfully' },
        property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            listType: { type: 'string', example: 'sale' },
            listPrice: { type: 'number', example: 450000 },
            streetNo: { type: 'string', example: '123' },
            streetName: { type: 'string', example: 'Main' },
            city: { type: 'string', example: 'Austin' },
            state: { type: 'string', example: 'TX' },
            zipCode: { type: 'string', example: '78701' },
            bedrooms: { type: 'array', items: { type: 'string' }, example: ['3'] },
            bathsFull: { type: 'array', items: { type: 'string' }, example: ['2'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Property not found',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Property not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Generate multiple signed URLs',
    description: 'Generate signed URLs for multiple file uploads to S3'
  })
  @ApiBody({ type: GenerateSignedUrlDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Signed URLs generated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Signed URLs generated successfully' },
        signedUrls: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fileName: { type: 'string', example: 'property-image-1.jpg' },
              signedUrl: { type: 'string', example: 'https://s3.amazonaws.com/bucket/key?signature...' },
              fileKey: { type: 'string', example: 'properties/uuid/property-image-1.jpg' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
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
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Generate single signed URL',
    description: 'Generate a signed URL for a single file upload to S3'
  })
  @ApiBody({ type: SingleFileSignedUrlDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Signed URL generated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Signed URL generated successfully' },
        signedUrl: { type: 'string', example: 'https://s3.amazonaws.com/bucket/key?signature...' },
        fileKey: { type: 'string', example: 'properties/uuid/property-image.jpg' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async generateSingleSignedUrl(@Body() singleFileDto: SingleFileSignedUrlDto) {
    const { fileName, contentType, expiresIn } = singleFileDto;
    
    const result = await this.s3Service.generateSignedUrl(fileName, contentType, expiresIn);
    
    return {
      message: 'Signed URL generated successfully',
      signedUrl: result.signedUrl,
      fileKey: result.fileKey,
    };
  }

  @Delete('upload/file')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete a file from S3',
    description: 'Delete an uploaded file from S3 using its fileKey'
  })
  @ApiQuery({ name: 'fileKey', required: true, type: 'string', description: 'S3 object key to delete' })
  @ApiResponse({ status: 200, description: 'File deleted successfully' })
  async deleteFile(@Query('fileKey') fileKey: string) {
    await this.s3Service.deleteObject(fileKey);
    return { message: 'File deleted successfully' };
  }
} 