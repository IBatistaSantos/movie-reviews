import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepository } from '../../repositories/user.repository';
import { UserSchema } from './schemas/user.schema';
import { TypeOrmMapper } from './typeorm.mapper';
import { User } from '../../entities/user.entity';

export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>,
  ) {}

  async findByToken(token: string): Promise<User | null> {
    const response = await this.repository.findOne({
      where: { forgotPasswordToken: String(token) },
    });

    return TypeOrmMapper.toEntity<User>(response, User);
  }

  async findById(id: string): Promise<User | null> {
    const response = await this.repository.findOne({
      where: { id },
    });

    return TypeOrmMapper.toEntity<User>(response, User);
  }

  async findByEmail(email: string): Promise<User | null> {
    const response = await this.repository.findOne({
      where: { email, status: 'ACTIVE' },
    });
    return TypeOrmMapper.toEntity<User>(response, User);
  }

  async save(user: User): Promise<void> {
    await this.repository.save(TypeOrmMapper.toSchema(user));
  }

  async update(user: User): Promise<void> {
    await this.repository.update(user.id, TypeOrmMapper.toSchema(user));
  }
}
