import { Body, Post } from '@nestjs/common';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { AppController } from 'common/decorators/app-controller.decorator';
import { User } from 'common/decorators/user-auth.decorator';
import { CreateTokenDto } from 'common/dtos/create-token.dto';
import { RouteTypeEnum } from 'common/enums/route-type.enum';
import { ActiveUserDataInterface } from 'common/interface/active-user-data.interface';
import { TicketService } from './ticket.service';

@AppController('ticket', RouteTypeEnum.User)
export class TicketUserController {
    constructor(private readonly _ticketService: TicketService) {}

    @Post('create')
    createTicket(
        @Body() createTokenDto: CreateTokenDto,
        @User() user: ActiveUserDataInterface,
    ): Promise<TicketEntity> {
        return this._ticketService.createTicket(createTokenDto, user);
    }
}
