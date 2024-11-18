import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { MessageEntity } from './message.entity';

@Injectable()
export class MessageRepository extends Repository<MessageEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(MessageEntity, _dataSource.createEntityManager());
    }
}
