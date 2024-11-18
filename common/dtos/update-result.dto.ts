import { IsBoolean } from 'class-validator';

export class UpdateResultDto {
    @IsBoolean()
    status: boolean;
}
