export const RoutePaths = {
    LANDING: "/",
    
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",

    USERS: "/users",
    USER_DETAILS: "/users/:userId",

    QUIZZES: "/quizzes",
    QUIZ_DETAILS: "/quizzes/:quizId",

    ATTEMPT: "/attempt",
    ATTEMPT_DETAILS: "/attempt/:attemptId",
} as const;
