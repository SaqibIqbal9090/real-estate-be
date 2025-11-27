import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBuyRequestDto {
  @ApiPropertyOptional({
    description: 'Number of bedrooms',
    example: '1',
  })
  bedrooms?: string;

  @ApiPropertyOptional({
    description: 'Budget for the property',
    example: 5000,
    type: 'number',
  })
  budget?: number;

  @ApiPropertyOptional({
    description: 'City where the property should be located',
    example: 'Houston, TX',
  })
  city?: string;

  @ApiPropertyOptional({
    description: 'Preferred neighborhoods',
    example: ['Richmond, TX'],
    type: [String],
    isArray: true,
  })
  neighborhoods?: string[];

  @ApiPropertyOptional({
    description: 'Work location',
    example: '',
  })
  workLocation?: string;

  @ApiPropertyOptional({
    description: 'Commute radius in miles',
    example: 25,
    type: 'number',
  })
  commuteRadius?: number;

  @ApiPropertyOptional({
    description: 'Desired features',
    example: ['connections', 'pool', 'ac', 'patio'],
    type: [String],
    isArray: true,
  })
  features?: string[];

  @ApiPropertyOptional({
    description: 'Pets allowed',
    example: ['dog'],
    type: [String],
    isArray: true,
  })
  pets?: string[];

  @ApiPropertyOptional({
    description: 'Priority preference',
    example: 'price',
  })
  priority?: string;

  @ApiPropertyOptional({
    description: 'Preferred move-in date',
    example: '2025-11-29T19:00:00.000Z',
    type: 'string',
    format: 'date-time',
  })
  moveDate?: string;

  @ApiPropertyOptional({
    description: 'Move urgency level',
    example: 'urgent',
  })
  moveUrgency?: string;

  @ApiPropertyOptional({
    description: 'Duration in months',
    example: 12,
    type: 'number',
  })
  duration?: number;

  @ApiPropertyOptional({
    description: 'Roommates preference',
    example: 'partner',
  })
  roommates?: string;

  @ApiPropertyOptional({
    description: 'Credit score (can be numeric value like 750 or text value like "good", "fair", "excellent")',
    example: 'good',
    oneOf: [
      { type: 'number', example: 750 },
      { type: 'string', example: 'good' },
    ],
  })
  creditScore?: number | string;
}

