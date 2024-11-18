import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { uuid } from 'common/types/uuid.constant';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    @IsNotEmpty()
    @IsUUID()
    @Expose()
    id: uuid;

    @CreateDateColumn({
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    @IsDate()
    @Type(() => Date)
    created_at: Date;

    @UpdateDateColumn({
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    @IsDate()
    updated_at: Date;
}
