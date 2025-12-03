import { axiosInstance } from "./axios.config";
import type { UserInfo } from "./auth.service";

export interface UpdateJobInfoDto {
    career?: string;
    position?: string;
}

class UserService {
    async getCurrentUser(): Promise<UserInfo> {
        return axiosInstance.get("/users/me");
    }

    async updateUser(userId: string, data: Partial<UserInfo>): Promise<UserInfo> {
        return axiosInstance.patch(`/users/${userId}`, data);
    }

    async updateJobInfo(userId: string, data: UpdateJobInfoDto): Promise<UserInfo> {
        return axiosInstance.patch(`/users/${userId}/job-info`, data);
    }

    async deleteUser(userId: string): Promise<void> {
        return axiosInstance.delete(`/users/${userId}`);
    }
}

export const userService = new UserService();
