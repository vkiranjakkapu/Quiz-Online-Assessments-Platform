import { apiClient, type ErrorResponse } from "../api/api";
import type { RoleType } from "../context/usePrincipal";
import type { Address } from "../context/useProfile";

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: Address;
    dob: string;
    enabled: boolean;
    roles: string[];
    createdAt: string;
    updatedAt: string;
}

class AccountService {
    async getMyProfile<T>(): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: "/me",
        });
    }
    async getUserById<T>(userId: string): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: "/" + userId,
        });
    }

    async getAllUsers<T>(role?: RoleType): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "profile",
            uri: role ? "/role/" + role : "/",
        });
    }

    async createUser<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "profile",
            uri: "/",
            payload,
        });
    }

    async updateProfile<T>(
        id: string,
        payload: unknown,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "put",
            service: "profile",
            uri: "/" + id,
            payload,
        });
    }

    async changePassword<T>(
        payload: unknown,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "patch",
            service: "profile",
            uri: "/",
            payload,
        });
    }

    async deleteProfile<T>(id: number): Promise<T | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "profile",
            uri: "/" + id,
        });
    }
}

export default new AccountService();
