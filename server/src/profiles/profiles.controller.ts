import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard, JwtUser } from '../common/jwt-auth.guard';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfilesService } from './profiles.service';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  list(@CurrentUser() user: JwtUser) {
    return this.profilesService.list(user.sub);
  }

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateProfileDto) {
    return this.profilesService.create(user.sub, dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtUser,
    @Param('id') profileId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.profilesService.update(user.sub, profileId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtUser, @Param('id') profileId: string) {
    return this.profilesService.remove(user.sub, profileId);
  }
}
