import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthenticationService } from 'src/iam/authentication.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;

    constructor(private readonly _authenticationService: AuthenticationService) {}

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
    handleSendMessage(client: Socket, data: { ticketId: number; content: string }) {
        const room = `ticket-${data.ticketId}`;
        client.join(room);
        this.server.to(room).emit('message', {
            sender: client.data.user.username,
            content: data.content,
        });
        console.log(
            `Message sent by ${client.data.user.username} to room ${room}: ${data.content}`,
        );
    }
}
