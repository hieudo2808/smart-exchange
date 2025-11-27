import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { BcryptSecurity } from "../common/security/bcrypt.security";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/constants/exception-code.constant";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        await this.usersService.create(registerDto);
        return { message: "Registered successfully. Please login.", data: null };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new AppException(ExceptionCode.UNAUTHORIZED);
        }

        const isMatch = await BcryptSecurity.comparePassword(loginDto.password, user.password);
        if (!isMatch) {
            throw new AppException(ExceptionCode.INVALID_PASSWORD);
        }

        const payload = { user_id: user.userId, email: user.email };
        const token = this.jwtService.sign(payload);

        const { password, ...userWithoutPassword } = user;

        return {
            token,
            user: {
                id: userWithoutPassword.userId,
                email: userWithoutPassword.email,
                jobTitle: userWithoutPassword.jobTitle,
            },
            settings: {
                language: userWithoutPassword.languageCode,
                theme: userWithoutPassword.themeMode,
            },
        };
    }

    // Logout method (Vinh's task)
    logout() {
        // In a production environment, you would:
        // 1. Add token to a blacklist (Redis/database)
        // 2. Clear any server-side sessions
        // 3. Log the logout action for audit trail

        // For now, we just return success
        // The actual token invalidation happens on the client side
        return {
            message: "Logout successful",
        };
    }
}
