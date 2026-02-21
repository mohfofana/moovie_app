import { IsString, MinLength } from 'class-validator';

export class SelectProfileDto {
  @IsString()
  @MinLength(1)
  profileId!: string;
}
