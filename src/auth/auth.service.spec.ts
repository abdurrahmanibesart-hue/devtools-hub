import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { AdminDoc } from './schemas/admin.schema';

const mockAdminModel = {
  findOne: jest.fn(),
  countDocuments: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
};
const mockJwtService = { sign: jest.fn(), verify: jest.fn() };
const mockConfigService = { get: jest.fn() };

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(AdminDoc.name), useValue: mockAdminModel },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
    mockConfigService.get.mockReturnValue('test-secret');
  });

  describe('login', () => {
    it('throws UnauthorizedException if admin not found', async () => {
      mockAdminModel.findOne.mockReturnValue({
        exec: () => Promise.resolve(null),
      });
      await expect(
        service.login({ email: 'x@x.com', password: 'wrongpass1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException if password mismatch', async () => {
      const hash = await bcrypt.hash('correct', 10);
      mockAdminModel.findOne.mockReturnValue({
        exec: () =>
          Promise.resolve({
            _id: { toString: () => '1' },
            email: 'a@a.com',
            passwordHash: hash,
            lastLoginAt: null,
            save: jest.fn().mockResolvedValue(undefined),
          }),
      });
      await expect(
        service.login({ email: 'a@a.com', password: 'wrongpass1' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('returns tokens on successful login', async () => {
      const hash = await bcrypt.hash('Admin123!', 10);
      mockAdminModel.findOne.mockReturnValue({
        exec: () =>
          Promise.resolve({
            _id: { toString: () => '1' },
            email: 'a@a.com',
            passwordHash: hash,
            lastLoginAt: null,
            save: jest.fn().mockResolvedValue(undefined),
          }),
      });
      mockJwtService.sign.mockReturnValue('signed-token');
      const result = await service.login({
        email: 'a@a.com',
        password: 'Admin123!',
      });
      expect(result.accessToken).toBe('signed-token');
      expect(result.refreshToken).toBe('signed-token');
    });

    it('sets lastLoginAt after successful login', async () => {
      const hash = await bcrypt.hash('Admin123!', 10);
      const saveMock = jest.fn().mockResolvedValue(undefined);
      const doc = {
        _id: { toString: () => '1' },
        email: 'a@a.com',
        passwordHash: hash,
        lastLoginAt: null as Date | null,
        save: saveMock,
      };
      mockAdminModel.findOne.mockReturnValue({
        exec: () => Promise.resolve(doc),
      });
      mockJwtService.sign.mockReturnValue('tok');
      await service.login({ email: 'a@a.com', password: 'Admin123!' });
      expect(saveMock).toHaveBeenCalled();
      expect(doc.lastLoginAt).toBeInstanceOf(Date);
    });
  });
});
