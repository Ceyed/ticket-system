import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { SendMessageInTicketDto } from 'common/dtos/send-message-in-ticket.dto';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly _messageService: MessageService) {}

    handleConnection(client: Socket): void {
        this._messageService.handleConnection(client);
    }

    handleDisconnect(client: Socket): void {
        console.log(`Client disconnected: ${client.id}`);
    }

    @SubscribeMessage('sendMessage')
    handleSendMessage(client: Socket, sendMessageInTicketDto: SendMessageInTicketDto): void {
        this._messageService.sendMessage(client, sendMessageInTicketDto, this.server);
    }
}
