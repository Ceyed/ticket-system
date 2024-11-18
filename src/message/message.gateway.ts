import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { MessageRepository } from 'common/database/postgres/entities/message/message.repository';
import { TicketEntity } from 'common/database/postgres/entities/ticket/ticket.entity';
import { TicketRepository } from 'common/database/postgres/entities/ticket/ticket.repository';
import { SendMessageInTicketDto } from 'common/dtos/send-message-in-ticket.dto';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/iam/authentication.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(
        private readonly _authenticationService: AuthenticationService,
        private readonly _ticketRepository: TicketRepository,
        private readonly _messageRepository: MessageRepository,
    ) {}

    async handleConnection(client: Socket) {
        try {
            const token = client.handshake.headers.authorization?.split(' ')[1];
            if (!token) throw new Error('Token not provided');
            const user = this._authenticationService.verifyToken(token);
            client.data.user = user;
            console.log(`User connected: ${user.username}`);
        } catch (error) {
            console.log(`Connection refused: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    async handleSendMessage(client: Socket, sendMessageInTicketDto: SendMessageInTicketDto) {
        try {
            const ticket: TicketEntity = await this._ticketRepository.findById(
                sendMessageInTicketDto.ticketId,
            );
            if (!ticket) {
                console.log('Invalid ticket id');
                client.send('Invalid ticket id');
                return;
            }

            const room = `ticket-${sendMessageInTicketDto.ticketId}`;
            client.join(room);
            await this._messageRepository.add(
                ticket.id,
                sendMessageInTicketDto.content,
                client.data.user.sub,
            );
            this.server.to(room).emit('message', {
                sender: client.data.user.username,
                content: sendMessageInTicketDto.content,
            });
            console.log(
                `Message sent by ${client.data.user.username} to room ${room}: ${sendMessageInTicketDto.content}`,
            );
        } catch (error) {
            console.log('Error in sending message');
            client.disconnect();
        }
    }
}
