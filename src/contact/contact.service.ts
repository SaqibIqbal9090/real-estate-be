import { Injectable } from '@nestjs/common';
import { EmailService } from '../auth/email.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly emailService: EmailService) {}

  async sendContactForm(createContactDto: CreateContactDto): Promise<void> {
    await this.emailService.sendContactFormEmail({
      fullName: createContactDto.fullName,
      email: createContactDto.email,
      phoneNumber: createContactDto.phoneNumber,
      subject: createContactDto.subject,
      message: createContactDto.message,
    });
  }
}

