import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard, JwtUser } from '../common/jwt-auth.guard';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { GetRecommendationsDto } from './dto/get-recommendations.dto';
import { SaveProgressDto } from './dto/save-progress.dto';
import { EngagementService } from './engagement.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Get('my-list')
  getMyList(@CurrentUser() user: JwtUser) {
    return this.engagementService.getMyList(user);
  }

  @Post('my-list/:titleId')
  addToMyList(
    @CurrentUser() user: JwtUser,
    @Param('titleId') titleId: string,
    @Query('type') type?: 'movie' | 'tv',
  ) {
    return this.engagementService.addToMyList(user, titleId, type);
  }

  @Delete('my-list/:titleId')
  removeFromMyList(@CurrentUser() user: JwtUser, @Param('titleId') titleId: string) {
    return this.engagementService.removeFromMyList(user, titleId);
  }

  @Get('watch/continue')
  getContinueWatching(@CurrentUser() user: JwtUser) {
    return this.engagementService.getContinueWatching(user);
  }

  @Get('recommendations')
  getRecommendations(@CurrentUser() user: JwtUser, @Query() query: GetRecommendationsDto) {
    return this.engagementService.getRecommendations(user, query);
  }

  @Post('watch/progress')
  saveProgress(@CurrentUser() user: JwtUser, @Body() dto: SaveProgressDto) {
    return this.engagementService.saveProgress(user, dto);
  }

  @Post('interactions')
  createInteraction(@CurrentUser() user: JwtUser, @Body() dto: CreateInteractionDto) {
    if (dto.liked === undefined && !dto.viewed) {
      throw new BadRequestException('Either liked or viewed must be provided');
    }

    return this.engagementService.createInteraction(user, dto);
  }
}
