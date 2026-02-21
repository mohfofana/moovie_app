import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '../common/current-user.decorator';
import { JwtAuthGuard, JwtUser } from '../common/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { RegisterDto } from './dto/register.dto';
import { SelectProfileDto } from './dto/select-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  logout(@Body() dto: RefreshDto) {
    return this.authService.logout(dto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: JwtUser) {
    return this.authService.getMe(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('select-profile')
  async selectProfile(
    @CurrentUser() user: JwtUser,
    @Body() dto: SelectProfileDto,
  ) {
    const token = await this.authService.issueAccessTokenForProfile(
      user.sub,
      dto.profileId,
    );

    if (!token) {
      throw new UnauthorizedException('Profile is not owned by current user');
    }

    return token;
  }
}
