// src/blog-posts/schemas/blog-post.model.ts
import { Schema as MongooseSchema } from 'mongoose';

export interface CreateBlogPostDto {
  title: string;
  content: string;
  description: string;
  category: string;
  createDate: string;
  coverImage: string;
  images: string[];
  imageDescriptions?: { [key: string]: string };
  tags: string[];
  likes: number;
  comments: string[];
  thumbnail: string;
  authorId?: string;
  author?: {
    _id: MongooseSchema.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

export interface UpdateBlogPostDto {
  title?: string;
  content?: string;
  description?: string;
  category?: string;
  createDate?: string;
  coverImage?: string;
  images?: string[];
  imageDescriptions?: { [key: string]: string };
  tags?: string[];
  likes?: number;
  comments?: string[];
  thumbnail?: string;
  authorId?: string;
  author?: {
    _id: MongooseSchema.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}
