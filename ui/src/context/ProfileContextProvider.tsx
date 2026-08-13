import { useEffect, useState, type ReactNode } from "react";
import AccountService from "../services/AccountService";
import usePrincipal, { AuthStatus } from "./usePrincipal";
import { ProfileContext, type UserProfile } from "./useProfile";

type ProfileContextProps = {
    children: ReactNode;
};

export default function ProfileContextProvider({
    children,
}: ProfileContextProps) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [profileLoaded, isLoaded] = useState<boolean>(false);
    const { status } = usePrincipal();

    useEffect(() => {
        async function loadProfile() {
            if (status != AuthStatus.AUTHENTICATED) return;
            AccountService.getMyProfile<UserProfile>()
                .then((resp) => {
                    if (resp && !("errorMessage" in resp)) {
                        setProfile(() => ({
                            ...resp,
                            name: `${resp.firstName} ${resp.lastName}`,
                        }));
                        isLoaded(true);
                    } else {
                        isLoaded(false);
                        console.log(resp.errorMessage);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }

        loadProfile();
    }, [status]);

    return (
        <ProfileContext value={{ profile, isLoaded: profileLoaded }}>
            {children}
        </ProfileContext>
    );
}
