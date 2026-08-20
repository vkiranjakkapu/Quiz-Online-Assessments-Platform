import {
    CheckBadgeIcon,
    ClockIcon,
    InformationCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { AttemptStatus, type Attempt } from "../services/AttemptService";
import BadgeComponent from "./BadgeComponent";
import ActionButton from "./button/ActionButton";
import {
    formatDurationTaken,
    formatIsoDate,
} from "../utils/DateTimeParseHelper";

export default function AttemptInfoCard({ attempt }: { attempt: Attempt }) {
    return (
        <div className="space-y-3 bg-slate-100 dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="inline-flex justify-between items-center w-full">
                {attempt.score == null ? (
                    <BadgeComponent
                        value={AttemptStatus.IN_PROGRESS}
                        type="warning"
                    />
                ) : Number(attempt.score) >=
                  Number(attempt.quiz?.settings?.passingScore) ? (
                    <BadgeComponent value="PASS" type="success" />
                ) : (
                    <BadgeComponent value="FAILED" type="danger" />
                )}
                {(attempt.status === AttemptStatus.IN_PROGRESS ||
                    attempt.status === AttemptStatus.INTERUPTED) && (
                    <ActionButton theme="secondary" text={"Resume Quiz"} />
                )}
            </div>
            <hr className="w-full border border-slate-200 dark:border-slate-700" />
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <InformationCircleIcon className="size-4" />
                    <span className="font-semibold ">Your Score:</span>
                    <span>
                        {`${attempt.score} / ${attempt.quiz.questions
                            ?.map((q) => q.marks)
                            .reduce((q1, q2) => Number(q1) + Number(q2), 0)}`}
                    </span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <CheckBadgeIcon className="size-4" />
                    <span className="font-semibold ">Passing Score:</span>
                    <span>{attempt.quiz.settings?.passingScore}</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <CheckBadgeIcon className="size-4" />
                    <span className="font-semibold ">Correct Answers:</span>
                    <span>{attempt.correctAnswers}</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <XCircleIcon className="size-4" />
                    <span className="font-semibold ">Wrong & UnAttempted:</span>
                    <span>
                        {(attempt.quiz.questions ?? []).length -
                            attempt.correctAnswers}
                    </span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <ClockIcon className="size-4" />
                    <span className="font-semibold ">Time Taken:</span>
                    <span>{formatDurationTaken(attempt.timeSpent)}</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <ClockIcon className="size-4" />
                    <span className="font-semibold ">Attempt Time:</span>
                    <span>{formatIsoDate(attempt.attemptTime)}</span>
                </span>
            </div>
        </div>
    );
}
