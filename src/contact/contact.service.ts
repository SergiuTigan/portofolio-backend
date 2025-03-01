// contact/contact.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contact } from './schemas/contact.schema';
import { CreateContactDto } from './schemas/contact.model';
import { MailerService } from './mailer.service';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(Contact.name) private contactModel: Model<Contact>,
    private readonly mailerService: MailerService,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    // 1. Save to database
    const newContact = new this.contactModel(createContactDto);
    const savedContact = await newContact.save();

    // 2. Send email notification
    await this.mailerService.sendContactEmail(createContactDto);

    return savedContact;
  }

  async findAll(): Promise<Contact[]> {
    return this.contactModel.find().sort({ createdAt: -1 }).exec();
  }

  async markAsRead(id: string): Promise<Contact> {
    return this.contactModel
      .findByIdAndUpdate(id, { isRead: true }, { new: true })
      .exec();
  }
}
