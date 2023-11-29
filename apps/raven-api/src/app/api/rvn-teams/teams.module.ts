import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';
import { TeamsService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity])],
  exports: [TeamsService],
  providers: [TeamsService],
  controllers: [],
})
export class TeamsModule {}
