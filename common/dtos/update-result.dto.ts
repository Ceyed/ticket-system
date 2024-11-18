import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateResultDto {
    @ApiProperty()
    @IsBoolean()
    status: boolean;
}
