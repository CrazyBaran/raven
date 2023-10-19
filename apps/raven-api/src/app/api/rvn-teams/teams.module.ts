import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './entities/team.entity';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity])],
  exports: [TeamsService],
  providers: [TeamsService],
  controllers: [TeamsController],
})
export class TeamsModule {}
