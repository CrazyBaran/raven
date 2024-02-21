import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { ShortlistOrganisationEntity } from './entities/shortlist-organisation.entity';
import { ShortlistEntity } from './entities/shortlist.entity';
import { ShortlistsController } from './shortlists.controller';
import { ShortlistsService } from './shortlists.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShortlistEntity,
      ShortlistOrganisationEntity,
      OrganisationEntity,
    ]),
  ],
  controllers: [ShortlistsController],
  providers: [ShortlistsService],
  exports: [],
})
export class ShortlistsModule {}
