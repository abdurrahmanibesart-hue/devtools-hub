import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { LinksService } from './links.service';
import { LinkDoc } from './schemas/link.schema';

const mockLinkModel = {
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
};

describe('LinksService', () => {
  let service: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        {
          provide: getModelToken(LinkDoc.name),
          useValue: mockLinkModel,
        },
      ],
    }).compile();
    service = module.get<LinksService>(LinksService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('returns mapped links sorted by order', async () => {
      const now = new Date();
      mockLinkModel.find.mockReturnValue({
        sort: () => ({
          exec: () =>
            Promise.resolve([
              {
                _id: { toString: () => 'mock-id' },
                title: 'Grafana',
                url: 'https://grafana.example.com',
                description: '',
                category: 'Monitoring',
                isActive: true,
                createdAt: now,
                updatedAt: now,
              },
            ]),
        }),
      });
      const result = await service.findAll(true);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Grafana');
      expect(result[0].id).toBe('mock-id');
    });
  });

  describe('create', () => {
    it('creates a link with defaults', async () => {
      const now = new Date();
      mockLinkModel.create.mockResolvedValue({
        _id: { toString: () => 'mock-id' },
        title: 'Jenkins',
        url: 'https://jenkins.example.com',
        description: '',
        category: 'General',
        order: 0,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      });
      const result = await service.create({
        title: 'Jenkins',
        url: 'https://jenkins.example.com',
      });
      expect(result.category).toBe('General');
    });
  });

  describe('remove', () => {
    it('throws NotFoundException if link does not exist', async () => {
      mockLinkModel.findByIdAndDelete.mockReturnValue({
        exec: () => Promise.resolve(null),
      });
      await expect(service.remove('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
