import { Injectable } from '@nestjs/common';
import { MessageRepository } from 'common/database/postgres/entities/message/message.repository';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { SendMessageInTicketDto } from 'common/dtos/send-message-in-ticket.dto';
import { UserRoleEnum } from 'common/enums/role.enum';
import { TicketStatusEnum } from 'common/enums/ticket-status.enum';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/iam/authentication.service';

@Injectable()
export class MessageService {
    constructor(
        private readonly _authenticationService: AuthenticationService,
        private readonly _ticketRepository: TicketRepository,
        private readonly _messageRepository: MessageRepository,
    ) {}

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.headers.authorization?.split(' ')[1];
            if (!token) {
                client.emit('error', 'Token not provided');
                throw new Error('Token not provided');
            }
            const user = this._authenticationService.verifyToken(token);
            client.data.user = user;
            console.log(`User connected: ${user.username}`);
        } catch (error) {
            console.log(`Connection refused: ${error.message}`);
            client.disconnect();
        }
    }

    async sendMessage(
        client: Socket,
        sendMessageInTicketDto: SendMessageInTicketDto,
        server: Server,
    ): Promise<void> {
        try {
            const ticket: TicketEntity = await this._ticketRepository.findById(
                sendMessageInTicketDto.ticketId,
            );
            if (
                !ticket ||
                (client.data.user.role === UserRoleEnum.User &&
                    client.data.user.sub !== ticket.userId)
            ) {
                client.emit('error', 'Invalid ticket id');
                return;
            }
            if (ticket.status === TicketStatusEnum.Closed) {
                client.emit('error', 'Ticket is closed');
                return;
            }

            const room = `ticket-${sendMessageInTicketDto.ticketId}`;
            client.join(room);
            server.to(room).emit('message', {
                sender: client.data.user.username,
                content: sendMessageInTicketDto.content,
            });
            await this._messageRepository.add(
                ticket.id,
                sendMessageInTicketDto.content,
                client.data.user.sub,
            );
            if (ticket.messages.length) {
                await this._ticketRepository.markAsInprogress(ticket.id);
            }
        } catch (error) {
            console.error('Error in sending message: ', error);
            client.disconnect();
        }
    }
}
