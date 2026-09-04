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
import { RentRequestsService } from './rent-requests.service';
import { CreateRentRequestDto } from './dto/create-rent-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Rent Requests')
@Controller('rent-requests')
export class RentRequestsController {
  constructor(
    private readonly rentRequestsService: RentRequestsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Request a rent quote for renting out a property',
    description:
      'For property owners who want to rent out their home. Sends a rent quote request email to the admin with the property and contact details. Nothing is stored — the email is the request.',
  })
  @ApiBody({
    type: CreateRentRequestDto,
    description: 'Rent-out quote request data with property details',
    examples: {
      example1: {
        summary: 'Example rent-out quote request',
        value: {
          homeAddress: '3107 Sweet Audrey Lane Richmond TX 77406',
          rentTimeline: 'right_away',
          expectedRent: '1501_2500',
          propertyType: 'single_family',
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '+1 (955) 612-4208',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Rent quote request sent to the admin',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Rent quote request sent successfully' },
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
  async create(@Body() createRentRequestDto: CreateRentRequestDto, @Request() req: any) {
    await this.rentRequestsService.create(createRentRequestDto, req.user.userId);

    return {
      message: 'Rent quote request sent successfully',
    };
  }
}
