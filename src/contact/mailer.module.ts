// mailer/mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerService } from './mailer.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: configService.get('MAIL_PORT'),
          secure: configService.get('MAIL_SECURE') === 'true', // true for 465, false for other ports
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASSWORD'),
          },
          tls: {
            // Do not fail on invalid certs
            rejectUnauthorized: false,
          },
        },
        defaults: {
          from: `"Contact Form" <${configService.get('MAIL_FROM')}>`,
        },
      }),
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class AppMailerModule {}
