import type {
    ButtonHTMLAttributes,
    ForwardRefExoticComponent,
    MouseEvent,
    PropsWithoutRef,
    SVGProps,
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
            {!iconAfter && Icon && <Icon className="size-4.5" />}
            {text}
            {iconAfter && Icon && <Icon className="size-4.5" />}
        </button>
    );
}
