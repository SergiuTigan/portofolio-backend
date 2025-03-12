import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Users>;

@Schema()
export class Users {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'Reader' })
  role: string;

  @Prop()
  avatar?: string;

  @Prop()
  bio?: string;

  @Prop({ default: Date.now })
  createdAt: number;
}

export const UsersSchema = SchemaFactory.createForClass(Users);
