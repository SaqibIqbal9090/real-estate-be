import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Send a contact form message',
    description: 'Submit a contact form message. The message will be sent to the admin email address. No data is stored in the database.',
  })
  @ApiBody({ 
    type: CreateContactDto,
    description: 'Contact form data',
    examples: {
      example1: {
        summary: 'Contact form submission',
        value: {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phoneNumber: '+1234567890',
          subject: 'General Inquiry',
          message: 'I would like to know more about your properties.',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 200,
    description: 'Contact form submitted successfully. Email sent to admin.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Contact form submitted successfully',
        },
      },
    },
  })
  @ApiResponse({ 
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({ 
    status: 500,
    description: 'Failed to send email',
  })
  async create(@Body() createContactDto: CreateContactDto) {
    await this.contactService.sendContactForm(createContactDto);
    return {
      message: 'Contact form submitted successfully',
    };
  }
}

