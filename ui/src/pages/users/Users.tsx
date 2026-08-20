import {
    CalendarDaysIcon,
    EnvelopeIcon,
    FaceSmileIcon,
    GlobeAltIcon,
    MagnifyingGlassIcon,
    MapIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    TrashIcon,
    UserCircleIcon,
    UserPlusIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type SetStateAction,
    type SubmitEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import FemaleProfile from "../../assets/undraw_a-woman-avatar_ifsl.svg";
import MaleProfile from "../../assets/undraw_cool-guy-avatar_qjc4.svg";
import ActionButton from "../../components/button/ActionButton";
import { PaginationButtons } from "../../components/pagination/Pagination";
import usePagination from "../../components/pagination/usePagination";
import SectionLayout from "../../components/SectionLayout";
import useProfile, {
    UserGender,
    type UserProfile,
} from "../../context/useProfile";
import { RoutePaths } from "../../routes/RoutePaths";
import AccountService from "../../services/AccountService";
import UserCard from "./UserCard";
import ModalComponent from "../../components/ModalComponent";
import { InputComponent } from "../../components/form/InputComponent";
import { SelectComponent } from "../../components/form/SelectComponent";
import { RoleType } from "../../context/usePrincipal";
import type { NotificationProps } from "../../components/Notification";
import Notification from "../../components/Notification";
import SpinnerComponent from "../../components/SpinnerComponent";

type AllNotifications = {
    user: NotificationProps;
};

export default function Users() {
    const navigate = useNavigate();

    const { profile } = useProfile();
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [dataFetchProgress, setDataFetchProgress] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(0);

    const [newUser, setNewUser] = useState<UserProfile | null>(null);
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

    const refreshUsers = useCallback(() => {
        AccountService.getAllUsers<UserProfile[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setAllUsers(resp.filter((u) => u.id != profile?.id));
            }
            setDataFetchProgress(false);
        });
    }, [profile]);

    useEffect(() => {
        refreshUsers();
    }, [refreshUsers]);

    const queryProfiles: UserProfile[] = useMemo(() => {
        if (!searchQuery.trim()) return allUsers;
        return allUsers.filter((user) => {
            user = { ...user, name: `${user.firstName} ${user.lastName}` };
            return (
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });
    }, [searchQuery, allUsers]);

    const addNewUser = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            ...newUser,
            name: `${newUser?.firstName} ${newUser?.lastName}`,
            role: newUser?.roles[0],
        };

        AccountService.createUser<UserProfile>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setNotifications("user", {
                    type: "success",
                    messages: ["User created successfully"],
                });
                setSecondsLeft(10);
                refreshUsers();
            } else {
                setNotifications("user", {
                    type: "error",
                    messages:
                        resp.validationErrors.length > 0
                            ? [
                                  ...resp.validationErrors.map(
                                      (ve) => ve.field + " " + ve.message,
                                  ),
                              ]
                            : [resp.errorMessage],
                });
            }
        });

        setInterval(() => {
            if (secondsLeft <= 0) {
                setNewUser(null);
                setOpenModal(!openModal);
                updateNotifications(null);
            }
            setSecondsLeft((prev) => prev - 1);
        }, 1000);
    };

    const deleteUser = useCallback(
        (id: unknown) => {
            AccountService.deleteProfile<{ status: boolean }>(
                id as number,
            ).then((resp) => {
                if (resp && "errorMessage" in resp) {
                    window.alert(resp.errorMessage);
                } else {
                    window.alert("User Deleted Successfully");
                }
                refreshUsers();
            });
        },
        [refreshUsers],
    );

    const userCards = useMemo(() => {
        return queryProfiles.map((user) => ({
            id: user.id,
            dp:
                user.gender == UserGender.MALE
                    ? MaleProfile
                    : user.gender == UserGender.FEMALE
                      ? FemaleProfile
                      : "src/assets/undraw_deep-thinker-avatar_6xg6.svg",
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            phone: user.phone,
            actionButtons: [
                {
                    text: "",
                    icon: PencilIcon,
                    onClick: () =>
                        navigate(
                            RoutePaths.USER_DETAILS.replace(":userId", user.id),
                        ),
                },
                { text: "", icon: TrashIcon, onClick: deleteUser },
            ],
        }));
    }, [queryProfiles, navigate, deleteUser]);

    const {
        currentPage,
        totalPages,
        currentItems: currentUsers,
        goToNextPage,
        goToPrevPage,
    } = usePagination(userCards, 8);

    return (
        <SectionLayout
            title="Users"
            description="All users of the application were listed below"
            actionButtons={[
                {
                    icon: UserPlusIcon,
                    theme: "primary",
                    text: "Register",
                    onClick: () => {
                        setOpenModal(!openModal);
                    },
                },
            ]}
        >
            <ModalComponent
                isOpen={openModal}
                icon={UserPlusIcon}
                title="New User"
                onClose={() => {
                    setOpenModal(!openModal);
                    setNewUser(null);
                }}
                maxWidthClass="max-w-2xl"
            >
                <form
                    onSubmit={addNewUser}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                    {notifications?.user && (
                        <Notification
                            type={notifications?.user.type}
                            messages={notifications?.user.messages}
                        />
                    )}
                    <div className="col-span-full">Type</div>
                    <SelectComponent
                        id="userType"
                        selection={"Role"}
                        label={{ icon: GlobeAltIcon }}
                        options={Object.keys(RoleType).map((g) => ({
                            data: { text: g, value: g },
                        }))}
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        roles: [e.target.value],
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <div className="col-span-full">Info</div>
                    <InputComponent
                        id="firstName"
                        label={{ text: "FN", icon: UserCircleIcon }}
                        placeholder="First Name"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        firstName: e.target.value,
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <InputComponent
                        id="lastName"
                        label={{ text: "LN", icon: UserCircleIcon }}
                        placeholder="Last Name"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        lastName: e.target.value,
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <InputComponent
                        id="email"
                        type="email"
                        label={{ icon: EnvelopeIcon }}
                        placeholder="Email"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        email: e.target.value,
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <InputComponent
                        id="phone"
                        type="number"
                        label={{ icon: PhoneIcon }}
                        onWheel={(e) => (e.target as HTMLInputElement).blur()}
                        onKeyDown={(e) => {
                            if (["e", "E", "-", "+", ".", ","].includes(e.key))
                                e.preventDefault();
                        }}
                        min={1}
                        step={1}
                        placeholder="Phone"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        phone: e.target.value,
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <InputComponent
                        id="dob"
                        type="date"
                        label={{ icon: CalendarDaysIcon, text: "DOB" }}
                        placeholder="DOB"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        dob: e.target.value,
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <SelectComponent
                        id="gender"
                        selection="Gender"
                        label={{ icon: FaceSmileIcon }}
                        options={Object.keys(UserGender).map((g) => ({
                            data: { text: g, value: g },
                        }))}
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        gender: e.target.value,
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <div className="col-span-full">Address</div>
                    <InputComponent
                        id="street"
                        label={{ icon: MapIcon }}
                        placeholder="Street"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        address: {
                                            ...prev?.address,
                                            street: e.target.value,
                                        },
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <InputComponent
                        id="pincode"
                        label={{ icon: MapPinIcon }}
                        placeholder="Pincode"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        address: {
                                            ...prev?.address,
                                            pincode: e.target.value,
                                        },
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <InputComponent
                        id="state"
                        label={{ icon: MapIcon }}
                        placeholder="State"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        address: {
                                            ...prev?.address,
                                            state: e.target.value,
                                        },
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <InputComponent
                        id="country"
                        label={{ icon: GlobeAltIcon }}
                        placeholder="Country"
                        onChange={(e) => {
                            setNewUser(
                                (prev) =>
                                    ({
                                        ...prev,
                                        address: {
                                            ...prev?.address,
                                            country: e.target.value,
                                        },
                                    }) as UserProfile,
                            );
                        }}
                        required
                    />
                    <div className="col-span-full border-t border-slate-200 dark:border-slate-800 w-full">
                        <div className="text-end p-3">
                            <ActionButton
                                type="submit"
                                icon={UserPlusIcon}
                                text={
                                    secondsLeft != 0
                                        ? "Closing in " + secondsLeft
                                        : "Create"
                                }
                                theme="primary"
                                padding="px-1.5 py-0.5 rounded-sm"
                                disabled={secondsLeft != 0}
                            />
                        </div>
                    </div>
                </form>
            </ModalComponent>

            {/* User Cards */}
            <div className="space-y-3">
                {allUsers.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-y-3">
                            <div className="">
                                {/* Search fields */}
                                <div className="inline-flex h-9 w-full rounded shadow-sm overflow-hidden border border-slate-200 dark:border-slate-700">
                                    {/* Title Input */}
                                    <label
                                        htmlFor="filterEmail"
                                        className="bg-slate-200 dark:bg-slate-700 h-full flex items-center p-2"
                                    >
                                        <MagnifyingGlassIcon className="size-4" />
                                    </label>
                                    <input
                                        id="filterEmail"
                                        value={searchQuery ?? ""}
                                        type="text"
                                        placeholder="Search by email"
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="w-full p-1.5"
                                    />
                                    {/* Reset Action Button */}
                                    <ActionButton
                                        resetStyles=""
                                        theme="primary"
                                        padding="py-1 px-2 h-full"
                                        icon={XCircleIcon}
                                        onClick={() => setSearchQuery("")}
                                    />
                                </div>
                            </div>
                            <PaginationButtons
                                theme="primary"
                                currentPage={currentPage}
                                goToPrevPage={goToPrevPage}
                                goToNextPage={goToNextPage}
                                totalPages={totalPages}
                            />
                        </div>
                        <hr className="border border-slate-200 dark:border-slate-700" />
                    </>
                )}
                {dataFetchProgress ? (
                    <SpinnerComponent text="Fetching Users..." />
                ) : currentUsers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {currentUsers.map((cardData, idx) => (
                            <UserCard key={idx} card={cardData} />
                        ))}
                    </div>
                ) : (
                    <h3 className="text-base text-slate-900 dark:text-slate-100 capitalize">
                        {searchQuery != ""
                            ? "0 Users found with given search query"
                            : "No users to display except you there"}
                    </h3>
                )}
            </div>
        </SectionLayout>
    );
}
