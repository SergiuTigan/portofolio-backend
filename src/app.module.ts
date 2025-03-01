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
    MongooseModule.forRoot('mongodb://localhost:27017/blog_db'),
    ConfigModule.forRoot({
      isGlobal: true, // Make config available throughout the app
      envFilePath: '.env', // Explicitly set the file path
    }),
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
