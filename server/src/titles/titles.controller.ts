import { Controller, Get, Param, Query } from '@nestjs/common';

import { SearchTitlesDto } from './dto/search-titles.dto';
import { TrendingTitlesDto } from './dto/trending-titles.dto';
import { TitlesService } from './titles.service';

@Controller('titles')
export class TitlesController {
  constructor(private readonly titlesService: TitlesService) {}

  @Get('trending')
  trending(@Query() query: TrendingTitlesDto) {
    return this.titlesService.getTrending(query.type ?? 'movie');
  }

  @Get('search')
  search(@Query() query: SearchTitlesDto) {
    return this.titlesService.search(query.q, query.type);
  }

  @Get(':tmdbId')
  detail(@Param('tmdbId') tmdbId: string, @Query('type') type?: 'movie' | 'tv') {
    return this.titlesService.getByTmdbId(Number(tmdbId), type ?? 'movie');
  }
}
