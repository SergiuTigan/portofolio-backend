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
}
