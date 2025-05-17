import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateRequest {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}