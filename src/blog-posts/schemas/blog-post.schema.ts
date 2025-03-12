// src/blog-posts/schemas/blog-post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import { Users } from '../../users/schemas/user.schema';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({ timestamps: true })
export class BlogPost {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: Date, default: Date.now })
  createDate: Date;

  @Prop({ required: true })
  coverImage: string;

  @Prop({
    type: [
      {
        url: { type: String, required: true },
        description: { type: String, default: '' },
      },
    ],
    default: [],
  })
  images: Array<{
    url: string;
    description: string;
  }>;

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  imageDescriptions: Record<string, string>;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [String], default: [] })
  comments: string[];

  @Prop({ required: true })
  thumbnail: string;

  // Store both the reference ID and the author details
  @Prop({ type: Types.ObjectId, ref: 'Users', required: true })
  authorId: string;

  // Store author details as an embedded document
  @Prop({
    type: {
      _id: { type: Types.ObjectId, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      avatar: { type: String },
      role: { type: String },
    },
    required: true,
  })
  author: {
    _id: MongooseSchema.Types.ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    role?: string;
  };
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
