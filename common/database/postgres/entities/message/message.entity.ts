import { uuid } from 'common/types/uuid.constant';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
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

    @Column()
    ticketId: uuid;

    @Column()
    senderId: uuid;

    @ManyToOne(() => TicketEntity, (ticket) => ticket.messages)
    @JoinColumn({ name: 'ticketId' })
    ticket: TicketEntity;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'senderId' })
    sender: UserEntity;
}
