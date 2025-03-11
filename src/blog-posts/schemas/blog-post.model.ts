// Original BlogPost DTOs

import { Users } from '../../users/schemas/user.schema';

// Adapted Article interfaces
export interface BlogPost {
  _id?: number;
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
  author: Users;
}

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
  author?: Users;
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
  author?: Users;
}
