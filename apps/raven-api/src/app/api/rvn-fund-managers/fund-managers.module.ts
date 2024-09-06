import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataWarehouseModule } from '../rvn-data-warehouse/data-warehouse.module';
import { OrganisationEntity } from '../rvn-opportunities/entities/organisation.entity';
import { UsersModule } from '../rvn-users/users.module';
import { WebSocketsModule } from '../rvn-web-sockets/web-sockets.module';
import { FundManagerContactEntity } from './entities/fund-manager-contact.entity';
import { FundManagerIndustryEntity } from './entities/fund-manager-industry.entity';
import { FundManagerKeyRelationshipEntity } from './entities/fund-manager-key-relationship.entity';
import { FundManagerEntity } from './entities/fund-manager.entity';
import { FundManagersController } from './fund-managers.controller';
import { FundManagersService } from './fund-managers.service';

@Module({
  imports: [
    DataWarehouseModule.forRootAsync(),
    TypeOrmModule.forFeature([
      FundManagerEntity,
      OrganisationEntity,
      FundManagerKeyRelationshipEntity,
      FundManagerIndustryEntity,
      FundManagerContactEntity,
    ]),
    WebSocketsModule,
    UsersModule,
  ],
  controllers: [FundManagersController],
  providers: [FundManagersService],
  exports: [FundManagersService],
})
export class FundManagersModule {}
