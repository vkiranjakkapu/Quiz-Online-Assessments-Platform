import type {
    ButtonHTMLAttributes,
    ForwardRefExoticComponent,
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
    padding?: string;
    onClick?: (e?: unknown) => void;
}

export default function ActionButton({
    text,
    icon: Icon,
    iconAfter,
    padding,
    theme,
    onClick,
}: ActionButtonProps) {
    return (
        <button
            className={`inline-flex gap-1 items-center justify-center outline outline-offset-1 rounded-full cursor-pointer
                    ${
                        theme && theme == "secondary"
                            ? "bg-secondary/95 text-white outline-secondary hover:bg-secondary dark:bg-secondary dark:outline-secondary dark:hover:bg-secondary"
                            : "bg-primary/95 text-white outline-primary hover:bg-primary dark:bg-primary dark:outline-primary dark:hover:bg-primary"
                    }
                ${padding ?? "py-1 px-2"}
                transition-colors duration-75`}
            onClick={onClick}
        >
            {!iconAfter && Icon && <Icon className="size-4.5" />}
            {text}
            {iconAfter && Icon && <Icon className="size-4.5" />}
        </button>
    );
}
