import { Body, Get, Put } from '@nestjs/common';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { AppController } from 'common/decorators/app-controller.decorator';
import { CloseTicketDto } from 'common/dtos/close-ticket.dto';
import { UpdateResultDto } from 'common/dtos/update-result.dto';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { TicketService } from './ticket.service';

@AppController('ticket', RouteTypeEnum.Employee)
export class TicketEmployeeController {
    constructor(private readonly _ticketService: TicketService) {}

    @Get('open-tickets')
    getOpenTickets(): Promise<TicketEntity[]> {
        return this._ticketService.getOpenTickets();
    }

    @Put('close')
    closeTicket(@Body() closeTicketDto: CloseTicketDto): Promise<UpdateResultDto> {
        return this._ticketService.close(closeTicketDto.id);
    }
}
