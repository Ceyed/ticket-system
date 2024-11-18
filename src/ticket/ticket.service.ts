import { Injectable } from '@nestjs/common';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { CreateTokenDto } from 'common/dtos/create-token.dto';
import { ActiveUserDataInterface } from 'common/interface/active-user-data.interface';

@Injectable()
export class TicketService {
    constructor(private readonly _ticketRepository: TicketRepository) {}

    async createTicket(createTokenDto: CreateTokenDto, user: ActiveUserDataInterface) {
        return this._ticketRepository.save({
            title: createTokenDto.title,
            userId: user.sub,
        });
    }

    // getOpenTickets() {
    //     return this.ticketRepository.find({ where: { status: 'open' } });
    // }
}
