import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { BcryptSecurity } from "~/common/security/bcrypt.security";
import { AppException } from "~/common/exceptions/app.exception";
import { ExceptionCode } from "~/common/constants/exception-code.constant";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { GoogleLoginDto } from "./dto/google-login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
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
        const token = this.jwtService.sign(payload, { expiresIn: '1h' });

        // Generate refresh token bằng JWT 
        const refreshToken = this.jwtService.sign(
            { user_id: user.userId, type: 'refresh' },
            { 
                secret: process.env.REFRESH_JWT_SECRET,
                expiresIn: '30d'
            }
        );

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;

        return {
            token,
            refreshToken,
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

    // Logout method 
    logout() {
        return {
            message: "Logout successful",
        };
    }

    // Refresh access token bằng JWT 
    refreshAccessToken(refreshTokenDto: RefreshTokenDto) {
        try {
            // Verify refresh token
            const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
                secret: process.env.REFRESH_JWT_SECRET,
            }) as { user_id: string; email: string; type: string };

            // Kiểm tra loại token
            if (!payload || payload.type !== 'refresh') {
                throw new AppException(ExceptionCode.UNAUTHORIZED, "Invalid token type");
            }

            // Tạo access token mới
            const newAccessToken = this.jwtService.sign(
                { user_id: payload.user_id, email: payload.email },
                { expiresIn: '1h' }
            );

            // Tạo refresh token mới
            const newRefreshToken = this.jwtService.sign(
                { user_id: payload.user_id, type: 'refresh' },
                { 
                    secret: process.env.REFRESH_JWT_SECRET,
                    expiresIn: '30d'
                }
            );

            return {
                token: newAccessToken,
                refreshToken: newRefreshToken,
            };
        } catch {
            throw new AppException(ExceptionCode.UNAUTHORIZED, "Invalid or expired refresh token");
        }
    }

    // Revoke refresh token  - Với JWT không cần revoke, chỉ cần xóa cookie
    revokeRefreshToken() {
        return {
            message: "Refresh token revoked successfully",
        };
    }

    async loginWithGoogle(googleLoginDto: GoogleLoginDto) {
        try {
            // Sử dụng access token để lấy thông tin user từ Google
            const response = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${googleLoginDto.token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new AppException(
                    ExceptionCode.UNAUTHORIZED,
                    "Failed to fetch user info from Google"
                );
            }

            const googleUser = await response.json() as {
                email?: string;
                name?: string;
                sub?: string;
            };

            if (!googleUser.email) {
                throw new AppException(ExceptionCode.UNAUTHORIZED, "Google token is invalid");
            }

            const user = await this.usersService.upsertGoogleUser({
                email: googleUser.email,
                fullName: googleUser.name || googleUser.email.split("@")[0],
            });

            const token = this.jwtService.sign(
                { user_id: user.userId, email: user.email },
                { expiresIn: '1h' }
            );

            // Generate refresh token bằng JWT 
            const refreshToken = this.jwtService.sign(
                { user_id: user.userId, type: 'refresh' },
                { 
                    secret: process.env.REFRESH_JWT_SECRET,
                    expiresIn: '30d'
                }
            );

            return {
                token,
                refreshToken,
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
        } catch (error) {
            if (error instanceof AppException) {
                throw error;
            }
            throw new AppException(
                ExceptionCode.UNAUTHORIZED,
                "Failed to authenticate with Google"
            );
        }
    }
}
