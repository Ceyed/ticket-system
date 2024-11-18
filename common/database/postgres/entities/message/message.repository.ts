import { Injectable } from '@nestjs/common';
import { uuid } from 'common/types/uuid.constant';
import { DataSource, Repository } from 'typeorm';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(MessageEntity, _dataSource.createEntityManager());
    }

    add(ticketId: uuid, content: string, senderId: uuid): Promise<MessageEntity> {
        return this.save({
            ticketId,
            senderId,
            content,
        });
    }
}
