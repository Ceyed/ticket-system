import { Type } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export interface SharedCustomRouteInfoDto {
    summary?: string;
    description?: string;
    outputType?: Type<unknown> | ClassConstructor<any>;
    outputIsArray?: boolean;
}

export type SharedUpdateRouteInfoDto = Partial<SharedCustomRouteInfoDto>;
