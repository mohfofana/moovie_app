import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Profile, Title } from '@prisma/client';

import { JwtUser } from '../common/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { TmdbService } from '../titles/tmdb.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { SaveProgressDto } from './dto/save-progress.dto';

@Injectable()
export class EngagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tmdbService: TmdbService,
  ) {}

  async getMyList(user: JwtUser) {
    const profile = await this.requireActiveProfile(user);

    return this.prisma.myList.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
      include: { title: true },
    });
  }

  async addToMyList(user: JwtUser, titleRef: string, type?: 'movie' | 'tv') {
    const profile = await this.requireActiveProfile(user);
    const title = await this.resolveTitle(titleRef, type);

    const existing = await this.prisma.myList.findUnique({
      where: {
        profileId_titleId: {
          profileId: profile.id,
          titleId: title.id,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.myList.create({
      data: {
        profileId: profile.id,
        titleId: title.id,
      },
      include: {
        title: true,
      },
    });
  }

  async removeFromMyList(user: JwtUser, titleRef: string) {
    const profile = await this.requireActiveProfile(user);
    const title = await this.resolveTitle(titleRef);

    await this.prisma.myList.deleteMany({
      where: {
        profileId: profile.id,
        titleId: title.id,
      },
    });

    return { success: true };
  }

  async getContinueWatching(user: JwtUser) {
    const profile = await this.requireActiveProfile(user);

    return this.prisma.watchHistory.findMany({
      where: {
        profileId: profile.id,
        completed: false,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 30,
      include: {
        title: true,
        season: true,
        episode: true,
      },
    });
  }

  async saveProgress(user: JwtUser, dto: SaveProgressDto) {
    const profile = await this.requireActiveProfile(user);
    const title = await this.resolveTitle(dto.titleId ?? String(dto.tmdbId), dto.type);

    const where: Prisma.WatchHistoryWhereInput = {
      profileId: profile.id,
      titleId: title.id,
      seasonId: dto.seasonId ?? null,
      episodeId: dto.episodeId ?? null,
    };

    const existing = await this.prisma.watchHistory.findFirst({ where });

    if (existing) {
      return this.prisma.watchHistory.update({
        where: { id: existing.id },
        data: {
          progressSeconds: dto.progressSeconds,
          completed: dto.completed ?? false,
          seasonId: dto.seasonId,
          episodeId: dto.episodeId,
        },
      });
    }

    return this.prisma.watchHistory.create({
      data: {
        profileId: profile.id,
        titleId: title.id,
        progressSeconds: dto.progressSeconds,
        completed: dto.completed ?? false,
        seasonId: dto.seasonId,
        episodeId: dto.episodeId,
      },
    });
  }

  async createInteraction(user: JwtUser, dto: CreateInteractionDto) {
    const profile = await this.requireActiveProfile(user);
    const title = await this.resolveTitle(dto.titleId ?? String(dto.tmdbId), dto.type);

    const existing = await this.prisma.interaction.findFirst({
      where: {
        profileId: profile.id,
        titleId: title.id,
      },
      orderBy: { id: 'desc' },
    });

    if (existing) {
      return this.prisma.interaction.update({
        where: { id: existing.id },
        data: {
          liked: dto.liked,
          viewedAt: dto.viewed ? new Date() : existing.viewedAt,
        },
      });
    }

    return this.prisma.interaction.create({
      data: {
        profileId: profile.id,
        titleId: title.id,
        liked: dto.liked,
        viewedAt: dto.viewed ? new Date() : null,
      },
    });
  }

  private async requireActiveProfile(user: JwtUser): Promise<Profile> {
    if (!user.profileId) {
      throw new BadRequestException('No active profile in access token. Use /auth/select-profile first.');
    }

    const profile = await this.prisma.profile.findFirst({
      where: {
        id: user.profileId,
        userId: user.sub,
      },
    });

    if (!profile) {
      throw new NotFoundException('Active profile not found');
    }

    return profile;
  }

  private async resolveTitle(titleRef: string, type?: 'movie' | 'tv'): Promise<Title> {
    if (!titleRef) {
      throw new BadRequestException('titleId or tmdbId is required');
    }

    const numeric = Number(titleRef);
    const isNumeric = Number.isInteger(numeric);

    if (isNumeric) {
      const titleType = type ?? 'movie';
      const existing = await this.prisma.title.findUnique({
        where: {
          tmdbId_type: {
            tmdbId: numeric,
            type: titleType,
          },
        },
      });

      if (existing) {
        return existing;
      }

      const details = await this.tmdbService.getDetails(numeric, titleType);

      return this.prisma.title.create({
        data: {
          tmdbId: details.id,
          type: titleType,
          title: details.title || details.name,
          synopsis: details.overview,
          poster: details.poster_path,
          backdrop: details.backdrop_path,
          releaseDate: details.release_date ? new Date(details.release_date) : null,
          popularity: details.popularity,
          metadataJson: details,
        },
      });
    }

    const byInternalId = await this.prisma.title.findUnique({ where: { id: titleRef } });
    if (!byInternalId) {
      throw new NotFoundException('Title not found');
    }

    return byInternalId;
  }
}
