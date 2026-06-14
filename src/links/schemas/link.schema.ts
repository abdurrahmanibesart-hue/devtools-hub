import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LinkCategory } from '../enums/link-category.enum';

export type LinkDocument = HydratedDocument<LinkDoc> & {
  createdAt: Date;
  updatedAt: Date;
};

@Schema({ collection: 'links', timestamps: true })
export class LinkDoc {
  @Prop({ required: true, maxlength: 80 }) title: string;
  @Prop({ required: true }) url: string;
  @Prop({ default: '' }) description: string;
  @Prop({ type: String, enum: LinkCategory, default: LinkCategory.Misc })
  category: LinkCategory;
  @Prop({ default: true }) isActive: boolean;
}

export const LinkSchema = SchemaFactory.createForClass(LinkDoc);
