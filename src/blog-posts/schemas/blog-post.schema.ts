import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema()
export class BlogPost {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ default: [] })
  comments: string[];

  @Prop({ default: [] })
  tags: string[];

  @Prop({ default: [] })
  images: string[];
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
