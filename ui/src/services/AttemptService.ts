import type { Question, QuestionOption, Quiz } from "./QuizService";

class AttemptService {}

export default new AttemptService();

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
    status: CompletionStatus;
    attemptTime: string;
}

export const CompletionStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    INTERUPTED: "INTERUPTED",
    SUBMITTED: "SUBMITTED",
    COMPLETED: "COMPLETED",
} as const;

export type CompletionStatus =
    (typeof CompletionStatus)[keyof typeof CompletionStatus];
