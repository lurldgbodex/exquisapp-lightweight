import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateRequest } from '../dto/request/create-user.dto';
import * as bcrypt from 'bcrypt';
import { userData } from '../dto/response/user-response.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(userData: CreateRequest): Promise<User>{
        const existingUser = await this.userRepository.findOne({ where: { username: userData.username }});

        if (existingUser) {
            throw new ConflictException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await this.userRepository.create({
            firstname: userData.first_name,
            lastname: userData.last_name,
            username: userData.username,
            password: hashedPassword,
        });

        return this.userRepository.save(user);
    }

    async findOneByUserName(username: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { username }});
    }

    async findOneById(id: string): Promise<userData> {
        const user =  await this.userRepository.findOne({ where: { id }});

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            created_at: user.createdAt,
        };
    }
}
