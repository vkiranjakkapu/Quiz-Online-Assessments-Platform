import {
    CalendarIcon,
    CheckBadgeIcon,
    EnvelopeIcon,
    FaceSmileIcon,
    KeyIcon,
    LockClosedIcon,
    LockOpenIcon,
    PhoneIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import {
    useEffect,
    useState,
    type SetStateAction,
    type SubmitEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActionButton from "../../components/button/ActionButton";
import { InputComponent } from "../../components/form/InputComponent";
import { SelectComponent } from "../../components/form/SelectComponent";
import type { NotificationProps } from "../../components/Notification";
import Notification from "../../components/Notification";
import SectionLayout from "../../components/SectionLayout";
import usePrincipal from "../../context/usePrincipal";
import useProfile, {
    UserGender,
    type UserProfile,
} from "../../context/useProfile";
import { RoutePaths } from "../../routes/RoutePaths";
import AccountService from "../../services/AccountService";

type AllNotifications = {
    profile: NotificationProps;
    password: NotificationProps;
};

export default function Profile() {
    const navigate = useNavigate();
    const { isAdmin } = usePrincipal();
    const { profile } = useProfile();
    const { userId } = useParams<{ userId: string }>();

    const [fetchedUser, setFetchedUser] = useState<UserProfile | null>(null);

    const user = userId ? fetchedUser : profile;

    const [notifications, updateNotifications] =
        useState<AllNotifications | null>({} as AllNotifications);

    function setNotifications<K extends keyof AllNotifications>(
        belongs: K,
        value: SetStateAction<NotificationProps>,
    ) {
        updateNotifications((prev) => {
            const current = prev ?? ({} as AllNotifications);

            const nextValue =
                typeof value === "function"
                    ? (
                          value as (
                              prevVal: NotificationProps,
                          ) => NotificationProps
                      )(current[belongs])
                    : value;

            return {
                ...current,
                [belongs]: nextValue,
            };
        });
    }

    useEffect(() => {
        if (!userId) return;

        if (!isAdmin()) {
            navigate(RoutePaths.PROFILE);
            return;
        }

        AccountService.getUserById<UserProfile>(userId).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setFetchedUser({
                    ...resp,
                    name: `${resp.firstName} ${resp.lastName}`,
                });
            } else {
                setNotifications("profile", {
                    type: "error",
                    messages: [resp.errorMessage],
                });
            }
        });
    }, [userId, isAdmin, navigate]);

    function handleProfileUpdate(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload = {
            ...user,
            name: formData.get("firstName") + " " + formData.get("lastName"),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            phone: formData.get("phone"),
            gender: formData.get("gender"),
            dob: formData.get("dob"),
        } as UserProfile;

        AccountService.updateProfile<UserProfile>(
            String(userId ?? profile?.id),
            payload,
        ).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setFetchedUser({
                    ...resp,
                    name: `${resp.firstName} ${resp.lastName}`,
                });
                setNotifications("profile", {
                    type: "success",
                    messages: ["Profile updated successfully"],
                });
            } else {
                setNotifications("profile", {
                    type: "error",
                    messages: [resp.errorMessage],
                });
            }
        });
    }

    function handlePasswordChange(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const confirmPassword = formData.get("confirmPassword");
        const newPassword = formData.get("newPassword");

        if (newPassword !== confirmPassword) {
            setNotifications("password", {
                type: "error",
                messages: ["Passwords didn't matched!"],
            });
            return;
        }

        const payload = {
            email: user?.email,
            oldPassword: formData.get("oldPassword"),
            newPassword: formData.get("newPassword"),
        };
        AccountService.changePassword<UserProfile>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setNotifications("password", {
                    type: "success",
                    messages: ["Password updated successfully"],
                });
            } else {
                setNotifications("password", {
                    type: "error",
                    messages: resp.validationErrors
                        ? [...resp.validationErrors.map((ve) => ve.message)]
                        : [resp.errorMessage],
                });
            }
        });
    }

    return (
        <SectionLayout
            breadCrumbs={
                userId
                    ? [
                          {
                              text: "Users",
                              uri: RoutePaths.USERS,
                          },
                          {
                              text: user?.name ?? "loading...",
                              uri: RoutePaths.USER_DETAILS,
                          },
                      ]
                    : [
                          {
                              text: "Profile",
                              uri: RoutePaths.USERS,
                          },
                      ]
            }
            description="Edit Your Profile"
        >
            <div className="container space-y-4 mx-auto w-full md:w-full lg:w-4/5">
                <form
                    key={user?.id ?? "loading"} // Default values will now be rendered on async finishes
                    onSubmit={handleProfileUpdate}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    <h1 className="col-span-full font-semibold text-sm">
                        Profile
                    </h1>
                    {notifications?.profile && (
                        <div className="col-span-full">
                            <Notification
                                type={notifications.profile.type}
                                messages={notifications.profile.messages}
                            />
                        </div>
                    )}
                    <InputComponent
                        id="firstName"
                        label={{ icon: UserIcon, text: "First" }}
                        placeholder="enter firstname"
                        name="firstName"
                        customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                        defaultValue={user?.firstName ?? ""}
                        required
                    />
                    <InputComponent
                        id="lastName"
                        label={{ icon: UserIcon, text: "Last" }}
                        placeholder="enter lastname"
                        name="lastName"
                        customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                        defaultValue={user?.lastName ?? ""}
                        required
                    />
                    <InputComponent
                        id="email"
                        type="email"
                        label={{ icon: EnvelopeIcon }}
                        placeholder="enter email"
                        name="email"
                        customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                        defaultValue={user?.email ?? ""}
                        disabled
                        required
                    />
                    <InputComponent
                        id="phone"
                        label={{ icon: PhoneIcon }}
                        placeholder="enter phone"
                        name="phone"
                        customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                        defaultValue={user?.phone ?? ""}
                        required
                    />
                    <InputComponent
                        id="date"
                        type="date"
                        label={{ icon: CalendarIcon }}
                        placeholder="Date Of Birth"
                        name="dob"
                        customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                        defaultValue={user?.dob ?? ""}
                        required
                    />
                    <SelectComponent
                        id="userGender"
                        selection="Gender"
                        label={{ icon: FaceSmileIcon }}
                        options={Object.keys(UserGender).map((g) => ({
                            data: { text: g, value: g },
                        }))}
                        name="gender"
                        customize="bg-slate-50 dark:bg-slate-800 shadow-sm cursor-pointer"
                        defaultValue={user?.gender ?? ""}
                        required
                    />
                    <div className="col-span-full text-end">
                        <ActionButton
                            text="Update"
                            icon={CheckBadgeIcon}
                            theme="primary"
                            padding="px-1.5 py-0.5"
                        />
                    </div>
                </form>
                {!userId && (
                    <>
                        <hr className="border border-slate-200 dark:border-slate-700 w-full" />
                        <form
                            onSubmit={handlePasswordChange}
                            className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-100 dark:bg-slate-800 p-3 rounded border border-slate-200 dark:border-slate-700 shadow-sm"
                        >
                            <h1 className="col-span-full font-semibold text-sm">
                                Password
                            </h1>
                            {notifications?.password && (
                                <div className="col-span-full">
                                    <Notification
                                        type={notifications.password.type}
                                        messages={
                                            notifications.password.messages
                                        }
                                    />
                                </div>
                            )}
                            <InputComponent
                                id="currentPass"
                                label={{ icon: LockOpenIcon }}
                                placeholder="Current Password"
                                name="oldPassword"
                                customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                                required
                            />
                            <div></div>
                            <InputComponent
                                type="password"
                                id="newPassword"
                                label={{ icon: LockClosedIcon }}
                                placeholder="New password"
                                name="newPassword"
                                customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                                onChange={(e) => {
                                    const confirmPass = document.getElementById(
                                        "confirmPassword",
                                    ) as HTMLInputElement;
                                    if (
                                        e.target.value !== "" &&
                                        confirmPass.value !== e.target.value
                                    ) {
                                        setNotifications("password", {
                                            type: "error",
                                            messages: [
                                                "Two Passwords didn't matched!",
                                            ],
                                        });
                                    } else {
                                        setNotifications("password", {
                                            type: "error",
                                            messages: [],
                                        });
                                    }
                                }}
                                required
                            />
                            <InputComponent
                                type="password"
                                id="confirmPassword"
                                label={{ icon: LockClosedIcon }}
                                placeholder="Confirm password"
                                name="confirmPassword"
                                customize="bg-slate-50 dark:bg-slate-800 shadow-sm"
                                onChange={(e) => {
                                    const newPass = document.getElementById(
                                        "newPassword",
                                    ) as HTMLInputElement;
                                    if (
                                        e.target.value !== "" &&
                                        newPass.value !== e.target.value
                                    ) {
                                        setNotifications("password", {
                                            type: "error",
                                            messages: [
                                                "Two Passwords didn't matched!",
                                            ],
                                        });
                                    } else {
                                        setNotifications("password", {
                                            type: "error",
                                            messages: [],
                                        });
                                    }
                                }}
                                required
                            />
                            <div className="col-span-full text-end">
                                <ActionButton
                                    text="Change"
                                    icon={KeyIcon}
                                    theme="primary"
                                    padding="px-1.5 py-0.5"
                                />
                            </div>
                        </form>
                    </>
                )}
            </div>
        </SectionLayout>
    );
}
