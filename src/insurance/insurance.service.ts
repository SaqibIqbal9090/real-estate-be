import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InsuranceRequest } from './insurance-request.model';
import { CreateInsuranceRequestDto } from './dto/create-insurance-request.dto';
import { EmailService } from '../auth/email.service';

@Injectable()
export class InsuranceService {
  private readonly logger = new Logger(InsuranceService.name);

  constructor(
    @InjectModel(InsuranceRequest)
    private insuranceRequestModel: typeof InsuranceRequest,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateInsuranceRequestDto): Promise<InsuranceRequest> {
    const insuranceRequest = await this.insuranceRequestModel.create({
      type: dto.type,
      fullName: dto.fullName,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      details: dto.details ?? {},
      status: 'new',
    } as any);

    // Fire-and-forget notifications so email latency never blocks the response.
    this.sendNotifications(insuranceRequest).catch((error) => {
      this.logger.error('Failed to send insurance notifications:', error);
    });

    return insuranceRequest;
  }

  async findAll(type?: 'home' | 'auto'): Promise<InsuranceRequest[]> {
    const where = type ? { where: { type } } : {};
    return this.insuranceRequestModel.findAll({
      ...where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string): Promise<InsuranceRequest | null> {
    return this.insuranceRequestModel.findByPk(id);
  }

  private async sendNotifications(insuranceRequest: InsuranceRequest): Promise<void> {
    const data = insuranceRequest.get({ plain: true });

    await Promise.allSettled([
      this.emailService.sendInsuranceRequestToAdmin({
        id: data.id,
        type: data.type,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        details: data.details,
        createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      }),
      this.emailService.sendInsuranceConfirmationToUser({
        type: data.type,
        fullName: data.fullName,
        email: data.email,
      }),
    ]);
  }
}
