import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';
import { uuid } from 'common/types/uuid.constant';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
    @ApiProperty({ format: 'uuid', type: 'string' })
    @PrimaryGeneratedColumn('uuid')
    @IsNotEmpty()
    @IsUUID()
    @Expose()
    id: uuid;

    @CreateDateColumn({
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    @ApiProperty()
    @IsDate()
    @Type(() => Date)
    created_at: Date;

    @UpdateDateColumn({
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    @ApiProperty()
    @IsDate()
    updated_at: Date;
}
