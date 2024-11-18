import { uuid } from 'common/types/uuid.constant';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { TicketStatusEnum } from '../../../../enums/ticket-status.enum';
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

    @Column({ enum: TicketStatusEnum, default: TicketStatusEnum.Open })
    status: TicketStatusEnum;

    @Column()
    userId: uuid;

    @ManyToOne(() => UserEntity, (user) => user.tickets)
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @OneToMany(() => MessageEntity, (message) => message.ticket)
    messages: MessageEntity[];
}
