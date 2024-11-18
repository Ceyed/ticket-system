import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { AccessTokenGuard } from 'common/guards/access-token.guard';
import { jwtConfig } from 'src/app/config/jwt.config';
import { TicketAdminController } from './ticket.admin.controller';
import { TicketEmployeeController } from './ticket.employee.controller';
import { TicketService } from './ticket.service';
import { TicketUserController } from './ticket.user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([TicketEntity]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
    ],
    controllers: [TicketUserController, TicketEmployeeController, TicketAdminController],
    providers: [TicketService, TicketRepository, AccessTokenGuard],
    exports: [TicketRepository],
})
export class TicketModule {}
