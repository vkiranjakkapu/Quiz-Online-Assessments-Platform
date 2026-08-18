import ActionButton, {
    type WithParamActionButtonProps,
} from "../../components/button/ActionButton";
import usePrincipal from "../../context/usePrincipal";

export type UserCardData = {
    id: string;
    dp: string;
    name: string;
    email: string;
    phone: string;
    actionButtons: WithParamActionButtonProps[];
    roles?: string;
};
type UserCardProps = {
    card: UserCardData;
};

export default function UserCard({ card }: UserCardProps) {
    const { principal } = usePrincipal();

    return (
        <div className="text-center">
            <div className="flex flex-col gap-3 p-3 bg-gray-200/50 dark:bg-gray-800/70 rounded border border-slate-200/90 dark:border-slate-600 hover:drop-shadow-xs dark:hover:drop-shadow-gray-700/20">
                <ul className="text-center flex flex-col gap-1">
                    <li>
                        <img
                            src={card.dp}
                            alt="Customer Avatar"
                            width="100px"
                            className="mx-auto my-2 bg-gray-50 rounded-full outline-1 outline-gray-300 outline-offset-2"
                        />
                    </li>
                    <li className="flex flex-col text-center">{card.name}</li>
                    <li className="text-sm min-w-0 w-full px-2">
                        <span
                            className="block truncate max-w-full"
                            title={card.email}
                        >
                            {card.email}
                        </span>
                    </li>
                    <li>{card.phone}</li>
                </ul>
                <div
                    className="inline-flex mx-auto my-1 rounded-lg shadow-sm outline-1 outline-offset-2 outline-primary"
                    role="group"
                >
                    {card.actionButtons &&
                        card.actionButtons.map((btn, idx) => {
                            const isFirst = idx === 0;
                            const isLast =
                                idx === card.actionButtons!.length - 1;
                            const roundedClass =
                                isFirst && isLast
                                    ? "rounded-lg"
                                    : isFirst
                                      ? "rounded-s-lg"
                                      : isLast
                                        ? "rounded-e-lg"
                                        : "";

                            if (
                                card.roles &&
                                !card.roles.includes(principal.roles[0])
                            ) {
                                return;
                            }

                            return (
                                <ActionButton
                                    key={idx}
                                    type="button"
                                    onClick={() => btn.onClick(card.id)}
                                    icon={btn.icon}
                                    className={`px-4 py-2 text-sm font-medium text-white dark:text-white bg-primary/80 hover:bg-primary dark:bg-primary/40 dark:border-primary/50 dark:hover:bg-primary focus:z-10 focus:ring-2 focus:ring-primary cursor-pointer transition-colors 
                                        ${roundedClass}`}
                                />
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
