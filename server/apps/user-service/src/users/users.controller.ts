import { Controller, Get, Param, Req, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get(':id/validate')
    async validateUser(@Param('id') id: string) {
        return await this.userService.findOneById(id);
    }

    @Get('me')
    async getUser(@Req() req: Request) {
        const userId = req.headers['x-user-id'] as string;

        if (!userId) {
            throw new UnauthorizedException('missing required header')
        }
        return await this.userService.findOneById(userId);
    }
}
