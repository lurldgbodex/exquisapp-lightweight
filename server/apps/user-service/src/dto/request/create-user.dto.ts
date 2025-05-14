import { IsNotEmpty, IsString } from "class-validator";

export class CreateRequest {
    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    password: string;
}