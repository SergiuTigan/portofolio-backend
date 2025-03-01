// contact/contact.controller.ts
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './schemas/contact.model';
import { MailerService } from './mailer.service';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly contactService: ContactService,
    private readonly mailerService: MailerService,
  ) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }

  @Get()
  async findAll() {
    return this.contactService.findAll();
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.contactService.markAsRead(id);
  }

  // contact/contact.controller.ts
  @Get('test-email')
  async testEmail() {
    try {
      await this.testEmailConnection();
      return { success: true, message: 'Email test successful' };
    } catch (error) {
      return {
        success: false,
        message: 'Email test failed',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      };
    }
  }

  // In contact.service.ts
  async testEmailConnection() {
    return this.mailerService.sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test email to verify the email configuration.',
    });
  }
}
