import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { uuid } from 'common/types/uuid.constant';

export class SendMessageInTicketDto {
    @IsString()
    @IsUUID()
    ticketId: uuid;

    @IsString()
    @IsNotEmpty()
    content: string;
}
