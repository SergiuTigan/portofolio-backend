import { Injectable } from '@nestjs/common';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import { UpdateBlogPostDto } from './schemas/blog-post.models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BlogPostsService {
  constructor(
    @InjectModel(BlogPost.name) private blogPostModel: Model<BlogPostDocument>,
  ) {}

  getPosts(): Promise<BlogPost[]> {
    return this.blogPostModel.find().exec();
  }

  getPost(id: string): string {
    return `One post with id: ${id}`;
  }

  createBlogPost(blogPost: BlogPost): string {
    return 'Created blog post with title: ' + blogPost.title;
  }

  updatePost(id: string, blogPost: UpdateBlogPostDto): string {
    return 'Updated post with id: ' + id + ' and title: ' + blogPost.title;
  }

  deletePost(id: string): string {
    return 'Delete post, id: ' + id;
  }
}
