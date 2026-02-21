import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProfilesModule } from './profiles/profiles.module';
import { EngagementModule } from './engagement/engagement.module';
import { TitlesModule } from './titles/titles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProfilesModule,
    EngagementModule,
    TitlesModule,
  ],
})
export class AppModule {}
