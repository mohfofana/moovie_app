import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

export class SearchTitlesDto {
  @IsString()
  @MinLength(1)
  q!: string;

  @IsOptional()
  @IsIn(['movie', 'tv'])
  type?: 'movie' | 'tv';
}
