import SectionLayout from "../../components/SectionLayout";
import { RoutePaths } from "../../routes/RoutePaths";

export default function Attempts() {

    return (
        <SectionLayout
            breadCrumbs={[
                { text: "Attempts", uri: RoutePaths.ATTEMPTS}
            ]}
            description="Your Previous Quiz Attempts"
        >
            <h1>Attempts</h1>
        </SectionLayout>
    );
}
