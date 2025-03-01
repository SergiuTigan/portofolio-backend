import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [AppController],
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true, // Make config available throughout the app
      envFilePath: '.env', // Explicitly set the file path
    }),

    // Configure MongoDB connection using environment variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    JwtModule.register({
      secret: 'test123', // Use environment variables in production
      signOptions: { expiresIn: '24h' }, // Token expiration time
    }),
    BlogPostsModule,
    UsersModule,
  ],
  providers: [AppService],
})
export class AppModule {}
