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
import AttemptQuiz from "../pages/attempts/portal/AttemptQuiz";
import Users from "../pages/users/Users";
import Profile from "../pages/profile/Profile";
import Attempts from "../pages/attempts/AttemptsPage";
import LeaderBoard from "../pages/leaderboard/LeaderBoard";

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
                <Route
                    path={RoutePaths.QUIZ_ATTEMPT}
                    element={<AttemptQuiz />}
                ></Route>

                <Route
                    path={RoutePaths.LEADERBOARD}
                    element={<LeaderBoard />}
                ></Route>

                <Route
                    path={RoutePaths.ATTEMPTS}
                    element={<Attempts />}
                ></Route>
                <Route
                    path={RoutePaths.ATTEMPT_DETAILS}
                    element={<AttemptDetails />}
                ></Route>

                <Route element={<AdminLayout />}>
                    <Route path={RoutePaths.USERS} element={<Users />} />
                    <Route
                        path={RoutePaths.USER_DETAILS}
                        element={<Profile />}
                    />
                </Route>
            </Route>
        </Routes>
    );
}
