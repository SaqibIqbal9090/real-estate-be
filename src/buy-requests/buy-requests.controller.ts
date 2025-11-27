import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { BuyRequestsService } from './buy-requests.service';
import { CreateBuyRequestDto } from './dto/create-buy-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Buy Requests')
@Controller('buy-requests')
export class BuyRequestsController {
  constructor(
    private readonly buyRequestsService: BuyRequestsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create a new buy request',
    description: 'Create a new buy request with property preferences. The request will be stored on behalf of the authenticated user.',
  })
  @ApiBody({ 
    type: CreateBuyRequestDto,
    description: 'Buy request data with property preferences',
    examples: {
      example1: {
        summary: 'Example buy request',
        value: {
          bedrooms: '1',
          budget: 5000,
          city: 'Houston, TX',
          neighborhoods: ['Richmond, TX'],
          workLocation: '',
          commuteRadius: 25,
          features: ['connections', 'pool', 'ac', 'patio'],
          pets: ['dog'],
          priority: 'price',
          moveDate: '2025-11-29T19:00:00.000Z',
          moveUrgency: 'urgent',
          duration: 12,
          roommates: 'partner',
          creditScore: 750,
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Buy request successfully created',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Buy request created successfully' },
        buyRequest: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            bedrooms: { type: 'string', example: '1' },
            budget: { type: 'number', example: 5000 },
            city: { type: 'string', example: 'Houston, TX' },
            neighborhoods: { type: 'array', items: { type: 'string' }, example: ['Richmond, TX'] },
            workLocation: { type: 'string', example: '' },
            commuteRadius: { type: 'number', example: 25 },
            features: { type: 'array', items: { type: 'string' }, example: ['connections', 'pool', 'ac', 'patio'] },
            pets: { type: 'array', items: { type: 'string' }, example: ['dog'] },
            priority: { type: 'string', example: 'price' },
            moveDate: { type: 'string', format: 'date-time', example: '2025-11-29T19:00:00.000Z' },
            moveUrgency: { type: 'string', example: 'urgent' },
            duration: { type: 'number', example: 12 },
            roommates: { type: 'string', example: 'partner' },
            creditScore: { type: 'number', example: 750 },
            userId: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          },
        },
      },
    },
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized - invalid or missing JWT token',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  async create(@Body() createBuyRequestDto: CreateBuyRequestDto, @Request() req: any) {
    // Set the userId from the authenticated user
    const buyRequest = await this.buyRequestsService.create(createBuyRequestDto, req.user.userId);
    
    return {
      message: 'Buy request created successfully',
      buyRequest,
    };
  }
}

