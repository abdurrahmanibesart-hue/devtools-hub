import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AdminDoc, AdminDocument } from './schemas/admin.schema';
import { LoginDto } from './dto/login.dto';
import { SetupDto } from './dto/setup.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AdminDoc.name)
    private readonly adminModel: Model<AdminDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(dto: LoginDto): Promise<TokenResponseDto> {
    const admin = await this.adminModel.findOne({ email: dto.email }).exec();
    if (!admin) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    admin.lastLoginAt = new Date();
    await admin.save();

    return this.signTokens(admin._id.toString(), admin.email);
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.secret'),
      });
      if (payload.type !== 'refresh') throw new UnauthorizedException();

      const admin = await this.adminModel.findById(payload.sub).exec();
      if (!admin) throw new UnauthorizedException();

      const accessToken = this.jwtService.sign({
        sub: admin._id.toString(),
        email: admin.email,
      });
      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async setup(dto: SetupDto): Promise<{ message: string }> {
    const exists = (await this.adminModel.countDocuments()) > 0;
    if (exists) throw new ConflictException('Admin already exists');

    const bcryptRounds = this.configService.get<number>('bcryptRounds') ?? 12;
    const passwordHash = await bcrypt.hash(dto.password, bcryptRounds);
    await this.adminModel.create({ email: dto.email, passwordHash });

    return { message: 'admin created' };
  }

  private signTokens(adminId: string, email: string): TokenResponseDto {
    const secret = this.configService.get<string>('jwt.secret');

    const accessToken = this.jwtService.sign({ sub: adminId, email });
    const refreshToken = this.jwtService.sign(
      { sub: adminId, type: 'refresh' },
      {
        secret,
        expiresIn: this.configService.get<string>(
          'jwt.refreshExpiresIn',
        ) as any,
      },
    );

    return { accessToken, refreshToken };
  }
}
