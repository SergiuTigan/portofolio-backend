import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { Users } from '../../users/schemas/user.schema';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema({ timestamps: true })
export class BlogPost {
  @Prop()
  _id: string;
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

  @Prop({ type: [String], default: [] })
  images: string[];

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

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  author: Users;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
