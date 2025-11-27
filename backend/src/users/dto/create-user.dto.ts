import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    job_title?: string;

    @IsOptional()
    @IsString()
    @IsIn(["vi", "jp"])
    language?: string;

    @IsOptional()
    @IsString()
    @IsIn(["light", "dark"])
    theme_mode?: string;
}
