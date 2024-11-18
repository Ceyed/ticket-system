import { Column, Entity, OneToMany } from 'typeorm';
import { UserRoleEnum } from '../../../../enums/role.enum';
import { BaseEntity } from '../base.entity';
import { TicketEntity } from '../ticket/ticket.entity';

@Entity({
    name: 'user',
    schema: 'person',
})
export class UserEntity extends BaseEntity {
    @Column()
    // @ApiProperty()
    username: string;

    @Column()
    // @ApiProperty()
    password: string;

    @Column({ enum: UserRoleEnum, default: UserRoleEnum.User })
    // @ApiProperty()
    role: UserRoleEnum;

    @OneToMany(() => TicketEntity, (ticket) => ticket.user)
    tickets: TicketEntity[];
}
