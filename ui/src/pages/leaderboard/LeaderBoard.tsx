import { useEffect, useState } from "react";
import SectionLayout from "../../components/SectionLayout";
import { RoutePaths } from "../../routes/RoutePaths";
import type { Quiz } from "../../services/QuizService";
import LeaderBoardTableComponent from "./LeaderBoardTableComponent";
import LeaderBoardService, {
    type LeaderBoardData,
} from "../../services/LeaderBoardService";

export default function LeaderBoard({ quiz }: { quiz?: Quiz }) {
    const [leaderBoard, setLeaderBoard] = useState<LeaderBoardData[]>([]);

    useEffect(() => {
        LeaderBoardService.getLeaderBoard<LeaderBoardData[]>(quiz?.id).then(
            (resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setLeaderBoard(resp);
                }
            },
        );
    }, [quiz]);

    return (
        <SectionLayout
            breadCrumbs={[
                {
                    text: "Leaderboard",
                    uri: RoutePaths.ATTEMPTS,
                },
                ...(quiz
                    ? [
                          {
                              text: quiz ? `${quiz.title}` : "loading..",
                          },
                      ]
                    : []),
            ]}
            description={
                quiz
                    ? `Leaderboard for ${quiz.title}`
                    : `Leaderboard of the platform`
            }
        >
            <LeaderBoardTableComponent data={leaderBoard} />
        </SectionLayout>
    );
}
