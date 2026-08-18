import type {
    ForwardRefExoticComponent,
    InputHTMLAttributes,
    LabelHTMLAttributes,
    PropsWithoutRef,
    ReactNode,
    SVGProps,
} from "react";

export interface InputComponentProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: ReactNode;
    id: string;
    label?: LabelComponentProps;
    customize?: string;
}

export interface LabelComponentProps extends LabelHTMLAttributes<HTMLLabelElement> {
    icon?: ForwardRefExoticComponent<
        PropsWithoutRef<SVGProps<SVGSVGElement>> & {
            title?: string;
            titleId?: string;
        }
    >;
    text?: string;
}

export function InputComponent({
    children,
    id,
    label,
    customize,
    ...props
}: InputComponentProps) {
    return (
        <div className="inline-flex min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
            {label && (
                <label
                    htmlFor={id}
                    className="text-sm flex items-center justify-center gap-1 px-2 bg-slate-200/60 dark:bg-slate-700/60"
                    {...label}
                >
                    {label.icon && (
                        <span>
                            <label.icon className="size-4" />
                        </span>
                    )}
                    {label.text && <span>{label?.text}</span>}
                </label>
            )}
            <input
                className={`px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50 w-full dark:disabled:opacity-40 disabled:opacity-80 disabled:cursor-not-allowed ${customize}`}
                id={id}
                {...props}
            />
            {children}
        </div>
    );
}
