import { Module } from '@nestjs/common';
import { RedisHelperService } from './redis-helper.service';

@Module({
    imports: [],
    providers: [RedisHelperService],
    exports: [RedisHelperService],
})
export class RedisHelperModule {}
