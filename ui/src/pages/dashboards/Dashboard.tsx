import SectionLayout from "../../components/SectionLayout";
import usePrincipal from "../../context/usePrincipal";
import useProfile from "../../context/useProfile";
import AdminDashboard from "./AdminDashboard";
import StudentDashboard from "./StudentDashboard";

export default function Dashboard() {
    const { profile } = useProfile();
    const { isAdmin, isStudent } = usePrincipal();

    return (
        <SectionLayout
            title="Dashboard"
            description={`Welcome back, ${profile?.name}`}
        >
            {isAdmin() && <AdminDashboard />}
            {isStudent() && <StudentDashboard />}
        </SectionLayout>
    );
}
