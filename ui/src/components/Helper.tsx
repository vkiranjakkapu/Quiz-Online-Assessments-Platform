import {
    CheckBadgeIcon,
    ClockIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { QuizDifficulty, QuizStatus } from "../services/QuizService";

export const renderCellValue = (value: unknown) => {
    if (
        [
            QuizStatus.PUBLISHED.toString(),
            QuizDifficulty.BEGINNER.toString(),
        ].includes(String(value))
    ) {
        return (
            <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckBadgeIcon className="size-3.5 text-emerald-500" />
                {String(value)}
            </span>
        );
    }
    if (
        [
            QuizStatus.DRAFT.toString(),
            QuizDifficulty.INTERMEDIATE.toString(),
        ].includes(String(value))
    ) {
        return (
            <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
                <ClockIcon className="size-3.5 text-amber-500" />
                {String(value)}
            </span>
        );
    }
    if (
        [
            QuizStatus.UN_PUBLISHED.toString(),
            QuizDifficulty.EXPERT.toString(),
        ].includes(String(value))
    ) {
        return (
            <span className="capitalize inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-700 dark:text-rose-400">
                <ExclamationCircleIcon className="size-3.5 text-rose-500" />
                {String(value)}
            </span>
        );
    }

    return String(value ?? "");
};
