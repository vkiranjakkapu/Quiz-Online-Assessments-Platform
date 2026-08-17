import { apiClient, type ErrorResponse } from "../api/api";

class QuizService {
    async getQuizById<T>(quizId: string): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "quiz",
            uri: "/" + quizId,
        });
    }

    async getAllQuizzes<T>(): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "quiz",
            uri: "/",
        });
    }

    async getAllQuizzesByCategory<T>(
        category?: number,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "quiz",
            uri: "/category/" + category,
        });
    }

    async getAllQuizzesByTitle<T>(title?: string): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "quiz",
            uri: "/title/" + title,
        });
    }

    async getAllCategories<T>(): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "quiz",
            uri: "/category/",
        });
    }

    async createQuiz<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "quiz",
            uri: "/",
            payload,
        });
    }

    async updateQuiz<T>(
        quizId: unknown,
        payload: unknown,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "put",
            service: "quiz",
            uri: "/" + quizId,
            payload,
        });
    }

    async updateQuizStatus<T>(
        quizId: unknown,
        payload: unknown,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "patch",
            service: "quiz",
            uri: "/" + quizId,
            payload,
        });
    }

    async deleteQuiz<T>(quizId: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "delete",
            service: "quiz",
            uri: "/" + quizId,
        });
    }
}

export default new QuizService();

export interface Quiz {
    id?: string;
    title?: string;
    description?: string;
    category?: Category;
    settings?: QuizSettings;
    questions?: Question[];
    status?: QuizStatus;
    updatedAt?: string;
    createdAt?: string;
}

export interface Category {
    id?: string;
    name?: string;
    description?: string;
    quizzes?: Quiz[];
    updatedAt?: string;
    createdAt?: string;
}

export interface QuizSettings {
    id?: string;
    difficulty?: QuizDifficulty;
    passingScore?: string;
    maxDuration?: string;
    maxAttempts?: number;
    quiz?: Quiz;
    updatedAt?: string;
    createdAt?: string;
}

export interface Question {
    id?: string;
    quiz?: Quiz;
    questionText?: string;
    marks?: number;
    explanation?: string;
    difficulty?: QuestionDifficulty;
    options?: QuestionOption[];
    createdAt?: string;
}

export interface QuestionOption {
    id?: string;
    question?: Question;
    optionText?: string;
    isCorrect?: boolean;
    createdAt?: string;
}

export const QuizStatus = {
    DRAFT: "DRAFT",
    UN_PUBLISHED: "UN_PUBLISHED",
    PUBLISHED: "PUBLISHED",
} as const;

export type QuizStatus = (typeof QuizStatus)[keyof typeof QuizStatus];

export const QuizDifficulty = {
    BEGINNER: "BEGINNER",
    INTERMEDIATE: "INTERMEDIATE",
    EXPERT: "EXPERT",
} as const;

export type QuizDifficulty =
    (typeof QuizDifficulty)[keyof typeof QuizDifficulty];

export const QuestionDifficulty = {
    BEGINNER: "BEGINNER",
    INTERMEDIATE: "INTERMEDIATE",
    EXPERT: "EXPERT",
} as const;

export type QuestionDifficulty =
    (typeof QuestionDifficulty)[keyof typeof QuestionDifficulty];
