import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { UserEntity } from 'common/database/postgres/entities/user/user.entity';

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(TicketEntity)
        private readonly ticketRepository: TicketRepository,
    ) {}

    createTicket(user: UserEntity, title: string) {
        const ticket = this.ticketRepository.create({ user, title });
        return this.ticketRepository.save(ticket);
    }

    getOpenTickets() {
        return this.ticketRepository.find({ where: { status: 'open' } });
    }
}
