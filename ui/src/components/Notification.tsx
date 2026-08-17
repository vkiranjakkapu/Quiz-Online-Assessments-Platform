import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
} from "@heroicons/react/24/outline";

export type NotificationProps = {
    type: "success" | "error" | "info";
    messages: string[];
};

export default function Notification({ type, messages }: NotificationProps) {
    return (
        <>
            {messages.length > 0 && (
                <div
                    className={`p-2.5 col-span-full flex flex-row gap-2 items-center dark:text-white text-sm rounded-lg 
                                ${
                                    type == "success"
                                        ? " bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                        : type == "info"
                                          ? " bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"
                                          : " bg-rose-500/10 text-rose-700 dark:text-rose-400"
                                }`}
                >
                    {type == "error" ? (
                        <ExclamationCircleIcon
                            className={`text-rose-500 size-4`}
                        />
                    ) : type == "info" ? (
                        <InformationCircleIcon className="text-primary size-4" />
                    ) : (
                        <CheckCircleIcon className="text-emerald-500 size-4" />
                    )}
                    <span>{messages.join(", ")}</span>
                </div>
            )}
        </>
    );
}
