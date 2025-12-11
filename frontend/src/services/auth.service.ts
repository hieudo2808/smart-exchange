import { axiosInstance } from "./axios.config";

// Request types
export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    jobTitle?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Response types
export interface UserInfo {
    id?: string;
    userId?: string;
    email: string;
    jobTitle: string | null;
    languageCode?: string;
    themeMode?: string;
}

export interface UserSettings {
    language: string;
    theme: string;
}

export interface LoginResponse {
    user: UserInfo;
    settings: UserSettings;
}

export interface RegisterResponse {
    message: string;
    data: null;
}

export interface GoogleLoginRequest {
    token: string;
}

class AuthService {
    async register(data: RegisterRequest): Promise<RegisterResponse> {
        return axiosInstance.post("/auth/register", data);
    }

    async login(data: LoginRequest): Promise<LoginResponse> {
        return axiosInstance.post("/auth/login", data);
    }

    async loginWithGoogle(data: GoogleLoginRequest): Promise<LoginResponse> {
        return axiosInstance.post("/auth/google", data);
    }

    async logout(): Promise<{ message: string }> {
        return axiosInstance.post("/auth/logout");
    }
}

export const authService = new AuthService();
