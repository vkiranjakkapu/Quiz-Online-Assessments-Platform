import { useParams } from "react-router-dom";
import SectionLayout from "../../components/SectionLayout";
import { RoutePaths } from "../../routes/RoutePaths";

export default function AttemptDetails() {
    const { attemptId } = useParams<{ attemptId: string }>();

    return (
        <SectionLayout
            breadCrumbs={{
                anchors: [
                    {
                        text: "Attempts",
                        uri: RoutePaths.ATTEMPT,
                    },
                    {
                        text: "Quiz - Quiz title",
                        uri: RoutePaths.ATTEMPT_DETAILS,
                    },
                ],
            }}
            description={`Attempt Details for ${attemptId}`}
        >
            <h1>Attempt Details</h1>
        </SectionLayout>
    );
}
