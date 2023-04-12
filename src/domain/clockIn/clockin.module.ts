import { Module } from '@nestjs/common';
import { ClockInService } from './clockIn.service';
import { ClockinController } from './clockin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Moment, RelatoryEntity, User } from '@/shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Moment, User, RelatoryEntity])],
  controllers: [ClockinController],
  providers: [ClockInService],
  exports: [ClockInService],
})
export class ClockInModule {}
