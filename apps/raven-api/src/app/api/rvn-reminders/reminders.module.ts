import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComplexTagEntity } from '../rvn-tags/entities/complex-tag.entity';
import { UserEntity } from '../rvn-users/entities/user.entity';
import { WebSocketsModule } from '../rvn-web-sockets/web-sockets.module';
import { ReminderAssigneeEntity } from './entities/reminder-assignee.entity';
import { ReminderEntity } from './entities/reminder.entity';
import { RemindersController } from './reminders.controller';
import { RemindersService } from './reminders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReminderEntity,
      ReminderAssigneeEntity,
      UserEntity,
      ComplexTagEntity,
    ]),
    WebSocketsModule,
  ],
  controllers: [RemindersController],
  providers: [RemindersService],
  exports: [RemindersService],
})
export class RemindersModule {}
