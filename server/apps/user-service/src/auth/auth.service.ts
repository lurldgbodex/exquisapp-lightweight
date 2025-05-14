import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './utils/auth.constants';
import { LoginRequest } from '../dto/request/login-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthResponse } from '../dto/response/auth-response.dto';
import { CreateRequest } from '../dto/request/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(loginDto: LoginRequest): Promise<AuthResponse> {
        const user = await this.validateUser(loginDto);
        return await this.generateToken(user);
    }

    async register(registerDto: CreateRequest): Promise<AuthResponse> {
        const user = await this.userService.create(registerDto);
        return await this.generateToken(user);
    } 

    async validateUser(req: LoginRequest): Promise<User> {
        const user = await this.userService.findOneByUserName(req.username);

        if (!user || !(await bcrypt.compare(req.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials')
        }

        return user;
    }


    private async generateToken(user: User): Promise<AuthResponse> {
        const payload = { username: user.username, sub: user.id }
        
        const access_token = await this.jwtService.sign(payload, {
            secret: jwtConstants.secret,
            expiresIn: jwtConstants.expiresIn,
        });

        return { access_token };
    }
}
