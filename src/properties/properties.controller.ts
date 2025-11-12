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
    description: `Create a new property listing. 

**Status Options:**
- \`draft\`: Save as incomplete (minimal validation, only basic fields required). Default if status is not provided.
- \`published\`: Save as complete listing (full validation required). Requires: listType, listPrice, streetNo, streetName, city, state, zipCode.

**Required Fields (for published status):**
- listType: Type of listing (sale, lease, both)
- listPrice: Listing price
- streetNo: Street number
- streetName: Street name
- city: City
- state: State
- zipCode: ZIP code

**Optional Fields:** Over 200+ optional fields available including address details, tax information, building details, property features, room details, HOA information, and more. See CreatePropertyDto for complete field list.`
  })
  @ApiBody({ 
    type: CreatePropertyDto,
    description: 'Property data. Status defaults to "draft" if not provided. When status="published", all required fields must be present.',
    examples: {
      draft: {
        summary: 'Create as draft (minimal fields)',
        value: {
          listType: 'sale',
          listPrice: 450000,
          streetNo: '123',
          streetName: 'Main',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          status: 'draft'
        }
      },
      published: {
        summary: 'Create as published (all required fields)',
        value: {
          listType: 'sale',
          listPrice: 450000,
          streetNo: '123',
          streetName: 'Main',
          city: 'Austin',
          state: 'TX',
          zipCode: '78701',
          status: 'published',
          bedrooms: 3,
          bathsFull: 2,
          buildingSqft: 2500,
          propertyType: ['Single Family'],
          interiorFeatures: ['crown-molding', 'hardwood-floors']
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Property successfully created. Message varies based on status (draft vs published).',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Property saved as draft successfully',
          enum: [
            'Property saved as draft successfully',
            'Property created and published successfully'
          ]
        },
        property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            status: { type: 'string', example: 'draft', enum: ['draft', 'published'] },
            listType: { type: 'string', example: 'sale' },
            listPrice: { type: 'number', example: 450000 },
            streetNo: { type: 'string', example: '123' },
            streetName: { type: 'string', example: 'Main' },
            city: { type: 'string', example: 'Austin' },
            state: { type: 'string', example: 'TX' },
            zipCode: { type: 'string', example: '78701' },
            userId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
          },
          description: 'Full property object with all provided fields. Additional optional fields may be included based on request body.'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed or missing required fields when attempting to publish',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { 
          type: 'string', 
          example: 'Cannot publish property. Missing required fields: listType, listPrice',
          description: 'Error message indicating which required fields are missing (when status="published")'
        },
        error: { type: 'string', example: 'Bad Request' }
      }
    },
    examples: {
      missingFields: {
        summary: 'Missing required fields for publishing',
        value: {
          statusCode: 400,
          message: 'Cannot publish property. Missing required fields: listType, listPrice',
          error: 'Bad Request'
        }
      },
      validationError: {
        summary: 'General validation error',
        value: {
          statusCode: 400,
          message: ['listPrice must be a number', 'zipCode must be a string'],
          error: 'Bad Request'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token',
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
    
    // Set default status to 'draft' if not provided
    if (!createPropertyDto.status) {
      createPropertyDto.status = 'draft';
    }
    
    const property = await this.propertiesService.create(createPropertyDto);
    return {
      message: property.status === 'published' 
        ? 'Property created and published successfully' 
        : 'Property saved as draft successfully',
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
  @ApiQuery({ name: 'zipCode', required: false, type: 'string', description: 'Filter by ZIP code (exact match)', example: '78701' })
  @ApiQuery({ name: 'minPrice', required: false, type: 'string', description: 'Minimum price filter', example: '100000' })
  @ApiQuery({ name: 'maxPrice', required: false, type: 'string', description: 'Maximum price filter', example: '500000' })
  @ApiQuery({ name: 'propertyType', required: false, type: 'string', description: 'Property type filter', example: 'Single Family' })
  @ApiQuery({ name: 'bedrooms', required: false, type: 'string', description: 'Number of bedrooms', example: '3' })
  @ApiQuery({ name: 'bathrooms', required: false, type: 'string', description: 'Number of bathrooms', example: '2' })
  @ApiQuery({ name: 'minSqft', required: false, type: 'string', description: 'Minimum square footage', example: '1000' })
  @ApiQuery({ name: 'maxSqft', required: false, type: 'string', description: 'Maximum square footage', example: '5000' })
  @ApiQuery({ name: 'amenities', required: false, type: 'string', description: 'Comma-separated list of amenities', example: 'crown-molding,balcony' })
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
    @Query('zipCode') zipCode?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: string,
    @Query('bedrooms') bedrooms?: string,
    @Query('bathrooms') bathrooms?: string,
    @Query('minSqft') minSqft?: string,
    @Query('maxSqft') maxSqft?: string,
    @Query('amenities') amenities?: string,
  ) {
    const options = {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      zipCode,
      propertyType: propertyType ? propertyType.split(',').filter(t => t.trim()) : undefined,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      minSqft: minSqft ? parseFloat(minSqft) : undefined,
      maxSqft: maxSqft ? parseFloat(maxSqft) : undefined,
      amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(a => a) : undefined,
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
            total: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 }
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
  @ApiOperation({ 
    summary: 'Get property statistics',
    description: 'Retrieve aggregated statistics about properties including total count, average price, and distribution by type and state'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalProperties: { type: 'number', example: 150 },
        averagePrice: { type: 'number', example: 425000.50 },
        propertiesByType: { 
          type: 'object', 
          example: { 'sale': 100, 'lease': 50 },
          additionalProperties: { type: 'number' }
        },
        propertiesByState: { 
          type: 'object', 
          example: { 'TX': 75, 'CA': 50, 'NY': 25 },
          additionalProperties: { type: 'number' }
        }
      }
    }
  })
  async getPropertyStats() {
    return this.propertiesService.getPropertyStats();
  }

  @Get('my-properties')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get my properties',
    description: 'Retrieve all properties belonging to the authenticated user with pagination. Includes both draft and published properties.'
  })
  @ApiQuery({ name: 'page', required: false, type: 'string', description: 'Page number', example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: 'string', description: 'Number of items per page', example: '10' })
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
              status: { type: 'string', example: 'draft', enum: ['draft', 'published'] },
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
            total: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 }
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

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Publish a draft property',
    description: 'Convert a draft property to published status. Validates that all required fields are present before publishing.'
  })
  @ApiParam({ name: 'id', description: 'Property ID', example: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Property published successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Property published successfully' },
        property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            status: { type: 'string', example: 'published' },
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - missing required fields for publishing',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Cannot publish property. Missing required fields: listType, listPrice' },
        error: { type: 'string', example: 'Bad Request' }
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
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not your property',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only publish your own properties' },
        error: { type: 'string', example: 'Forbidden' }
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
  async publish(@Param('id') id: string, @Request() req: any) {
    const property = await this.propertiesService.publish(id, req.user.userId);
    return {
      message: 'Property published successfully',
      property,
    };
  }

  @Patch(':id/unpublish')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Unpublish a property (convert to draft)',
    description: 'Convert a published property back to draft status. This will hide it from public listings.'
  })
  @ApiParam({ name: 'id', description: 'Property ID', example: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Property unpublished successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Property unpublished successfully' },
        property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            status: { type: 'string', example: 'draft' },
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
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not your property',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only unpublish your own properties' },
        error: { type: 'string', example: 'Forbidden' }
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
  async unpublish(@Param('id') id: string, @Request() req: any) {
    const property = await this.propertiesService.unpublish(id, req.user.userId);
    return {
      message: 'Property unpublished successfully',
      property,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Update a property',
    description: 'Update property details. To publish a draft, include status: "published" in the body, or use the /properties/:id/publish endpoint.'
  })
  @ApiParam({ name: 'id', description: 'Property ID', example: 'uuid' })
  @ApiBody({ type: CreatePropertyDto, required: false })
  @ApiResponse({ 
    status: 200, 
    description: 'Property updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Property updated successfully' },
        property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            status: { type: 'string', example: 'published', enum: ['draft', 'published'] },
            listType: { type: 'string', example: 'sale' },
            listPrice: { type: 'number', example: 450000 },
            streetNo: { type: 'string', example: '123' },
            streetName: { type: 'string', example: 'Main' },
            city: { type: 'string', example: 'Austin' },
            state: { type: 'string', example: 'TX' },
            zipCode: { type: 'string', example: '78701' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - validation failed or missing required fields for publishing',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Cannot publish property. Missing required fields: listType, listPrice' },
        error: { type: 'string', example: 'Bad Request' }
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
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not your property',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only update your own properties' },
        error: { type: 'string', example: 'Forbidden' }
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
  async update(
    @Param('id') id: string,
    @Body() updatePropertyDto: Partial<CreatePropertyDto>,
    @Request() req: any,
  ) {
    const property = await this.propertiesService.update(id, updatePropertyDto, req.user.userId);
    return {
      message: property.status === 'published' && updatePropertyDto.status === 'published'
        ? 'Property updated and published successfully'
        : 'Property updated successfully',
      property,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete a property',
    description: 'Permanently delete a property. Only the property owner can delete their own properties.'
  })
  @ApiParam({ name: 'id', description: 'Property ID', example: 'uuid' })
  @ApiResponse({ 
    status: 204, 
    description: 'Property deleted successfully',
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
  @ApiResponse({ 
    status: 403, 
    description: 'Forbidden - not your property',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only delete your own properties' },
        error: { type: 'string', example: 'Forbidden' }
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
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.propertiesService.remove(id, req.user.userId);
    return {
      message: 'Property deleted successfully',
    };
  }

  // Additional endpoints for specific property features

  @Get(':id/details')
  @ApiOperation({ 
    summary: 'Get detailed property information',
    description: 'Retrieve comprehensive property details including computed fields like formatted address and price'
  })
  @ApiParam({ name: 'id', description: 'Property ID', example: 'uuid' })
  @ApiResponse({ 
    status: 200, 
    description: 'Property details retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Property details retrieved successfully' },
        property: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid' },
            listType: { type: 'string', example: 'sale' },
            listPrice: { type: 'number', example: 450000 },
            fullAddress: { type: 'string', example: '123 Main St, Austin, TX 78701' },
            priceFormatted: { type: 'string', example: '$450,000.00' },
            streetNo: { type: 'string', example: '123' },
            streetName: { type: 'string', example: 'Main' },
            city: { type: 'string', example: 'Austin' },
            state: { type: 'string', example: 'TX' },
            zipCode: { type: 'string', example: '78701' },
            bedrooms: { type: 'number', example: 3 },
            bathsFull: { type: 'number', example: 2 },
            buildingSqft: { type: 'number', example: 2500 },
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
  @ApiOperation({ 
    summary: 'Get featured properties',
    description: 'Retrieve a list of featured properties. Default limit is 6 properties.'
  })
  @ApiQuery({ name: 'limit', required: false, type: 'string', description: 'Number of featured properties to retrieve', example: '6' })
  @ApiResponse({ 
    status: 200, 
    description: 'Featured properties retrieved successfully',
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
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 6 },
            total: { type: 'number', example: 6 },
            totalPages: { type: 'number', example: 1 }
          }
        }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Get recent properties',
    description: 'Retrieve the most recently added properties. Default limit is 10 properties.'
  })
  @ApiQuery({ name: 'limit', required: false, type: 'string', description: 'Number of recent properties to retrieve', example: '10' })
  @ApiResponse({ 
    status: 200, 
    description: 'Recent properties retrieved successfully',
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
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 50 },
            totalPages: { type: 'number', example: 5 }
          }
        }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Get properties by city',
    description: 'Retrieve properties filtered by city name with pagination'
  })
  @ApiParam({ name: 'city', description: 'City name to filter by', example: 'Austin' })
  @ApiQuery({ name: 'page', required: false, type: 'string', description: 'Page number', example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: 'string', description: 'Number of items per page', example: '10' })
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
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 }
          }
        }
      }
    }
  })
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
  @ApiOperation({ 
    summary: 'Get properties by price range',
    description: 'Retrieve properties within a specified price range with pagination'
  })
  @ApiQuery({ name: 'minPrice', required: true, type: 'string', description: 'Minimum price', example: '100000' })
  @ApiQuery({ name: 'maxPrice', required: true, type: 'string', description: 'Maximum price', example: '500000' })
  @ApiQuery({ name: 'page', required: false, type: 'string', description: 'Page number', example: '1' })
  @ApiQuery({ name: 'limit', required: false, type: 'string', description: 'Number of items per page', example: '10' })
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
              listPrice: { type: 'number', example: 350000 },
              streetNo: { type: 'string', example: '123' },
              streetName: { type: 'string', example: 'Main' },
              city: { type: 'string', example: 'Austin' },
              state: { type: 'string', example: 'TX' },
              zipCode: { type: 'string', example: '78701' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 15 },
            totalPages: { type: 'number', example: 2 }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - invalid price parameters',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'minPrice and maxPrice are required' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
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
  @ApiQuery({ name: 'fileKey', required: true, type: 'string', description: 'S3 object key to delete', example: 'properties/uuid/property-image.jpg' })
  @ApiResponse({ 
    status: 200, 
    description: 'File deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'File deleted successfully' }
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
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - fileKey is required',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'fileKey is required' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async deleteFile(@Query('fileKey') fileKey: string) {
    await this.s3Service.deleteObject(fileKey);
    return { message: 'File deleted successfully' };
  }
} 