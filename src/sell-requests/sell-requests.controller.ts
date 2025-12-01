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
import { SellRequestsService } from './sell-requests.service';
import { CreateSellRequestDto } from './dto/create-sell-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Sell Requests')
@Controller('sell-requests')
export class SellRequestsController {
  constructor(
    private readonly sellRequestsService: SellRequestsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Create a new sell request',
    description: 'Create a new sell request with property details. The request will be stored on behalf of the authenticated user.',
  })
  @ApiBody({ 
    type: CreateSellRequestDto,
    description: 'Sell request data with property details',
    examples: {
      example1: {
        summary: 'Example sell request',
        value: {
          homeAddress: 'bk nm',
          sellTimeline: 'right_away',
          estimatedPrice: '501k_700k',
          propertyType: 'single_family',
          fullName: 'In quia veritatis qu',
          email: 'rume@mailinator.com',
          phoneNumber: '+1 (955) 612-4208',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Sell request successfully created',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Sell request created successfully' },
        sellRequest: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            homeAddress: { type: 'string', example: 'bk nm' },
            sellTimeline: { type: 'string', example: 'right_away' },
            estimatedPrice: { type: 'string', example: '501k_700k' },
            propertyType: { type: 'string', example: 'single_family' },
            fullName: { type: 'string', example: 'In quia veritatis qu' },
            email: { type: 'string', example: 'rume@mailinator.com' },
            phoneNumber: { type: 'string', example: '+1 (955) 612-4208' },
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
  async create(@Body() createSellRequestDto: CreateSellRequestDto, @Request() req: any) {
    // Set the userId from the authenticated user
    const sellRequest = await this.sellRequestsService.create(createSellRequestDto, req.user.userId);
    
    return {
      message: 'Sell request created successfully',
      sellRequest,
    };
  }
}

