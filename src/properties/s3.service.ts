import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    // Validate required environment variables
    if (!accessKeyId || !secretAccessKey || !bucketName) {
      throw new Error('Missing required AWS configuration. Please check AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET_NAME environment variables.');
    }

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  async generateSignedUrl(
    fileName: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<{ signedUrl: string; fileKey: string }> {
    // Generate a unique file key with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName.split('.').pop();
    const fileKey = `properties/${timestamp}-${randomString}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });

    return {
      signedUrl,
      fileKey,
    };
  }

  async generateMultipleSignedUrls(
    files: Array<{ fileName: string; contentType: string }>,
    expiresIn: number = 3600,
  ): Promise<Array<{ signedUrl: string; fileKey: string; originalName: string }>> {
    const signedUrls = await Promise.all(
      files.map(async (file) => {
        const result = await this.generateSignedUrl(
          file.fileName,
          file.contentType,
          expiresIn,
        );
        return {
          ...result,
          originalName: file.fileName,
        };
      }),
    );

    return signedUrls;
  }

  async deleteObject(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
    });
    await this.s3Client.send(command);
  }
} 