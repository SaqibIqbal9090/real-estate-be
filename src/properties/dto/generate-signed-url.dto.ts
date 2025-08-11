import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class FileUploadRequest {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;
}

export class GenerateSignedUrlDto {
  @ValidateNested({ each: true })
  @Type(() => FileUploadRequest)
  @IsArray()
  files: FileUploadRequest[];

  @IsOptional()
  @IsNumber()
  @Min(300) // Minimum 5 minutes
  @Max(3600) // Maximum 1 hour
  expiresIn?: number = 3600;
}

export class SingleFileSignedUrlDto {
  @IsString()
  fileName: string;

  @IsString()
  contentType: string;

  @IsOptional()
  @IsNumber()
  @Min(300) // Minimum 5 minutes
  @Max(3600) // Maximum 1 hour
  expiresIn?: number = 3600;
} 