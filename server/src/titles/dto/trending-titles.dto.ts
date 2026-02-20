import { IsIn, IsOptional } from 'class-validator';

export class TrendingTitlesDto {
  @IsOptional()
  @IsIn(['movie', 'tv'])
  type?: 'movie' | 'tv';
}
