import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileUploadRequest {
  @ApiProperty({
    description: 'Name of the file to upload',
    example: 'property-image-1.jpg',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  contentType: string;
}

export class GenerateSignedUrlDto {
  @ApiProperty({
    description: 'Array of files to generate signed URLs for',
    type: [FileUploadRequest],
    example: [
      { fileName: 'property-image-1.jpg', contentType: 'image/jpeg' },
      { fileName: 'property-image-2.jpg', contentType: 'image/jpeg' },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => FileUploadRequest)
  @IsArray()
  files: FileUploadRequest[];

  @ApiProperty({
    description: 'Expiration time for the signed URLs in seconds',
    example: 3600,
    minimum: 300,
    maximum: 3600,
    default: 3600,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(300) // Minimum 5 minutes
  @Max(3600) // Maximum 1 hour
  expiresIn?: number = 3600;
}

export class SingleFileSignedUrlDto {
  @ApiProperty({
    description: 'Name of the file to upload',
    example: 'property-image.jpg',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'MIME type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  contentType: string;

  @ApiProperty({
    description: 'Expiration time for the signed URL in seconds',
    example: 3600,
    minimum: 300,
    maximum: 3600,
    default: 3600,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(300) // Minimum 5 minutes
  @Max(3600) // Maximum 1 hour
  expiresIn?: number = 3600;
} 