import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL_DAYS = 30;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      select: { id: true },
    });

    if (existing) {
      throw new ConflictException('Email is already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        passwordHash,
        profiles: {
          create: {
            name: dto.profileName ?? 'Default',
          },
        },
      },
      include: { profiles: true },
    });

    const activeProfile = user.profiles[0];
    const tokens = await this.issueTokens(user.id, user.email, activeProfile?.id);

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      profiles: user.profiles,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { profiles: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.issueTokens(
      user.id,
      user.email,
      user.profiles[0]?.id,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      profiles: user.profiles,
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    const record = await this.findValidRefreshToken(refreshToken);
    if (!record) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: record.userId },
      include: { profiles: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    await this.prisma.refreshToken.update({
      where: { id: record.id },
      data: { revokedAt: new Date() },
    });

    const accessToken = this.signAccessToken(user.id, user.email, user.profiles[0]?.id);
    const newRefreshToken = await this.createRefreshToken(user.id);

    return { accessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const record = await this.findValidRefreshToken(refreshToken, false);

    if (record) {
      await this.prisma.refreshToken.update({
        where: { id: record.id },
        data: { revokedAt: new Date() },
      });
    }

    return { success: true };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        profiles: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    // Check if email is being changed and if it's already in use
    if (dto.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email.toLowerCase() },
        select: { id: true },
      });

      if (existing && existing.id !== userId) {
        throw new ConflictException('Email is already in use');
      }
    }

    const updateData: Prisma.UserUpdateInput = {};

    if (dto.email) {
      updateData.email = dto.email.toLowerCase();
    }

    if (dto.avatar !== undefined) {
      updateData.avatar = dto.avatar;
    }

    // Note: username field doesn't exist in User model, it's in Profile
    // If we want to update username, we should use the profiles endpoint

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        avatar: true,
        createdAt: true,
        profiles: true,
      },
    });

    return user;
  }

  async issueAccessTokenForProfile(userId: string, profileId: string) {
    const profile = await this.prisma.profile.findFirst({
      where: { id: profileId, userId },
      select: {
        id: true,
        user: { select: { email: true } },
      },
    });

    if (!profile) {
      return null;
    }

    return {
      accessToken: this.signAccessToken(userId, profile.user.email, profile.id),
    };
  }

  private signAccessToken(userId: string, email: string, profileId?: string) {
    return this.jwtService.sign(
      { sub: userId, email, profileId },
      {
        secret: this.configService.get<string>('JWT_SECRET', 'dev-secret'),
        expiresIn: ACCESS_TOKEN_TTL,
      },
    );
  }

  private async issueTokens(userId: string, email: string, profileId?: string) {
    const accessToken = this.signAccessToken(userId, email, profileId);
    const refreshToken = await this.createRefreshToken(userId);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async createRefreshToken(userId: string) {
    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
        expiresIn: `${REFRESH_TOKEN_TTL_DAYS}d`,
      },
    );

    const tokenHash = await bcrypt.hash(refreshToken, 10);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return refreshToken;
  }

  private async findValidRefreshToken(refreshToken: string, throwOnMissing = true) {
    let payload: { sub: string };

    try {
      payload = this.jwtService.verify<{ sub: string }>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const candidates = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    for (const candidate of candidates) {
      const isMatch = await bcrypt.compare(refreshToken, candidate.tokenHash);
      if (isMatch) {
        return candidate;
      }
    }

    if (throwOnMissing) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return null;
  }
}
