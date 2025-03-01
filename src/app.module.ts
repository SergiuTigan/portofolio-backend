import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make config available throughout the app
      envFilePath: '.env', // Explicitly set the file path
    }),
    MongooseModule.forRoot('mongodb://147.93.55.240:27017/blog_db'),
    JwtModule.register({
      secret: 'test123', // Use environment variables in production
      signOptions: { expiresIn: '24h' }, // Token expiration time
    }),
    BlogPostsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
