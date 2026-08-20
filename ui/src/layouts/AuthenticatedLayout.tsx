import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "../components/layouts/DashboardLayout";
import usePrincipal, { AuthStatus } from "../context/usePrincipal";
import { RoutePaths } from "../routes/RoutePaths";

export default function AuthenticatedLayout() {
    const { status } = usePrincipal();

    if (status == AuthStatus.INITIALIZING) {
        return null;
    }

    if (status === AuthStatus.UNAUTHENTICATED) {
        return <Navigate to={RoutePaths.LANDING} replace />;
    }

    return (
        <>
            <DashboardLayout>
                <Outlet />
            </DashboardLayout>
        </>
    );
}
