import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionLayout from "../../components/SectionLayout";
import SpinnerComponent from "../../components/SpinnerComponent";
import { RoutePaths } from "../../routes/RoutePaths";
import type { Attempt } from "../../services/AttemptService";
import AttemptService from "../../services/AttemptService";
import QuizInfoCard from "../../components/quiz/QuizInfoCard";

export default function AttemptDetails() {
    const { attemptId } = useParams<{ attemptId: string }>();
    const [dataLoading, setDataLoading] = useState(true);
    const [attempt, setAttempt] = useState<Attempt>({} as Attempt);

    useEffect(() => {
        AttemptService.getAttemptById<Attempt>(attemptId + "")
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setAttempt(resp);
                }
            })
            .finally(() => {
                setDataLoading(false);
            });
    }, [attemptId]);

    return (
        <SectionLayout
            breadCrumbs={[
                {
                    text: "Attempts",
                    uri: RoutePaths.ATTEMPTS,
                },
                {
                    text: attempt.quiz
                        ? `Quiz - ${attempt.quiz.title}`
                        : "loading..",
                    uri: RoutePaths.ATTEMPT_DETAILS,
                },
            ]}
            description={`Attempt Details for ${attemptId}`}
        >
            {dataLoading ? (
                <SpinnerComponent
                    size="size-5"
                    text="fetching attempt details..."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <QuizInfoCard quiz={attempt.quiz} showAttempt={false} />
                    <QuizInfoCard quiz={attempt.quiz} showAttempt={false} />
                </div>
            )}
        </SectionLayout>
    );
}
