import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { toJsonTransform } from '../../database/schema.utils';

export type AdminDocument = HydratedDocument<AdminDoc> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({
  timestamps: true,
  toJSON: {
    transform: (_doc: unknown, ret: Record<string, any>) => {
      toJsonTransform(_doc, ret);
      delete ret.passwordHash;
      return ret;
    },
  },
})
export class AdminDoc {
  @Prop({ required: true, unique: true, index: true }) email: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ default: null }) lastLoginAt: Date | null;
}

export const AdminSchema = SchemaFactory.createForClass(AdminDoc);
