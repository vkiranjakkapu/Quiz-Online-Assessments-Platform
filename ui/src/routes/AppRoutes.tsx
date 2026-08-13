import { Route, Routes } from "react-router-dom";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import LandingPageLayout from "../layouts/LandingPageLayout";
import AdminLayout from "../layouts/AdminLayout";
import { RoutePaths } from "./RoutePaths";
import Dashboard from "../pages/dashboards/Dashboard";
import LandingPage from "../pages/landing/LandingPage";
import Quizzes from "../pages/quiz/Quizzes";
import QuizDetails from "../pages/quiz/QuizDetails";
import AttemptDetails from "../pages/attempts/AttemptDetails";
import Attempt from "../pages/attempts/Attempt";
import Users from "../pages/users/Users";
import UserDetails from "../pages/users/UserDetails";
import Profile from "../pages/profile/Profile";

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<LandingPageLayout />}>
                <Route
                    path={RoutePaths.LANDING}
                    element={<LandingPage />}
                ></Route>
            </Route>
            <Route element={<AuthenticatedLayout />}>
                <Route
                    path={RoutePaths.DASHBOARD}
                    element={<Dashboard />}
                ></Route>
                <Route path={RoutePaths.PROFILE} element={<Profile />}></Route>

                <Route path={RoutePaths.QUIZZES} element={<Quizzes />}></Route>
                <Route
                    path={RoutePaths.QUIZ_DETAILS}
                    element={<QuizDetails />}
                ></Route>

                <Route path={RoutePaths.ATTEMPT} element={<Attempt />}></Route>
                <Route
                    path={RoutePaths.ATTEMPT_DETAILS}
                    element={<AttemptDetails />}
                ></Route>

                <Route element={<AdminLayout />}>
                    <Route path={RoutePaths.USERS} element={<Users />} />
                    <Route
                        path={RoutePaths.USER_DETAILS}
                        element={<UserDetails />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}
