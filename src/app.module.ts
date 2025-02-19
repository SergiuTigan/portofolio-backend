import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/blog_db'),
    BlogPostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
