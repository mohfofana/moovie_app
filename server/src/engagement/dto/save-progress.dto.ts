import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class SaveProgressDto {
  @IsOptional()
  @IsString()
  titleId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  tmdbId?: number;

  @IsOptional()
  @IsIn(['movie', 'tv'])
  type?: 'movie' | 'tv';

  @Type(() => Number)
  @IsInt()
  @Min(0)
  progressSeconds!: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsString()
  seasonId?: string;

  @IsOptional()
  @IsString()
  episodeId?: string;
}
