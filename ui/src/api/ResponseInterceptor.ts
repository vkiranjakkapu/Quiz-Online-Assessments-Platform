import type { AxiosError, AxiosInstance, AxiosResponse } from "axios";

export default function configureResponseInterceptor(api: AxiosInstance) {
    api.interceptors.response.use(
        (response: AxiosResponse) => response,

        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                // AuthService.refresh<LoginResponse>(
                //     TokenStorage.getRefreshToken(),
                // ).then((resp) => {
                //     if (resp && !("errorMessage" in resp)) {
                //         console.log("Refreshing access token");
                //         TokenStorage.save(resp.accessToken, resp.refreshToken);
                //     }
                // });
            }

            return Promise.reject(error);
        },
    );
}
