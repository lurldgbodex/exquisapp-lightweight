import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './utils/auth.constants';
import { LoginRequest } from '../dto/request/login-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthResponse } from '../dto/response/auth-response.dto';
import { CreateRequest } from '../dto/request/create-user.dto';
import { RabbitMQService } from 'libs/shared-lib/src';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private readonly rabbitMQService: RabbitMQService,
    ) {}

    async login(loginDto: LoginRequest): Promise<AuthResponse> {
        const user = await this.validateUser(loginDto);
        console.log('UserID:', user.id);

        return await this.generateToken(user);
    }

    async register(registerDto: CreateRequest): Promise<AuthResponse> {
        console.log("Creating User");
        const user = await this.userService.create(registerDto);

        this.publishUserRegisteredEvent(user).catch(err => {
            console.error('Failed to publish user registered event:', err);
        });
                
        return await this.generateToken(user);
    } 

    async validateUser(req: LoginRequest): Promise<User> {
        const user = await this.userService.findOneByEmail(req.email);

        if (!user || !(await bcrypt.compare(req.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return user;
    }


    private async generateToken(user: User): Promise<AuthResponse> {
        const payload = { username: user.email, sub: user.id }
        
        const access_token = await this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.expiresIn,
        });

        return { access_token };
    }

    private async publishUserRegisteredEvent(user: User) {
        console.log('Publishing user created event');

        await this.rabbitMQService.publish('user_events', 'user.registered', {
            eventType: 'USER_REGISTERED',
            userId: user.id,
            name: `${user.firstname} ${user.lastname}`,
            email: user.email,
            timeStamp: user.createdAt,
        });

        console.log('User Registered Event Published');
    }
}
