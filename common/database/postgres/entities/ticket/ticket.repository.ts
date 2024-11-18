import { Injectable } from '@nestjs/common';
import { TicketStatusEnum } from 'common/enums/ticket-status.enum';
import { uuid } from 'common/types/uuid.constant';
import { DataSource, Repository } from 'typeorm';
import { TicketEntity } from './ticket.entity';

@Injectable()
export class TicketRepository extends Repository<TicketEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(TicketEntity, _dataSource.createEntityManager());
    }

    findById(id: uuid): Promise<TicketEntity> {
        return this.findOne({
            where: { id },
            relations: { messages: true },
        });
    }

    async markAsInprogress(id: uuid): Promise<void> {
        this.update(id, { status: TicketStatusEnum.Inprogress });
    }
}
