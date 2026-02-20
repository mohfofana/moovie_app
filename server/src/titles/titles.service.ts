import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { TmdbService, TmdbTitle } from './tmdb.service';

@Injectable()
export class TitlesService {
  constructor(
    private readonly tmdb: TmdbService,
    private readonly prisma: PrismaService,
  ) {}

  async getTrending(type: 'movie' | 'tv') {
    const data = await this.tmdb.getTrending(type);
    await this.persistTitles(data.results);
    return data;
  }

  async search(query: string, type?: 'movie' | 'tv') {
    const data = await this.tmdb.search(query, type);
    await this.persistTitles(data.results);
    return data;
  }

  async getByTmdbId(tmdbId: number, type: 'movie' | 'tv') {
    const details = await this.tmdb.getDetails(tmdbId, type);
    await this.persistTitles([
      {
        id: details.id,
        title: details.title,
        overview: details.overview,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        release_date: details.release_date,
        popularity: details.popularity,
        media_type: type,
      },
    ]);

    return details;
  }

  private async persistTitles(items: TmdbTitle[]) {
    if (!items.length) {
      return;
    }

    for (const item of items) {
      if (!item.id || !item.media_type) {
        continue;
      }

      await this.prisma.title.upsert({
        where: {
          tmdbId_type: {
            tmdbId: item.id,
            type: item.media_type,
          },
        },
        update: {
          title: item.title,
          synopsis: item.overview,
          poster: item.poster_path,
          backdrop: item.backdrop_path,
          releaseDate: item.release_date ? new Date(item.release_date) : null,
          popularity: item.popularity,
          metadataJson: item,
        },
        create: {
          tmdbId: item.id,
          type: item.media_type,
          title: item.title,
          synopsis: item.overview,
          poster: item.poster_path,
          backdrop: item.backdrop_path,
          releaseDate: item.release_date ? new Date(item.release_date) : null,
          popularity: item.popularity,
          metadataJson: item,
        },
      });
    }
  }
}
