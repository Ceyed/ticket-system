import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { MessageEntity } from '../message/message.entity';
import { UserEntity } from '../user/user.entity';

@Entity({
    name: 'ticket',
    schema: 'ticket',
})
export class TicketEntity extends BaseEntity {
    @Column()
    title: string;

    @Column({ default: 'open' })
    status: string;

    @ManyToOne(() => UserEntity, (user) => user.tickets)
    user: UserEntity;

    @OneToMany(() => MessageEntity, (message) => message.ticket)
    messages: MessageEntity[];
}
