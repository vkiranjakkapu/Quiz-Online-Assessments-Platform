import type {
    ButtonHTMLAttributes,
    ForwardRefExoticComponent,
    MouseEvent,
    PropsWithoutRef,
    SVGProps
} from "react";

export interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    text?: string;
    icon?: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    theme?: "primary" | "secondary";
    iconAfter?: boolean;
    resetStyles?: string;
    padding?: string;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}
export interface WithParamActionButtonProps extends Omit<
    ActionButtonProps,
    "onClick"
> {
    onClick: (id: string) => void;
}

export default function ActionButton({
    text,
    icon: Icon,
    iconAfter,
    resetStyles,
    padding,
    theme,
    onClick,
    ...props
}: ActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`inline-flex gap-1 items-center justify-center cursor-pointer dark:disabled:opacity-40 disabled:opacity-80 disabled:cursor-not-allowed
                ${
                    theme && theme == "secondary"
                        ? "bg-secondary/95 text-white outline-secondary hover:bg-secondary dark:bg-secondary dark:outline-secondary dark:hover:bg-secondary"
                        : theme == "primary"
                          ? "bg-primary/95 text-white outline-primary hover:bg-primary dark:bg-primary dark:outline-primary dark:hover:bg-primary"
                          : ""
                }
                ${padding ?? "py-1 px-2"}
                ${resetStyles ?? "outline outline-offset-2 rounded-full"}
                transition-colors duration-75`}
            {...props}
        >
            {!iconAfter && Icon && <Icon className="size-4" />}
            {text}
            {iconAfter && Icon && <Icon className="size-4" />}
        </button>
    );
}

export type ActionButtonGroupProps = {
    actionButtons: ActionButtonProps[];
    padding?: string;
};

export function ActionButtonGroup({
    actionButtons,
    padding,
}: ActionButtonGroupProps) {
    return (
        <div
            className="inline-flex flex-col rounded-lg shadow-sm outline-1 outline-offset-2 outline-primary md:flex-row"
            role="group"
        >
            {actionButtons?.map((btn, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === actionButtons!.length - 1;
                const roundedClass =
                    isFirst && isLast
                        ? "rounded-lg"
                        : isFirst
                          ? actionButtons.length == 2
                              ? "border-e border-primary rounded-t-lg md:rounded-s-lg md:rounded-tr-none"
                              : "rounded-t-lg md:rounded-s-lg md:rounded-tr-none"
                          : isLast
                            ? "rounded-b-lg md:rounded-e-lg md:rounded-bl-none"
                            : "border-s border-e border-primary";
                return (
                    <ActionButton
                        text={btn.text}
                        icon={btn.icon}
                        onClick={btn.onClick}
                        key={idx}
                        theme={btn.theme}
                        padding={`${roundedClass} ${padding ?? "px-1.5 py-1"}`}
                        resetStyles=""
                    />
                );
            })}
        </div>
    );
}
