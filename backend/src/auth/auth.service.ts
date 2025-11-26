import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private static instance: AuthService;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    if (!AuthService.instance) {
      AuthService.instance = this;
    }
    return AuthService.instance;
  }

  async register(registerDto: RegisterDto) {
    try {
      await this.usersService.create(registerDto);
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error?.status === 409) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new ConflictException(error.response);
      }
      throw error;
    }
    return { message: 'Registered successfully. Please login.', data: null };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException({ statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' });
    }

    const pepper = process.env.PEPPER ?? '';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const isMatch = await (bcrypt as any).compare(loginDto.password + pepper, user.password);
    if (!isMatch) {
      throw new UnauthorizedException({ statusCode: 401, message: 'Invalid credentials', error: 'Unauthorized' });
    }

    // Generate JWT token (Quân's task)
    const payload = { user_id: user.user_id, email: user.email };
    const token = this.jwtService.sign(payload);

    // Remove sensitive data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    // Return token + user info + settings
    return {
      message: 'Login successful',
      data: {
        token,
        user: {
          id: userWithoutPassword.user_id,
          email: userWithoutPassword.email,
          jobTitle: userWithoutPassword.job_title,
        },
        settings: {
          language: userWithoutPassword.language,
          theme: userWithoutPassword.theme_mode,
        },
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
      message: 'Logout successful',
      data: null,
    };
  }
}

