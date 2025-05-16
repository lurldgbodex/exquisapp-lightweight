import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Get(':id/validate')
    async validateUser(@Param('id') id: string) {
        return await this.userService.findOneById(id);
    }
}
