import { useParams } from "react-router-dom";
import SectionLayout from "../../components/SectionLayout";
import { RoutePaths } from "../../routes/RoutePaths";

export default function UserDetails() {
    const { userId } = useParams<{ userId: string }>();

    return (
        <SectionLayout
            breadCrumbs={[
                {
                    text: "Users",
                    uri: RoutePaths.USERS,
                },
                {
                    text: "User id: " + userId,
                    uri: RoutePaths.USER_DETAILS,
                },
            ]}
            description={`User Details for ${userId}`}
        >
            <h1>User Details</h1>
        </SectionLayout>
    );
}
