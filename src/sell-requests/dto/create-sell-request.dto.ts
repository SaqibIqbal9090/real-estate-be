import { ApiProperty } from '@nestjs/swagger';

export class CreateSellRequestDto {
  @ApiProperty({
    description: 'Home address of the property to sell',
    example: 'bk nm',
  })
  homeAddress: string;

  @ApiProperty({
    description: 'Timeline for selling the property',
    example: 'right_away',
  })
  sellTimeline: string;

  @ApiProperty({
    description: 'Estimated price range for the property',
    example: '501k_700k',
  })
  estimatedPrice: string;

  @ApiProperty({
    description: 'Type of property',
    example: 'single_family',
  })
  propertyType: string;

  @ApiProperty({
    description: 'Full name of the seller',
    example: 'In quia veritatis qu',
  })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the seller',
    example: 'rume@mailinator.com',
  })
  email: string;

  @ApiProperty({
    description: 'Phone number of the seller',
    example: '+1 (955) 612-4208',
  })
  phoneNumber: string;
}





