import { Type } from 'class-transformer';
import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateInteractionDto {
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

  @IsOptional()
  @IsBoolean()
  liked?: boolean;

  @IsOptional()
  @IsBoolean()
  viewed?: boolean;
}
