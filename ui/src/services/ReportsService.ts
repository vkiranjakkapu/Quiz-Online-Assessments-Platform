import { apiClient, type ErrorResponse } from "../api/api";

export type MonthlyQuizzesReport = {
    date: string;
    quizzes: number;
    attempts: number;
};

class ReportsService {
    async getMonthlyQuizzesTrend<T>(
        month?: string,
    ): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "reports",
            uri: month ? "/quiz/monthly/" + month : "/quiz/monthly",
        });
    }
}

export default new ReportsService();
