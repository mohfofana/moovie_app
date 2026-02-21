import { Controller, Get, Param, Query, Headers } from '@nestjs/common';

import { SearchTitlesDto } from './dto/search-titles.dto';
import { TrendingTitlesDto } from './dto/trending-titles.dto';
import { TitlesService } from './titles.service';

@Controller('titles')
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @Get('trending')
  trending(
    @Query() query: TrendingTitlesDto,
    @Headers('accept-language') language?: string,
  ) {
    return this.titlesService.getTrending(query.type ?? 'movie', language);
  }

  @Get('search')
  search(
    @Query() query: SearchTitlesDto,
    @Headers('accept-language') language?: string,
  ) {
    return this.titlesService.search(query.q, query.type, language);
  }

  @Get(':tmdbId/seasons')
  seasons(
    @Param('tmdbId') tmdbId: string,
    @Headers('accept-language') language?: string,
  ) {
    return this.titlesService.getTvSeasons(Number(tmdbId), language);
  }

  @Get(':tmdbId/seasons/:seasonNumber')
  seasonDetails(
    @Param('tmdbId') tmdbId: string,
    @Param('seasonNumber') seasonNumber: string,
    @Headers('accept-language') language?: string,
  ) {
    return this.titlesService.getTvSeasonDetails(Number(tmdbId), Number(seasonNumber), language);
  }

  @Get(':tmdbId')
  detail(
    @Param('tmdbId') tmdbId: string,
    @Query('type') type?: 'movie' | 'tv',
    @Headers('accept-language') language?: string,
  ) {
    return this.titlesService.getByTmdbId(Number(tmdbId), type ?? 'movie', language);
  }
}
