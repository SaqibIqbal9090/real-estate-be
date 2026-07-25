import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  Body,
  UseGuards,
  HttpStatus,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceRequestDto } from './dto/create-insurance-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Insurance')
@Controller('insurance')
export class InsuranceController {
  constructor(private readonly insuranceService: InsuranceService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Submit an insurance quote request (Home or Auto)',
    description:
      'Public endpoint. Stores the request in the database and emails both the user (confirmation) and the admin (notification).',
  })
  @ApiBody({
    type: CreateInsuranceRequestDto,
    examples: {
      home: {
        summary: 'Home insurance request',
        value: {
          type: 'home',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1 (832) 555-0199',
          details: {
            address: '11311 Mirrlees Path',
            city: 'Richmond',
            state: 'TX',
            zipCode: '77407',
            homeType: 'single_family',
            ownership: 'own',
            yearBuilt: '2017',
            foundationType: 'slab',
            roofYear: '2017',
            squareFootage: '2400',
            rebuildCost: '350000',
            fireStationDistance: '1_5_miles',
          },
        },
      },
      auto: {
        summary: 'Auto insurance request',
        value: {
          type: 'auto',
          fullName: 'Abdul Dadabhoy',
          email: 'abdul@example.com',
          phoneNumber: '+1 (832) 555-0123',
          details: {
            helpType: 'compare',
            homeOwnership: 'own_home',
            purchaseTiming: 'today',
            address: '11311 Mirrlees Path',
            city: 'Richmond',
            state: 'TX',
            zipCode: '77407',
            vehicles: [
              {
                year: '2021',
                make: 'Toyota',
                model: 'Tundra',
                ownership: 'own',
                primaryUse: 'commuting',
                mileageFrequency: 'per_year',
                estimatedMileage: '14000',
                durationOwned: '3_plus_years',
              },
            ],
            drivers: [
              {
                firstName: 'Abdul',
                lastName: 'Dadabhoy',
                birthdate: '1971-01-01',
                gender: 'male',
                maritalStatus: 'married',
                ageFirstLicensed: '16',
                education: 'bachelors',
                creditScore: 'good',
                militaryService: false,
              },
            ],
            currentProvider: 'Nationwide',
            continuouslyInsured: 'more_than_3_years',
            bodilyInjuryLimits: '100k_300k',
            accidentsTickets: 'no',
          },
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Insurance request created successfully.' })
  async create(@Body() dto: CreateInsuranceRequestDto) {
    const insuranceRequest = await this.insuranceService.create(dto);
    return {
      message: 'Insurance request submitted successfully',
      insuranceRequest,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'List insurance requests (admin)',
    description: 'Returns all stored insurance requests, optionally filtered by type.',
  })
  @ApiQuery({ name: 'type', required: false, enum: ['home', 'auto'] })
  @ApiResponse({ status: 200, description: 'List of insurance requests.' })
  async findAll(@Query('type') type?: 'home' | 'auto') {
    const insuranceRequests = await this.insuranceService.findAll(type);
    return { count: insuranceRequests.length, insuranceRequests };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get a single insurance request by id (admin)' })
  @ApiResponse({ status: 200, description: 'The insurance request.' })
  @ApiResponse({ status: 404, description: 'Insurance request not found.' })
  async findOne(@Param('id') id: string) {
    const insuranceRequest = await this.insuranceService.findOne(id);
    if (!insuranceRequest) {
      throw new NotFoundException('Insurance request not found');
    }
    return { insuranceRequest };
  }
}
