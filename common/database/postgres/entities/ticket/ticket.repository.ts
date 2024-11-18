import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TicketEntity } from './ticket.entity';

@Injectable()
export class TicketRepository extends Repository<TicketEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(TicketEntity, _dataSource.createEntityManager());
    }
}
