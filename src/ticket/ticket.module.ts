import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { AccessTokenGuard } from 'common/guards/access-token.guard';
import { jwtConfig } from 'src/app/config/jwt.config';
import { TicketNormalController } from './ticket.normal.controller';
import { TicketService } from './ticket.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([TicketEntity]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
    ],
    controllers: [TicketNormalController],
    providers: [TicketService, TicketRepository, AccessTokenGuard],
    exports: [TicketRepository],
})
export class TicketModule {}
