import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Shape of `details` when type === 'home'.
 * Mirrors the multi-step home insurance flow (address, property facts, fire-station distance).
 */
export interface HomeInsuranceDetails {
  address?: string;
  unit?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  homeType?: string; // single_family | condo | rental | mobile_home
  ownership?: string; // own | closing_soon | looking
  yearBuilt?: string;
  foundationType?: string;
  roofYear?: string;
  squareFootage?: string;
  rebuildCost?: string;
  fireStationDistance?: string; // 1_5_miles | 5_10_miles | 10_plus_miles
}

export interface AutoVehicle {
  year?: string;
  make?: string;
  model?: string;
  ownership?: string; // own | finance | lease
  primaryUse?: string; // commuting | pleasure | business
  mileageFrequency?: string; // per_year | per_month
  estimatedMileage?: string;
  durationOwned?: string;
}

export interface AutoDriver {
  firstName?: string;
  lastName?: string;
  birthdate?: string;
  gender?: string;
  maritalStatus?: string;
  ageFirstLicensed?: string;
  education?: string;
  creditScore?: string;
  militaryService?: boolean | string;
}

/**
 * Shape of `details` when type === 'auto'.
 */
export interface AutoInsuranceDetails {
  helpType?: string; // compare | change_coverage | uninsured
  homeOwnership?: string; // own_home | own_condo | rent | other
  purchaseTiming?: string; // today | future
  address?: string;
  unit?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  vehicles?: AutoVehicle[];
  drivers?: AutoDriver[];
  currentProvider?: string;
  continuouslyInsured?: string;
  bodilyInjuryLimits?: string;
  accidentsTickets?: string; // yes | no
}

export class CreateInsuranceRequestDto {
  @ApiProperty({
    description: 'Type of insurance quote being requested',
    enum: ['home', 'auto'],
    example: 'home',
  })
  @IsNotEmpty()
  @IsIn(['home', 'auto'])
  type: 'home' | 'auto';

  @ApiProperty({
    description: 'Full name of the person requesting the quote',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'Email where the quote should be sent',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'Phone number for follow-up',
    example: '+1 (832) 555-0199',
  })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({
    description:
      'All form answers. The shape depends on `type`: HomeInsuranceDetails for "home", AutoInsuranceDetails for "auto".',
    example: {
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
  })
  @IsOptional()
  @IsObject()
  details?: HomeInsuranceDetails | AutoInsuranceDetails;
}
