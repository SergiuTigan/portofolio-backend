// contact/contact.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    try {
      console.log('Saving contact to database...');
      const newContact = new this.contactModel(createContactDto);
      const savedContact = await newContact.save();

      console.log('Contact saved, attempting to send email...');
      try {
        await this.mailerService.sendContactEmail(createContactDto);
        console.log('Email sent successfully');
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Continue with the process even if email fails
      }

      return savedContact;
    } catch (error) {
      console.error('Error in contact creation:', error);
      throw new InternalServerErrorException(
        'Failed to process contact request',
      );
    }
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
