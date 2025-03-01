// mailer/mailer.service.ts
import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendContactEmail(contactData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) {
    const companyEmail = this.configService.get('COMPANY_EMAIL');

    return this.mailerService.sendMail({
      to: companyEmail,
      subject: `Contact Form: ${contactData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${contactData.message.replace(/\n/g, '<br>')}
        </div>
      `,
    });
  }
}
