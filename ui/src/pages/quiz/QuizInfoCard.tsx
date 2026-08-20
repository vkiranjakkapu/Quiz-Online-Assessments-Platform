import {
    AcademicCapIcon,
    BoltIcon,
    CheckBadgeIcon,
    ClockIcon,
    CursorArrowRaysIcon,
    InformationCircleIcon,
    NumberedListIcon,
    PencilSquareIcon,
    PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { ActionButtonGroup } from "../../components/button/ActionButton";
import { RoutePaths } from "../../routes/RoutePaths";
import BadgeComponent from "../../components/BadgeComponent";
import { useNavigate } from "react-router-dom";
import type { Quiz } from "../../services/QuizService";

export default function QuizInfoCard({
    quiz,
    attemptsLeft,
    showAttempt = false,
}: {
    quiz: Quiz;
    attemptsLeft?: number;
    showAttempt?: boolean;
}) {
    const navigate = useNavigate();

    return (
        <>
            <div className="inline-flex justify-between items-center w-full">
                <div className="text-start">
                    <h1 className="font-semibold text-secondary dark:text-white">
                        {quiz.title}
                    </h1>
                    <span className="text-sm rounded-sm py-1 px-1.5 bg-slate-200 dark:bg-slate-900/80 ">
                        {quiz.category?.name}
                    </span>
                </div>
                {showAttempt && (
                    <ActionButtonGroup
                        padding="px-1 py-0.5"
                        actionButtons={[
                            {
                                icon: PuzzlePieceIcon,
                                text: "Attempt",
                                theme: "primary",
                                onClick: () =>
                                    navigate(
                                        RoutePaths.QUIZ_ATTEMPT.replace(
                                            ":quizId",
                                            quiz.id + "",
                                        ),
                                    ),
                            },
                        ]}
                    />
                )}
            </div>
            <hr className="w-full border border-slate-200 dark:border-slate-700" />
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <InformationCircleIcon className="size-4" />
                    <span className="font-semibold ">Title:</span>
                    <span>{quiz.title}</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <InformationCircleIcon className="size-4" />
                    <span className="font-semibold ">Description:</span>
                    <span>{quiz.description}</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <NumberedListIcon className="size-4" />
                    <span className="font-semibold ">Questions:</span>
                    <span>{quiz.questions?.length} Qs</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <AcademicCapIcon className="size-4" />
                    <span className="font-semibold ">Total Score:</span>
                    <span>
                        {(quiz.questions ?? [])
                            .map((q) => q.marks)
                            .reduce((sum, current) => {
                                return Number(sum) + Number(current);
                            }, 0)}
                    </span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <CheckBadgeIcon className="size-4" />
                    <span className="font-semibold ">Passing Score:</span>
                    <span>{quiz.settings?.passingScore}</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <ClockIcon className="size-4" />
                    <span className="font-semibold ">Duration:</span>
                    <span>{quiz.settings?.maxDuration?.substring(2)}</span>
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <PencilSquareIcon className="size-4" />
                    {attemptsLeft &&
                    attemptsLeft != quiz.settings?.maxAttempts ? (
                        <>
                            <span className="font-semibold ">
                                Attempts Left:
                            </span>
                            <BadgeComponent
                                value={`${attemptsLeft <= 0 ? 0 : attemptsLeft}`}
                                type={attemptsLeft <= 0 ? "warning" : "info"}
                                icon={CursorArrowRaysIcon}
                            />
                        </>
                    ) : (
                        <>
                            <span className="font-semibold ">
                                Allowed Attempts:
                            </span>
                            <BadgeComponent
                                value={quiz.settings?.maxAttempts + ""}
                                // type={"info"}
                                icon={CursorArrowRaysIcon}
                            />
                        </>
                    )}
                </span>
            </div>
            <div className="">
                <span className="inline-flex items-center gap-2">
                    <BoltIcon className="size-4" />
                    <span className="font-semibold ">Difficulty:</span>
                    <BadgeComponent value={quiz.settings?.difficulty ?? ""} />
                </span>
            </div>
        </>
    );
}
