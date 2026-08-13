import {
    ArrowLeftStartOnRectangleIcon,
    ArrowRightEndOnRectangleIcon,
    Bars3Icon,
    HeartIcon,
    HomeIcon,
    ListBulletIcon,
    MoonIcon,
    Square2StackIcon,
    SunIcon,
    UserCircleIcon,
    UsersIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePrincipal from "../context/usePrincipal";
import { RoutePaths } from "../routes/RoutePaths";
import ActionButton from "./ActionButton";
import Logo from "/logo.png";
import UserDP from "/undraw_choose_5kz4.svg";
import useProfile from "../context/useProfile";

export type NavbarProps = {
    handleLoginClick?: () => void;
    handleRegisterClick?: () => void;
};

export default function Navbar({
    handleLoginClick,
    handleRegisterClick,
}: NavbarProps) {
    const navigate = useNavigate();
    const { principal, isLoggedIn, logout } = usePrincipal();
    const { profile } = useProfile();
    const [openNav, setOpenNav] = useState(false);

    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return (
                document.documentElement.classList.contains("dark") ||
                localStorage.getItem("theme") === "dark"
            );
        }
        return true;
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const toggleTheme = (): void => {
        setIsDarkMode((prev) => !prev);
    };

    const navItems = [
        {
            text: "Dashboard",
            icon: HomeIcon,
            path: RoutePaths.DASHBOARD,
            roles: ["ADMIN", "STUDENT"],
        },
        {
            text: "Quizzes",
            icon: ListBulletIcon,
            path: RoutePaths.QUIZZES,
            roles: ["ADMIN", "STUDENT"],
        },
        {
            text: "Attempts",
            icon: Square2StackIcon,
            path: RoutePaths.ATTEMPT,
            roles: ["ADMIN", "STUDENT"],
        },
        {
            text: "Users",
            icon: UsersIcon,
            path: RoutePaths.USERS,
            roles: ["ADMIN"],
        },
    ];

    return (
        <>
            {openNav && (
                <div className="absolute md:hidden bg-slate-900/20 dark:bg-slate-900/30 h-full w-full z-0 backdrop-blur-sm"></div>
            )}
            <nav className="sticky top-0 w-full z-50 py-2 px-0 md:px-8 bg-slate-100 text-primary dark:bg-gray-800 dark:text-white flex flex-col md:flex-row items-center justify-between shadow-sm">
                <div className="px-4 w-full md:w-1/5 inline-flex gap-3 items-center justify-between md:justify-center">
                    <img
                        src={Logo}
                        alt="QOAP Logo"
                        className="w-34 rounded-lg bg-transparent dark:bg-gray-50"
                    />
                    <div className="inline-flex gap-2 md:hidden">
                        <ActionButton
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            icon={isDarkMode ? SunIcon : MoonIcon}
                            padding="p-1.5"
                        />
                        <ActionButton
                            onClick={() => setOpenNav(!openNav)}
                            icon={openNav ? XMarkIcon : Bars3Icon}
                            padding="p-1.5"
                        />
                    </div>
                </div>
                <div className="hidden md:flex flex-row gap-3 text-sm items-center justify-end">
                    {navItems.map((item, idx) => {
                        const IconComponent = item.icon;
                        const isActive =
                            location.pathname === item.path ||
                            location.pathname.startsWith(`${item.path}/`);

                        if (!item.roles.includes(principal.roles[0])) {
                            return;
                        }
                        return (
                            <div
                                onClick={() => navigate(item.path)}
                                key={idx}
                                className={`px-2 py-1 text-sm inline-flex items-center gap-1.5 cursor-pointer rounded-full ${isActive ? "bg-primary text-slate-50 dark:bg-slate-700 outline outline-offset-1 outline-primary dark:outline-slate-700" : "text-slate-400 hover:text-slate-600 dark:text-slate-500"}`}
                            >
                                <IconComponent className="size-5" />
                                <span>{item.text}</span>
                            </div>
                        );
                    })}
                    {!isLoggedIn() ? (
                        <>
                            <button
                                onClick={handleLoginClick}
                                className="inline-flex gap-0.5 items-center cursor-pointer"
                            >
                                <ArrowRightEndOnRectangleIcon className="size-4" />
                                Login
                            </button>
                            <ActionButton
                                onClick={handleRegisterClick}
                                text="Register"
                                icon={UserCircleIcon}
                                padding="py-1 px-2"
                                theme="primary"
                            />
                        </>
                    ) : (
                        <div
                            onClick={() => navigate(RoutePaths.PROFILE)}
                            className="p-1.5 cursor-pointer inline-flex gap-1 items-center justify-between rounded-full bg-primary dark:bg-slate-700 text-white outline outline-offset-1 outline-primary dark:outline-slate-700"
                        >
                            <img
                                src={UserDP}
                                alt="User DP"
                                className="size-5.5 bg-white rounded-full"
                            />
                            <span>{profile?.firstName}</span>
                            <ActionButton
                                icon={ArrowLeftStartOnRectangleIcon}
                                theme="primary"
                                padding="p-none"
                                onClick={logout}
                            />
                        </div>
                    )}
                    <ActionButton
                        icon={isDarkMode ? SunIcon : MoonIcon}
                        theme="primary"
                        padding="p-1.5"
                        onClick={toggleTheme}
                    />
                </div>
                <div
                    className={`relative w-full md:hidden transition-all duration-100`}
                >
                    <div
                        className={`absolute top-2 shadow-lg bg-slate-100 dark:bg-slate-800 p-4 rounded-b-lg w-full ${openNav ? "block" : "hidden"}`}
                    >
                        <ul className="space-y-2 flex flex-col">
                            {navItems.map((item, idx) => {
                                const IconComponent = item.icon;
                                const isActive =
                                    location.pathname === item.path ||
                                    location.pathname.startsWith(
                                        `${item.path}/`,
                                    );
                                if (!item.roles.includes(principal.roles[0])) {
                                    return;
                                }

                                return (
                                    <li
                                        onClick={() => navigate(item.path)}
                                        key={idx}
                                        className={`py-1.5 px-2 shadow-sm outline outline-offset-1 outline-primary dark:outline-slate-600 inline-flex gap-2 items-center cursor-pointer rounded text-white hover:bg-primary dark:hover:bg-slate-900
                            ${isActive ? "bg-primary dark:bg-slate-900" : "bg-primary/80 dark:bg-slate-900/70"}
                            `}
                                    >
                                        <IconComponent className="size-4.5" />
                                        <span>{item.text}</span>
                                    </li>
                                );
                            })}
                            <hr className="border-slate-500 dark:border-slate-700" />
                            <ul className="inline-flex gap-3 items-center justify-around">
                                {!isLoggedIn() ? (
                                    <>
                                        <li
                                            onClick={handleLoginClick}
                                            className="outline outline-offset-1 outline-primary dark:outline-slate-600 flex-1 py-1.5 px-2 inline-flex gap-2 items-center justify-center cursor-pointer rounded text-white bg-primary/80 dark:bg-slate-900/70 hover:bg-primary dark:hover:bg-slate-900/90"
                                        >
                                            <ArrowRightEndOnRectangleIcon className="size-4.5" />
                                            <span>Login</span>
                                        </li>
                                        <li
                                            onClick={handleRegisterClick}
                                            className="outline outline-offset-1 outline-primary dark:outline-slate-600 flex-1 py-1.5 px-2 inline-flex gap-2 items-center justify-center cursor-pointer rounded text-white bg-primary/80 dark:bg-slate-900/70 hover:bg-primary dark:hover:bg-slate-900/90"
                                        >
                                            <HeartIcon className="size-4.5" />
                                            <span>Register</span>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li className="outline outline-offset-1 outline-primary dark:outline-slate-600 flex-1 py-1.5 px-2 inline-flex gap-2 items-center justify-center cursor-pointer rounded text-white bg-primary/80 dark:bg-slate-900/70 hover:bg-primary dark:hover:bg-slate-900/90">
                                            <img
                                                src={UserDP}
                                                className="size-6 bg-white rounded-full"
                                            />
                                            <span>{profile?.firstName}</span>
                                        </li>
                                        <li
                                            onClick={logout}
                                            className="outline outline-offset-1 outline-primary dark:outline-slate-600 flex-1 py-1.5 px-2 inline-flex gap-2 items-center justify-center cursor-pointer rounded text-white bg-primary/80 dark:bg-slate-900/70 hover:bg-primary dark:hover:bg-slate-900/90"
                                        >
                                            <ArrowLeftStartOnRectangleIcon className="size-4.5" />
                                            <span>Logout</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
