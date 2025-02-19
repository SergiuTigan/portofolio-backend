import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema()
export class BlogPost {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
