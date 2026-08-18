export const RoutePaths = {
    LANDING: "/",

    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    
    USERS: "/users",
    USER_DETAILS: "/users/:userId",

    QUIZZES: "/quizzes",
    QUIZ_DETAILS: "/quizzes/:quizId",
    QUIZ_ATTEMPT: "/quizzes/attempt/:quizId",

    ATTEMPTS: "/attempts",
    ATTEMPT_DETAILS: "/attempts/:attemptId",
} as const;
