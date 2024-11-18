import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageRepository } from 'common/database/postgres/entities/message/message.repository';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { AccessTokenGuard } from 'common/guards/access-token.guard';
import { jwtConfig } from 'src/app/config/jwt.config';
import { MessageModule } from 'src/message/message.module';
import { TicketNormalController } from './ticket.normal.controller';
import { TicketService } from './ticket.service';

@Module({
    imports: [
        MessageModule,
        TypeOrmModule.forFeature([TicketEntity, MessageRepository]),
        JwtModule.registerAsync(jwtConfig.asProvider()),
        ConfigModule.forFeature(jwtConfig),
    ],
    controllers: [TicketNormalController],
    providers: [TicketService, TicketRepository, MessageRepository, AccessTokenGuard],
})
export class TicketModule {}
