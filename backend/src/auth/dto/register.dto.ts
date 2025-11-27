import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDto {
    // Trùng với field "Email" trên giao diện
    @IsEmail()
    email: string;

    // Trùng với field "Mật khẩu" trên giao diện
    @IsString()
    @MinLength(8)
    password: string;

    // Trùng với field "Họ và tên" trên giao diện (frontend đang dùng fullName)
    @IsOptional()
    @IsString()
    fullName: string;

    // Có thể dùng sau này nếu muốn lưu nghề nghiệp; hiện chưa có trong UI
    @IsOptional()
    @IsString()
    jobTitle?: string;
}
