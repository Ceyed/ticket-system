import { Injectable } from '@nestjs/common';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { CreateTokenDto } from 'common/dtos/create-token.dto';
import { UpdateResultDto } from 'common/dtos/update-result.dto';
import { TicketStatusEnum } from 'common/enums/ticket-status.enum';
import { ActiveUserDataInterface } from 'common/interface/active-user-data.interface';
import { uuid } from 'common/types/uuid.constant';
import { UpdateResult } from 'typeorm';

@Injectable()
export class TicketService {
    constructor(private readonly _ticketRepository: TicketRepository) {}

    async createTicket(
        createTokenDto: CreateTokenDto,
        user: ActiveUserDataInterface,
    ): Promise<TicketEntity> {
        return this._ticketRepository.save({
            title: createTokenDto.title,
            userId: user.sub,
        });
    }

    getOpenTickets(): Promise<TicketEntity[]> {
        return this._ticketRepository.find({ where: { status: TicketStatusEnum.Open } });
    }

    async close(id: uuid): Promise<UpdateResultDto> {
        const updateResult: UpdateResult = await this._ticketRepository.update(id, {
            status: TicketStatusEnum.Closed,
        });
        return { status: !!updateResult.affected };
    }
}
