// contact/contact.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { AppMailerModule } from './mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    AppMailerModule,
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
