export const AppConfig = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    IDENTITY_AUTH_URL: "identity/api/v1/auth",
    IDENTITY_PROFILE_URL: "identity/api/v1/users",
    QUIZ_SERVICE_URL: "quiz/api/v1",
    QUIZ_ATTEMPT_URL: "/quiz/api/v1/attempts",
    REPORTS_SERVICE_URL: "reports/api/v1",

    LOCAL_AUTH_KEY: "qoap_auth",
};
