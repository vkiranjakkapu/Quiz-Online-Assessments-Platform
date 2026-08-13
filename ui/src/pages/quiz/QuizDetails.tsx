import { useParams } from "react-router-dom";
import SectionLayout from "../../components/SectionLayout";
import { RoutePaths } from "../../routes/RoutePaths";

export default function QuizDetails() {
    const { quizId } = useParams<{ quizId: string }>();

    return (
        <SectionLayout
            breadCrumbs={{
                anchors: [
                    {
                        text: "Quizzes",
                        uri: RoutePaths.QUIZZES,
                    },
                    {
                        text: "Quiz - Quiz title",
                        uri: RoutePaths.QUIZ_DETAILS,
                    },
                ],
            }}
            description={`Quiz Details for ${quizId}`}
        >
            <h1>Attempt Details</h1>
        </SectionLayout>
    );
}
