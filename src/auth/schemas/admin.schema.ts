import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ collection: 'admins', timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, index: true }) email: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ default: null }) lastLoginAt: Date | null;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
