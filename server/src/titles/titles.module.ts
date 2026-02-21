import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TmdbService } from './tmdb.service';
import { TitlesController } from './titles.controller';
import { TitlesService } from './titles.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [TitlesController],
  providers: [TitlesService, TmdbService],
})
export class TitlesModule {}
