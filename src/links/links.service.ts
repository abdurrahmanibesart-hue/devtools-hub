import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { Link } from './entities/link.entity';
import { LinkDoc, LinkDocument } from './schemas/link.schema';

@Injectable()
export class LinksService {
  constructor(
    @InjectModel(LinkDoc.name) private readonly linkModel: Model<LinkDocument>,
  ) {}

  async findAll(onlyActive = false): Promise<Link[]> {
    const filter = onlyActive ? { isActive: true } : {};
    const docs = await this.linkModel
      .find(filter)
      .sort({ createdAt: 1 })
      .exec();
    return docs.map((d) => this.toLink(d));
  }

  async findById(id: string): Promise<Link | null> {
    if (!isValidObjectId(id)) return null;
    const doc = await this.linkModel.findById(id).exec();
    return doc ? this.toLink(doc) : null;
  }

  async create(dto: CreateLinkDto): Promise<Link> {
    const doc = await this.linkModel.create({
      title: dto.title,
      url: dto.url,
      description: dto.description ?? '',
      category: dto.category ?? 'General',
      isActive: dto.isActive ?? true,
    });
    return this.toLink(doc);
  }

  async update(id: string, dto: UpdateLinkDto): Promise<Link> {
    const doc = await this.linkModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!doc) throw new NotFoundException(`Link ${id} not found`);
    return this.toLink(doc);
  }

  async remove(id: string): Promise<void> {
    const result = await this.linkModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Link ${id} not found`);
  }

  private toLink(doc: LinkDocument): Link {
    return {
      id: doc._id.toString(),
      title: doc.title,
      url: doc.url,
      description: doc.description,
      category: doc.category,
      isActive: doc.isActive,
      createdAt: doc.createdAt.toISOString(),
      updatedAt: doc.updatedAt.toISOString(),
    };
  }
}
