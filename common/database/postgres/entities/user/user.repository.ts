import { Injectable, NotFoundException } from '@nestjs/common';
import { uuid } from 'common/types/uuid.constant';
import { DataSource, Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
    constructor(private readonly _dataSource: DataSource) {
        super(UserEntity, _dataSource.createEntityManager());
    }

    findOneByUsername(username: string): Promise<UserEntity> {
        return this.findOneBy({ username });
    }

    async findOneByUsernameOrFail(username: string): Promise<UserEntity> {
        const user: UserEntity = await this.findOneBy({ username });
        if (!user) throw new NotFoundException('کاربر یافت نشد');
        return user;
    }

    async getAllUserIds(): Promise<uuid[]> {
        const users: UserEntity[] = await this.find({ select: { id: true } });
        return users.map((user) => user.id);
    }
}
