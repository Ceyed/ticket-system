import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'common/database/postgres/entities/message/message.entity';
import { MessageRepository } from 'common/database/postgres/entities/message/message.repository';
import { IamModule } from 'src/iam/iam.module';
import { TicketModule } from 'src/ticket/ticket.module';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
    imports: [IamModule, TicketModule, TypeOrmModule.forFeature([MessageEntity])],
    providers: [MessageGateway, MessageService, MessageRepository],
    exports: [MessageGateway],
})
export class MessageModule {}
