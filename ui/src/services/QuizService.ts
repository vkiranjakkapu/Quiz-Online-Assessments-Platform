import { apiClient, type ErrorResponse } from "../api/api";

class QuizService {
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
