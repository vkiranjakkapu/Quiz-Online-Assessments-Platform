import type {
    ForwardRefExoticComponent,
    LabelHTMLAttributes,
    PropsWithoutRef,
    SVGProps,
    TextareaHTMLAttributes,
} from "react";

export interface TextAreaComponentProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
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

export function TextAreaComponent({
    id,
    label,
    customize,
    ...props
}: TextAreaComponentProps) {
    return (
        <div
            className={`inline-flex min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden ${customize}`}
        >
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
            <textarea
                className={`px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50 ${customize}`}
                id={id}
                {...props}
            />
        </div>
    );
}
