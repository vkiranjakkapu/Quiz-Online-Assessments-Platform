import { Outlet, useNavigate } from "react-router-dom";
import usePrincipal from "../context/usePrincipal";

export default function AdminLayout() {
    const { isAdmin, getHomeRoute } = usePrincipal();
    const navigate = useNavigate();

    if (!isAdmin()) {
        navigate(getHomeRoute());
    }

    return <Outlet />;
}
