import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { CreateTokenDto } from 'common/dtos/create-token.dto';
import { FindAllTicketsDto } from 'common/dtos/find-all-tickets.dto';
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
        const ticket: TicketEntity = await this._ticketRepository.findById(id);
        if (!ticket) throw new NotFoundException('Ticket Not Found');
        if (ticket.status === TicketStatusEnum.Closed)
            throw new BadRequestException('Ticket is already closed');

        const updateResult: UpdateResult = await this._ticketRepository.update(id, {
            status: TicketStatusEnum.Closed,
        });
        return { status: !!updateResult.affected };
    }

    getAllByAdmin(findAllTicketsDto: FindAllTicketsDto): Promise<TicketEntity[]> {
        return this._ticketRepository
            .createQueryBuilder('ticket')
            .where(findAllTicketsDto.searchTitle ? 'ticket.title ILIKE :searchTitle' : '1=1', {
                searchTitle: `%${findAllTicketsDto.searchTitle}%`,
            })
            .andWhere(findAllTicketsDto.userId ? 'ticket.userId = :userId' : '1=1', {
                userId: findAllTicketsDto.userId,
            })
            .andWhere(findAllTicketsDto.status ? 'ticket.status = :status' : '1=1', {
                status: findAllTicketsDto.status,
            })
            .getMany();
    }
}
