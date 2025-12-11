import { IsEmail, IsOptional, IsString, MinLength, IsIn } from "class-validator";

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsOptional()
    @IsString()
    fullName: string;

    @IsOptional()
    @IsString()
    jobTitle?: string;

    @IsIn([true, false])
    isTutorialCompleted: boolean;
}
