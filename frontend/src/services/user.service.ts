import { axiosInstance } from "./axios.config";
import type { UserInfo } from "./auth.service";

export interface UpdateJobInfoDto {
    career?: string;
    position?: string;
}

export interface CurrentUserResponse extends UserInfo {
    userId: string;
    languageCode?: string;
    themeMode?: string;
}

export interface UpdateSettingsDto {
    language?: string;
    themeMode?: string;
}

class UserService {
    async getCurrentUser(): Promise<CurrentUserResponse> {
        return axiosInstance.get("/users/me");
    }

    async updateUser(
        userId: string,
        data: Partial<UserInfo> | UpdateSettingsDto
    ): Promise<CurrentUserResponse> {
        return axiosInstance.patch(`/users/${userId}`, data);
    }

    async updateJobInfo(userId: string, data: UpdateJobInfoDto): Promise<CurrentUserResponse> {
        return axiosInstance.patch(`/users/${userId}/job-info`, data);
    }

    async deleteUser(userId: string): Promise<void> {
        return axiosInstance.delete(`/users/${userId}`);
    }
}

export const userService = new UserService();
