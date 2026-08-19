import { apiClient, type ErrorResponse } from "../api/api";
import type { Question, QuestionOption, Quiz } from "./QuizService";

class AttemptService {
    async saveQuizProgress<T>(payload: unknown): Promise<T | ErrorResponse> {
        return apiClient({
            type: "post",
            service: "attempts",
            uri: "/save",
            payload,
        });
    }
}

export default new AttemptService();

export interface AttemptProgress {
    attemptId?: number;
    studentId: string;
    quizId: string;
    answers: QuizAnswers[];
    status: AttemptStatus;
}

export type QuizAnswers = { questionId: number; answerId: number | null };

export interface Answer {
    id: number;
    attempt: Attempt;
    question: Question;
    selectedOption: QuestionOption;
    isCorrect: boolean;
    updatedAt: string;
    createdAt: string;
}

export interface Attempt {
    id: number;
    studentId: string;
    quiz: Quiz;
    score: number;
    percentage: number;
    correctAnswers: number;
    unAnswered: number;
    answers: Answer[];
    timeSpent: string;
    status: AttemptStatus;
    attemptTime: string;
}

export const AttemptStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    INTERUPTED: "INTERUPTED",
    SUBMITTED: "SUBMITTED",
    COMPLETED: "COMPLETED",
} as const;

export type AttemptStatus = (typeof AttemptStatus)[keyof typeof AttemptStatus];

export const SaveProgress = {
    SAVED: "SAVED",
    SAVING: "SAVING",
    UN_ANSWERED: "UN_ANSWERED",
    UN_SAVED: "UN_SAVED",
} as const;

export type SaveProgress = (typeof SaveProgress)[keyof typeof SaveProgress];
