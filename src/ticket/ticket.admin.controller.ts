import { Get, Query } from '@nestjs/common';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { AppController } from 'common/decorators/app-controller.decorator';
import { FindAllTicketsDto } from 'common/dtos/find-all-tickets.dto';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { TicketService } from './ticket.service';

@AppController('ticket', RouteTypeEnum.Admin)
export class TicketAdminController {
    constructor(private readonly _ticketService: TicketService) {}

    @Get('tickets')
    getTickets(@Query() findAllTicketsDto: FindAllTicketsDto): Promise<TicketEntity[]> {
        return this._ticketService.getAllByAdmin(findAllTicketsDto);
    }
}
