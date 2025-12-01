import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SellRequest } from './sell-request.model';
import { CreateSellRequestDto } from './dto/create-sell-request.dto';
import { EmailService } from '../auth/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class SellRequestsService {
  private readonly logger = new Logger(SellRequestsService.name);

  constructor(
    @InjectModel(SellRequest)
    private sellRequestModel: typeof SellRequest,
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  async create(createSellRequestDto: CreateSellRequestDto, userId: string): Promise<SellRequest> {
    const sellRequestData: any = {
      ...createSellRequestDto,
      userId,
    };

    const sellRequest = await this.sellRequestModel.create(sellRequestData as any);

    // Send email notification to admin in the background (don't wait for it)
    this.sendAdminNotification(sellRequest, userId).catch((error) => {
      this.logger.error('Failed to send admin notification:', error);
    });

    return sellRequest;
  }

  private async sendAdminNotification(sellRequest: SellRequest, userId: string): Promise<void> {
    try {
      // Get user details
      const user = await this.usersService.findById(userId);
      
      if (!user) {
        this.logger.warn(`User not found for userId: ${userId}. Skipping admin notification.`);
        return;
      }

      // Convert Sequelize model to plain object to ensure all data is accessible
      const sellRequestData = sellRequest.get({ plain: true });

      // Log the data for debugging
      this.logger.debug('Sending sell request notification with data:', {
        id: sellRequestData.id,
        homeAddress: sellRequestData.homeAddress,
        estimatedPrice: sellRequestData.estimatedPrice,
        propertyType: sellRequestData.propertyType,
      });

      // Send email to admin with all details
      await this.emailService.sendSellRequestNotificationToAdmin(
        {
          id: sellRequestData.id,
          homeAddress: sellRequestData.homeAddress,
          sellTimeline: sellRequestData.sellTimeline,
          estimatedPrice: sellRequestData.estimatedPrice,
          propertyType: sellRequestData.propertyType,
          fullName: sellRequestData.fullName,
          email: sellRequestData.email,
          phoneNumber: sellRequestData.phoneNumber,
          createdAt: sellRequestData.createdAt ? new Date(sellRequestData.createdAt) : new Date(),
        },
        {
          fullName: user.fullName,
          email: user.email,
        },
      );
    } catch (error) {
      this.logger.error('Error sending admin notification:', error);
      // Don't throw - we don't want email failures to break the sell request creation
    }
  }
}

