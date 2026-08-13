import api, { apiClient, type ErrorResponse } from "../api/api";
import { AppConfig } from "../config/AppConfig";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

export interface Response {
    data: object;
    status: number;
}

class AuthService {
    async login<T>(payload: LoginRequest): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "identity",
            uri: "/login",
            payload,
        });
    }

    async refresh<T>(refreshToken: string): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "identity",
            uri: "/refresh",
            payload: { refreshToken },
        });
    }

    async logout(refreshToken: string): Promise<number> {
        const response = await api.post(
            AppConfig.IDENTITY_AUTH_URL + "/logout",
            {
                refreshToken,
            },
        );

        return response.status;
    }
}

export default new AuthService();
