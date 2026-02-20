import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TmdbService } from '../titles/tmdb.service';
import { EngagementController } from './engagement.controller';
import { EngagementService } from './engagement.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [EngagementController],
  providers: [EngagementService, TmdbService],
})
export class EngagementModule {}
