import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuyRequest } from './buy-request.model';
import { CreateBuyRequestDto } from './dto/create-buy-request.dto';
import { EmailService } from '../auth/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class BuyRequestsService {
  private readonly logger = new Logger(BuyRequestsService.name);

  constructor(
    @InjectModel(BuyRequest)
    private buyRequestModel: typeof BuyRequest,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  async create(createBuyRequestDto: CreateBuyRequestDto, userId: string): Promise<BuyRequest> {
    // Convert moveDate string to Date if provided
    const buyRequestData: any = {
      ...createBuyRequestDto,
      userId,
    };

    // Convert moveDate from ISO string to Date if provided
    if (createBuyRequestDto.moveDate) {
      buyRequestData.moveDate = new Date(createBuyRequestDto.moveDate);
    }

    // Handle creditScore - accept both string and number, convert to string
    if (createBuyRequestDto.creditScore !== undefined && createBuyRequestDto.creditScore !== null) {
      // Convert to string (handles both numeric and text values like "good", "fair", etc.)
      buyRequestData.creditScore = String(createBuyRequestDto.creditScore);
    } else {
      // Not provided, set to null
      buyRequestData.creditScore = null;
    }

    const buyRequest = await this.buyRequestModel.create(buyRequestData as any);

    // Send email notification to admin in the background (don't wait for it)
    this.sendAdminNotification(buyRequest, userId).catch((error) => {
      this.logger.error('Failed to send admin notification:', error);
    });

    return buyRequest;
  }

  private async sendAdminNotification(buyRequest: BuyRequest, userId: string): Promise<void> {
    try {
      // Get user details
      const user = await this.usersService.findById(userId);
      
      if (!user) {
        this.logger.warn(`User not found for userId: ${userId}. Skipping admin notification.`);
        return;
      }

      // Convert Sequelize model to plain object to ensure all data is accessible
      const buyRequestData = buyRequest.get({ plain: true });

      // Log the data for debugging
      this.logger.debug('Sending buy request notification with data:', {
        id: buyRequestData.id,
        bedrooms: buyRequestData.bedrooms,
        budget: buyRequestData.budget,
        city: buyRequestData.city,
      });

      // Send email to admin with all details
      await this.emailService.sendBuyRequestNotificationToAdmin(
        {
          id: buyRequestData.id,
          bedrooms: buyRequestData.bedrooms,
          budget: buyRequestData.budget,
          city: buyRequestData.city,
          neighborhoods: buyRequestData.neighborhoods,
          workLocation: buyRequestData.workLocation,
          commuteRadius: buyRequestData.commuteRadius,
          features: buyRequestData.features,
          pets: buyRequestData.pets,
          priority: buyRequestData.priority,
          moveDate: buyRequestData.moveDate ? new Date(buyRequestData.moveDate) : undefined,
          moveUrgency: buyRequestData.moveUrgency,
          duration: buyRequestData.duration,
          roommates: buyRequestData.roommates,
          creditScore: buyRequestData.creditScore,
          createdAt: buyRequestData.createdAt ? new Date(buyRequestData.createdAt) : new Date(),
        },
        {
          fullName: user.fullName,
          email: user.email,
        },
      );
    } catch (error) {
      this.logger.error('Error sending admin notification:', error);
      // Don't throw - we don't want email failures to break the buy request creation
    }
  }
}

