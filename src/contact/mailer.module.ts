// mailer/mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from './mailer.service';
import { environment } from '../../.env.local';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: environment.MAIL_HOST,
        port: environment.MAIL_PORT,
        secure: environment.MAIL_SECURE === 'true',
        auth: {
          user: environment.MAIL_USER,
          pass: environment.MAIL_PASSWORD,
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
