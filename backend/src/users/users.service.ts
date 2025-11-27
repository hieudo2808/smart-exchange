import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BcryptSecurity } from "../common/security/bcrypt.security";
import { AppException } from "../common/exceptions/app.exception";
import { ExceptionCode } from "../common/constants/exception-code.constant";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });
        if (existing) {
            throw new AppException(ExceptionCode.CONFLICT, "Email already in use");
        }

        const hashedPassword = await BcryptSecurity.hashPassword(createUserDto.password);

        const user = await this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
                fullName: createUserDto.email.split("@")[0],
                jobTitle: createUserDto.job_title,
                languageCode: createUserDto.language || "vi",
                themeMode: createUserDto.theme_mode || "light",
            },
        });

        return { message: "User created", data: this.serialize(user) };
    }

    async findAll() {
        const users = await this.prisma.user.findMany();
        return {
            message: "Users fetched",
            data: users.map((user) => this.serialize(user)),
        };
    }

    async findOne(user_id: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId: user_id },
        });
        if (!user) {
            throw new AppException(ExceptionCode.NOT_FOUND, "User not found");
        }
        return { message: "User fetched", data: this.serialize(user) };
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async update(user_id: string, updateUserDto: UpdateUserDto) {
        const user = await this.prisma.user.findUnique({
            where: { userId: user_id },
        });
        if (!user) {
            throw new AppException(ExceptionCode.NOT_FOUND, "User not found");
        }

        if (updateUserDto.email && updateUserDto.email !== user.email) {
            const duplicate = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email },
            });
            if (duplicate) {
                throw new AppException(ExceptionCode.CONFLICT, "Email already in use");
            }
        }

        const data: any = {};
        if (updateUserDto.email) data.email = updateUserDto.email;
        if (updateUserDto.password)
            data.password = await BcryptSecurity.hashPassword(updateUserDto.password);
        if (updateUserDto.job_title !== undefined) data.jobTitle = updateUserDto.job_title;
        if (updateUserDto.language !== undefined) data.languageCode = updateUserDto.language;
        if (updateUserDto.theme_mode !== undefined) data.themeMode = updateUserDto.theme_mode;

        const updatedUser = await this.prisma.user.update({
            where: { userId: user_id },
            data,
        });

        return { message: "User updated", data: this.serialize(updatedUser) };
    }

    async remove(user_id: string) {
        const user = await this.prisma.user.findUnique({
            where: { userId: user_id },
        });
        if (!user) {
            throw new AppException(ExceptionCode.NOT_FOUND, "User not found");
        }
        await this.prisma.user.delete({ where: { userId: user_id } });
        return { message: "User deleted", data: { user_id } };
    }

    private serialize(user: any) {
        const { password, ...rest } = user;
        return rest;
    }
}
