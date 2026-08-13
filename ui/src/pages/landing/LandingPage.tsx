import {
    ExclamationTriangleIcon,
    LockClosedIcon,
    LockOpenIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import LoadingPortalComponent from "../../components/LoadingPortalComponent";
import SectionLayout from "../../components/SectionLayout";
import usePrincipal, { AuthStatus } from "../../context/usePrincipal";

export default function LandingPage() {
    const { status, authenticate, getHomeRoute } = usePrincipal();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {
        setError("");
        setLoading(true);

        await authenticate({
            email,
            password,
        })
            .then((resp) => {
                if (resp && "errorMessage" in resp) {
                    setError(resp.errorMessage);
                } else {
                    navigate(getHomeRoute());
                }
            })
            .catch((error) => {
                console.log(error);
            });
        setLoading(false);
    }

    return (
        <>
            <LoadingPortalComponent
                isLoading={status == AuthStatus.AUTHENTICATED}
                message="Preparing your session..."
                subMessage="Please wait while we take you to your dashboard."
            />
            <main className="p-4 mx-auto w-full md:w-4/6">
                <SectionLayout>
                    <div className="grid grid-cols-1 md:grid-cols-2 rounded-lg shadow-sm border border-slate-300 dark:border-slate-700 overflow-hidden">
                        <div className="relative order-1 md:order-2 h-72 md:h-full p-6 overflow-hidden">
                            <div
                                className="absolute inset-0 scale-75 bg-cover bg-center md:bg-center bg-no-repeat"
                                style={{
                                    backgroundImage: `url(/undraw_choose_5kz4.svg)`,
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-slate-600/60 backdrop-blur-xs"></div>
                            <div className="relative flex flex-col h-full justify-center items-center gap-3">
                                <img
                                    src="/favicon.png"
                                    alt="IMS Logo"
                                    className="size-24 outline outline-slate-50 outline-offset-2 rounded-3xl object-cover scale-75"
                                />
                                <h1 className="text-slate-50 text-center font-semibold md:text-2xl">
                                    Quiz & Online Assessments Portal
                                </h1>
                            </div>
                        </div>
                        <div className="p-5 md:p-6 order-2 md:order-1 flex flex-col gap-3">
                            <h1 className="inline-flex items-center gap-1">
                                <LockClosedIcon className="size-5" />
                                <span>SignIn</span>
                            </h1>
                            {error && (
                                <div className="inline-flex w-full gap-2 items-center mb-5 rounded-md border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/50 p-3 text-sm text-rose-700 dark:text-rose-500">
                                    <ExclamationTriangleIcon className="size-4" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <span className="capitalize">email</span>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                className="py-1 px-2 w-full rounded-full border border-slate-300 dark:border-slate-700 outline outline-slate-300 outline-offset-1 dark:outline-slate-600"
                                placeholder="email"
                                type="email"
                                name="email"
                                id="email"
                            />

                            <span className="capitalize">password</span>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                className="py-1 px-2 w-full rounded-full border border-slate-300 dark:border-slate-700 outline outline-slate-300 outline-offset-1 dark:outline-slate-600"
                                placeholder="password"
                                type="password"
                                name="password"
                                id="password"
                            />

                            <hr className="border border-slate-300 dark:border-slate-700" />
                            <ActionButton
                                type="button"
                                text={loading ? "Signing In..." : "Sign In"}
                                onClick={handleLogin}
                                disabled={loading || !password || !email}
                                icon={loading ? LockOpenIcon : LockClosedIcon}
                            />
                        </div>
                    </div>
                </SectionLayout>
            </main>
        </>
    );
}
