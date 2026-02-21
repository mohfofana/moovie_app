import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.profile.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(userId: string, dto: CreateProfileDto) {
    const count = await this.prisma.profile.count({ where: { userId } });

    if (count >= 5) {
      throw new BadRequestException('A user can have at most 5 profiles');
    }

    return this.prisma.profile.create({
      data: {
        userId,
        name: dto.name,
        avatar: dto.avatar,
        language: dto.language ?? 'en',
        maturityLimit: dto.maturityLimit ?? 18,
        isKid: dto.isKid ?? false,
      },
    });
  }

  async update(userId: string, profileId: string, dto: UpdateProfileDto) {
    const existing = await this.prisma.profile.findFirst({
      where: { id: profileId, userId },
      select: { id: true },
    });

    if (!existing) {
      throw new NotFoundException('Profile not found');
    }

    return this.prisma.profile.update({
      where: { id: profileId },
      data: dto,
    });
  }

  async remove(userId: string, profileId: string) {
    const profiles = await this.prisma.profile.findMany({
      where: { userId },
      select: { id: true },
    });

    if (profiles.length <= 1) {
      throw new BadRequestException('Cannot delete the last profile');
    }

    const exists = profiles.some((p: { id: string }) => p.id === profileId);

    if (!exists) {
      throw new NotFoundException('Profile not found');
    }

    await this.prisma.profile.delete({ where: { id: profileId } });
    return { success: true };
  }
}
