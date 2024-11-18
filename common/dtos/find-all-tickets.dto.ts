import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TicketStatusEnum } from 'common/enums/ticket-status.enum';
import { uuid } from 'common/types/uuid.constant';

export class FindAllTicketsDto {
    @IsOptional()
    @IsEnum(TicketStatusEnum)
    status?: TicketStatusEnum;

    @IsOptional()
    @IsUUID()
    userId?: uuid;

    @IsOptional()
    @IsString()
    searchTitle?: string;
}
