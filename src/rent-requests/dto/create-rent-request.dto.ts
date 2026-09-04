import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRentRequestDto {
  @ApiProperty({
    description: 'Home address of the property the owner wants to rent out',
    example: '3107 Sweet Audrey Lane Richmond TX 77406',
  })
  homeAddress: string;

  @ApiProperty({
    description: 'How soon the owner wants to rent out the property',
    example: 'right_away',
  })
  rentTimeline: string;

  @ApiProperty({
    description: 'Monthly rent the owner expects for the property',
    example: '1501_2500',
  })
  expectedRent: string;

  @ApiProperty({
    description: 'Type of property',
    example: 'single_family',
  })
  propertyType: string;

  @ApiProperty({
    description: 'Full name of the owner',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the owner',
    example: 'john@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number of the owner',
    example: '+1 (955) 612-4208',
  })
  phoneNumber: string;

  @ApiPropertyOptional({
    description: 'Catalog property the owner picked from address suggestions, if any',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  propertyId?: string;
}
