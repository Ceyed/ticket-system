import { Body, Post } from '@nestjs/common';
import { AppController } from 'common/decorators/app-controller.decorator';
import { User } from 'common/decorators/user-auth.decorator';
import { CreateTokenDto } from 'common/dtos/create-token.dto';
import { AppModulesEnum } from 'common/enums/app-modules.enum';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { ActiveUserDataInterface } from 'common/interface/active-user-data.interface';
import { TicketService } from './ticket.service';

@AppController(AppModulesEnum.TICKET, 'ticket', RouteTypeEnum.NORMAL)
export class TicketNormalController {
    constructor(private readonly _ticketService: TicketService) {}

    @Post('create')
    createTicket(@Body() createTokenDto: CreateTokenDto, @User() user: ActiveUserDataInterface) {
        return this._ticketService.createTicket(createTokenDto, user);
    }

    // @Get('open')
    // getOpenTickets() {
    //     return this._ticketService.getOpenTickets();
    // }
}
