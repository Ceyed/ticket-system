import { IsNotEmpty, IsUUID } from 'class-validator';
import { uuid } from 'common/types/uuid.constant';

export class CloseTicketDto {
    @IsUUID()
    @IsNotEmpty()
    id: uuid;
}
