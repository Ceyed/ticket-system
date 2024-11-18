import { Body, Get, Post } from '@nestjs/common';
import { AppController } from 'common/decorators/app-controller.decorator';
import { AppModulesEnum } from 'common/enums/app-modules.enum';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { TicketService } from './ticket.service';

@AppController(AppModulesEnum.TICKET, 'ticket', RouteTypeEnum.NORMAL)
export class TicketNormalController {
    constructor(private readonly _ticketService: TicketService) {}

    @Post('create')
    createTicket(@Body('title') title: string, @Body('userId') userId: number) {
        return this._ticketService.createTicket({ id: userId } as any, title);
    }

    @Get('open')
    getOpenTickets() {
        return this._ticketService.getOpenTickets();
    }
}
