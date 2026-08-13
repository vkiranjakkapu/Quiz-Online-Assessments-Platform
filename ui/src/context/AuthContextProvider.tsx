import { useEffect, useState, type ReactNode } from "react";
import type { ErrorResponse } from "../api/api";
import { RoutePaths } from "../routes/RoutePaths";
import AuthService, {
    type LoginRequest,
    type LoginResponse,
} from "../services/AuthService";
import TokenStorage from "../storage/TokenStorage";
import { decodedToken } from "../utils/JwtUtils";
import {
    AuthContext,
    AuthStatus,
    RoleType,
    type Principal,
} from "./usePrincipal";

const principal: Principal = {
    id: 0,
    email: "",
    roles: [],
    accessToken: "",
    refreshToken: "",
};

type AuthContextProviderProps = {
    children: ReactNode;
};

export default function AuthContextProvider({
    children,
}: AuthContextProviderProps) {
    const [authContext, setAuthContext] = useState<Principal>(principal);
    const [authStatus, setAuthStatus] = useState<AuthStatus>(
        AuthStatus.INITIALIZING,
    );

    useEffect(() => {
        bootSession();
    }, []);

    async function bootSession() {
        const refreshToken = TokenStorage.getRefreshToken();

        if (!refreshToken) {
            setAuthStatus(AuthStatus.UNAUTHENTICATED);
            return;
        }
        setAuthStatus(AuthStatus.INITIALIZING);

        await AuthService.refresh<LoginResponse>(refreshToken)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    TokenStorage.save(resp.accessToken, resp.refreshToken);

                    const jwt = decodedToken(resp.accessToken);

                    setAuthContext((prev) => ({
                        ...prev,
                        id: jwt.uid,
                        name: jwt.name,
                        email: jwt.sub,
                        roles: jwt.roles,
                        accessToken: resp.accessToken,
                        refreshToken: resp.refreshToken,
                        isLoggedIn: true,
                    }));
                    setAuthStatus(AuthStatus.AUTHENTICATED);
                } else {
                    TokenStorage.clear();
                    setAuthContext(principal);
                    setAuthStatus(AuthStatus.UNAUTHENTICATED);
                }
            })
            .catch((error) => {
                console.error(error);
                setAuthStatus(AuthStatus.UNAUTHENTICATED);
            });
    }

    async function authenticate(
        credentials: LoginRequest,
    ): Promise<ErrorResponse | LoginResponse> {
        setAuthStatus(AuthStatus.INITIALIZING);
        return AuthService.login<LoginResponse>(credentials).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                TokenStorage.save(resp.accessToken, resp.refreshToken);

                const jwt = decodedToken(resp.accessToken);
                setAuthContext((prev) => ({
                    ...prev,
                    email: jwt.sub,
                    roles: jwt.roles,
                    accessToken: resp.accessToken,
                    refreshToken: resp.refreshToken,
                    isLoggedIn: true,
                }));

                setAuthStatus(AuthStatus.AUTHENTICATED);
            } else {
                TokenStorage.clear();
                setAuthContext(principal);
                setAuthStatus(AuthStatus.UNAUTHENTICATED);
            }
            return resp;
        });
    }

    async function logout() {
        const status = await AuthService.logout(authContext.refreshToken);
        if (status == 204) {
            TokenStorage.clear();
            setAuthContext(principal);
            setAuthStatus(AuthStatus.UNAUTHENTICATED);
        }
    }

    async function refresh() {
        setAuthStatus(AuthStatus.INITIALIZING);
        AuthService.refresh<LoginResponse>(authContext.accessToken)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    TokenStorage.save(resp.accessToken, resp.refreshToken);
                    setAuthContext((prev) => ({
                        ...prev,
                        accessToken: resp.accessToken,
                        refreshToken: resp.refreshToken,
                        isLoggedIn: true,
                    }));
                    setAuthStatus(AuthStatus.AUTHENTICATED);
                } else {
                    console.log(resp.errorMessage);
                    TokenStorage.clear();
                    setAuthContext(principal);
                    setAuthStatus(AuthStatus.UNAUTHENTICATED);
                }
            })
            .catch((er) => {
                console.log(er);
                setAuthStatus(AuthStatus.UNAUTHENTICATED);
            });
    }

    function isLoggedIn() {
        return authStatus == AuthStatus.AUTHENTICATED;
    }

    function getHomeRoute(uri?: string) {
        if (isLoggedIn()) {
            return uri && uri != RoutePaths.LANDING
                ? uri
                : RoutePaths.DASHBOARD;
        }
        return RoutePaths.LANDING;
    }

    function isAdmin(): boolean {
        return authContext.roles.includes(RoleType.ADMIN);
    }

    function isStudent(): boolean {
        return authContext.roles.includes(RoleType.STUDENT);
    }

    return (
        <AuthContext
            value={{
                principal: authContext,
                status: authStatus,
                isLoggedIn,
                isAdmin,
                isStudent,
                authenticate,
                logout,
                refresh,
                tokenLogin: bootSession,
                getHomeRoute,
            }}
        >
            {children}
        </AuthContext>
    );
}
