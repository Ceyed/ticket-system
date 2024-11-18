import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { TicketEntity } from '../ticket/ticket.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
    name: 'message',
    schema: 'ticket',
})
export class MessageEntity extends BaseEntity {
    @Column()
    content: string;

    @ManyToOne(() => TicketEntity, (ticket) => ticket.messages)
    ticket: TicketEntity;

    @ManyToOne(() => UserEntity)
    sender: UserEntity;
}
