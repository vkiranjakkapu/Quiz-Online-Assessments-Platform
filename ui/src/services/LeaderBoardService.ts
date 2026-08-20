import { apiClient, type ErrorResponse } from "../api/api";
import type { UserProfile } from "../context/useProfile";
import type { Attempt } from "./AttemptService";

class LeaderBoardService {
    async getLeaderBoard<T>(quizId?: string): Promise<T | ErrorResponse> {
        return apiClient({
            type: "get",
            service: "reports",
            uri: quizId ? "/leaderboard/quiz/" + quizId : "/leaderboard/",
        });
    }
}

export default new LeaderBoardService();

export interface LeaderBoardData {
    attempt: Attempt;
    student: UserProfile;
    studentId: string;
    studentName: string;
    score: number;
    quizId: string;
    quizTitle: string;
    category: string;
    totalAttempts: number;
}
