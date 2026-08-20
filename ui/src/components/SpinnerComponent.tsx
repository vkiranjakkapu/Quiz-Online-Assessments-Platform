export default function SpinnerComponent({
    text,
    size,
    customize,
}: {
    text?: string;
    size?: string;
    customize?: string;
}) {
    return (
        <div className="container inline-flex items-center gap-1.5 justify-center">
            <div
                className={`border-2 border-slate-300 border-t-primary animate-spin rounded-full ${size ?? "size-4"}`}
            ></div>
            <span className={`capitalize ${customize}`}>
                {text ?? "Loading..."}
            </span>
        </div>
    );
}
