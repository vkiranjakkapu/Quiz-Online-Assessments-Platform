import { Navigate, Outlet, useLocation } from "react-router-dom";
import BodyLayout from "../components/layouts/BodyLayout";
import usePrincipal from "../context/usePrincipal";
import { RoutePaths } from "../routes/RoutePaths";

export default function LandingPageLayout() {
    const { isLoggedIn, getHomeRoute } = usePrincipal();
    const currentLocation = useLocation();

    if (isLoggedIn()) {
        return (
            <Navigate
                to={
                    currentLocation.pathname == RoutePaths.LANDING
                        ? getHomeRoute()
                        : currentLocation
                }
                replace
            />
        );
    }

    return (
        <>
            <BodyLayout>
                <Outlet />
            </BodyLayout>
        </>
    );
}
