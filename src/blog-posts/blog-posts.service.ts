import { Injectable } from '@nestjs/common';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
import {
  CreateBlogPostDto,
  UpdateBlogPostDto,
} from './schemas/blog-post.model';
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

  getPost(id: string): Promise<BlogPost> {
    return this.blogPostModel.findOne({ _id: id }).exec();
  }

  createBlogPost(blogPost: CreateBlogPostDto): Promise<BlogPost> {
    const newBlogPost = new this.blogPostModel(blogPost);
    return newBlogPost.save();
  }

  updatePost(id: string, blogPost: UpdateBlogPostDto): Promise<BlogPost> {
    return this.blogPostModel
      .findByIdAndUpdate(id, blogPost, { new: true })
      .exec();
  }

  deletePost(id: string): string {
    this.blogPostModel.deleteOne({ _id: id }).exec().then();
    return `Post with id: ${id} was deleted`;
  }
}
