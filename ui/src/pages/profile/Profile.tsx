import SectionLayout from "../../components/SectionLayout";
import useProfile from "../../context/useProfile";

export default function Profile() {
    const { profile } = useProfile();

    return (
        <SectionLayout title="Profile" description="Edit Your Profile">
            <h1>{profile?.name}</h1>
        </SectionLayout>
    );
}
