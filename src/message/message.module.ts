import { Module } from '@nestjs/common';
import { IamModule } from 'src/iam/iam.module';
import { MessageGateway } from './message.gateway';

@Module({
    imports: [IamModule],
    providers: [MessageGateway],
    exports: [MessageGateway],
})
export class MessageModule {}
