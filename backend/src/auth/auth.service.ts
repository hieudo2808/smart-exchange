import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { BcryptSecurity } from "~/common/security/bcrypt.security";
import { AppException } from "~/common/exceptions/app.exception";
import { ExceptionCode } from "~/common/constants/exception-code.constant";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class AuthService {
    private readonly googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async register(registerDto: RegisterDto) {
        await this.usersService.create(registerDto);
        return { message: "Registration successful" };
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new AppException(ExceptionCode.USER_NOT_FOUND);
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
        return {
            message: "Logout successful",
        };
    }

    async loginWithGoogle(googleLoginDto: GoogleLoginDto) {
        const ticket = await this.googleClient.verifyIdToken({
            idToken: googleLoginDto.token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if (!payload || !payload.email) {
            throw new AppException(ExceptionCode.UNAUTHORIZED, "Google token is invalid");
        }

        const user = await this.usersService.upsertGoogleUser({
            email: payload.email,
            fullName: payload.name || payload.email.split("@")[0],
        });

        const token = this.jwtService.sign({ user_id: user.userId, email: user.email });

        return {
            token,
            user: {
                id: user.userId,
                email: user.email,
                jobTitle: user.jobTitle,
            },
            settings: {
                language: user.languageCode,
                theme: user.themeMode,
            },
        };
    }
}
