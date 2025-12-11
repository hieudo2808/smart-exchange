import { IsEmail, IsIn, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    fullName: string;

    @IsOptional()
    @IsString()
    jobTitle?: string;

    @IsOptional()
    @IsString()
    @IsIn(["vi", "jp"])
    language?: string;

    @IsOptional()
    @IsString()
    @IsIn(["light", "dark"])
    themeMode?: string;

    @IsOptional()
    @IsIn([true, false])
    isTutorialCompleted: boolean;
}
