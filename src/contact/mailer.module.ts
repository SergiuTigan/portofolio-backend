// mailer/mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'mail.privateemail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'sergiu@tigan.dev',
          pass: 'marian93A@', // Replace with your real password
        },
        tls: {
          rejectUnauthorized: false,
        },
      },
      defaults: {
        from: '"Contact Form" <sergiu@tigan.dev>',
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class AppMailerModule {}
