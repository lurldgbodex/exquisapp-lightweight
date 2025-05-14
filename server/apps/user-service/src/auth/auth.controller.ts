import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateRequest } from '../dto/request/create-user.dto';
import { LoginRequest } from '../dto/request/login-user.dto';
import { AuthResponse } from '../dto/response/auth-response.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async createUser(@Body() createDto: CreateRequest): Promise<AuthResponse> {
        return await this.authService.register(createDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)   
    async login(@Body() loginDto: LoginRequest): Promise<AuthResponse> {
        return await this.authService.login(loginDto);
    }
}
