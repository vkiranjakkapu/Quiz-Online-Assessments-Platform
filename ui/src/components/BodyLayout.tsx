import type { ReactNode } from "react";
import Navbar from "./Navbar";

export type BodyLayoutProps = {
    children: ReactNode;
};

export default function BodyLayout({ children }: BodyLayoutProps) {
    const handleLogin = () => {
        console.log("Logging In");
    };

    const handleRegister = () => {
        console.log("Registering");
    };

    return (
        <main className="relative min-h-screen bg-slate-200 dark:bg-gray-900 text-slate-600 dark:text-slate-50">
            <Navbar
                handleLoginClick={handleLogin}
                handleRegisterClick={handleRegister}
            />
            {children}
        </main>
    );
}
