import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateRentRequestDto } from './dto/create-rent-request.dto';
import { EmailService } from '../auth/email.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RentRequestsService {
  private readonly logger = new Logger(RentRequestsService.name);

  constructor(
    private emailService: EmailService,
    private usersService: UsersService,
  ) {}

  // Rent requests are not persisted — the quote email to the admin IS the
  // request, so the send is awaited and a failure surfaces to the caller.
  async create(createRentRequestDto: CreateRentRequestDto, userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);

    try {
      await this.emailService.sendRentQuoteNotificationToAdmin(
        {
          homeAddress: createRentRequestDto.homeAddress,
          rentTimeline: createRentRequestDto.rentTimeline,
          expectedRent: createRentRequestDto.expectedRent,
          propertyType: createRentRequestDto.propertyType,
          fullName: createRentRequestDto.fullName,
          email: createRentRequestDto.email,
          phoneNumber: createRentRequestDto.phoneNumber,
          createdAt: new Date(),
          propertyId: createRentRequestDto.propertyId,
        },
        {
          fullName: user?.fullName || createRentRequestDto.fullName,
          email: user?.email || createRentRequestDto.email,
        },
      );
    } catch (error) {
      this.logger.error('Failed to send rent quote email to admin:', error);
      throw new InternalServerErrorException(
        'Failed to send your rent quote request. Please try again.',
      );
    }
  }
}
