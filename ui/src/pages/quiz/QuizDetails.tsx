import {
    AcademicCapIcon,
    BoltIcon,
    CheckBadgeIcon,
    ClockIcon,
    InformationCircleIcon,
    NumberedListIcon,
    PencilSquareIcon,
    PuzzlePieceIcon,
} from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ActionButtonGroup } from "../../components/button/ActionButton";
import SectionLayout from "../../components/SectionLayout";
import { RoutePaths } from "../../routes/RoutePaths";
import QuizService, { QuizStatus, type Quiz } from "../../services/QuizService";
import QuizCard from "./QuizCard";
import BadgeComponent from "../../components/BadgeComponent";

export default function QuizDetails() {
    const { quizId } = useParams<{ quizId: string }>();
    const [quiz, setQuiz] = useState<Quiz>();
    const [similarQuizzes, setSimilarQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [similarsLoading, setSimilarsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSimilarQuizzes = useCallback(
        (categoryId?: number) => {
            QuizService.getAllQuizzesByCategory<Quiz[]>(categoryId)
                .then((resp) => {
                    if (resp && !("errorMessage" in resp)) {
                        setSimilarQuizzes(
                            resp.filter(
                                (q) =>
                                    !(
                                        q.status === QuizStatus.DRAFT ||
                                        q.id === quizId
                                    ),
                            ),
                        );
                    }
                })
                .finally(() => {
                    setSimilarsLoading(false);
                });
        },
        [quizId],
    );

    useEffect(() => {
        QuizService.getQuizById<Quiz>(quizId ?? "")
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setQuiz(resp);
                    setSimilarsLoading(true);
                    fetchSimilarQuizzes(Number(resp.category?.id));
                } else {
                    console.log(resp);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [quizId, fetchSimilarQuizzes]);

    if (
        [
            QuizStatus.DRAFT.toString(),
            QuizStatus.UN_PUBLISHED.toString(),
        ].includes(quiz?.status ?? "")
    ) {
        return <Navigate to={RoutePaths.QUIZZES} replace />;
    }

    return (
        <SectionLayout
            breadCrumbs={[
                {
                    text: "Quizzes",
                    uri: RoutePaths.QUIZZES,
                },
                {
                    text: quiz?.title ?? "loading...",
                    uri: RoutePaths.QUIZ_DETAILS.replace(
                        ":quizId",
                        quizId ?? "",
                    ),
                },
            ]}
            description={`Details about this quiz below`}
        >
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    <div
                        className={`col-span-full ${similarQuizzes.length == 0 ? "col-span-full" : "md:col-span-4 lg:col-span-5"}`}
                    >
                        <div className="dark:bg-slate-700/40 shadow-sm w-full lg:w-4/5 mx-auto p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                            {loading ? (
                                <div className="inline-flex justify-center items-center w-full gap-3">
                                    <div className="h-5 w-5 rounded-full border-2 border-t-primary border-slate-300 animate-spin"></div>
                                    Fetching Quiz Details...
                                </div>
                            ) : (
                                <>
                                    <div className="inline-flex justify-between items-center w-full">
                                        <div className="text-start">
                                            <h1 className="font-semibold text-secondary dark:text-white">
                                                {quiz?.title}
                                            </h1>
                                            <span className="text-sm rounded-sm py-1 px-1.5 bg-slate-200 dark:bg-slate-900/80 ">
                                                {quiz?.category?.name}
                                            </span>
                                        </div>
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
                                                                quizId ?? "",
                                                            ),
                                                        ),
                                                },
                                            ]}
                                        />
                                    </div>
                                    <hr className="w-full border border-slate-200 dark:border-slate-700" />
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <InformationCircleIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Title:
                                            </span>
                                            <span>{quiz?.title}</span>
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <InformationCircleIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Description:
                                            </span>
                                            <span>{quiz?.description}</span>
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <NumberedListIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Questions:
                                            </span>
                                            <span>
                                                {quiz?.questions?.length} Qs
                                            </span>
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <AcademicCapIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Total Score:
                                            </span>
                                            <span>
                                                {(quiz?.questions ?? [])
                                                    .map((q) => q.marks)
                                                    .reduce((sum, current) => {
                                                        return (
                                                            Number(sum) +
                                                            Number(current)
                                                        );
                                                    }, 0)}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <CheckBadgeIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Passing Score:
                                            </span>
                                            <span>
                                                {quiz?.settings?.passingScore}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <ClockIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Duration:
                                            </span>
                                            <span>
                                                {quiz?.settings?.maxDuration?.substring(
                                                    2,
                                                )}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <PencilSquareIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Allowed Attempts:
                                            </span>
                                            <span>
                                                {quiz?.settings?.maxAttempts}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="">
                                        <span className="inline-flex items-center gap-2">
                                            <BoltIcon className="size-4" />
                                            <span className="font-semibold ">
                                                Difficulty:
                                            </span>
                                            <BadgeComponent
                                                value={
                                                    quiz?.settings
                                                        ?.difficulty ?? ""
                                                }
                                            />
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Similar Quizzes */}
                    {similarQuizzes.length > 0 && (
                        <div className="col-span-full md:col-span-3 lg:col-span-2 rounded relative max-h-[70vh] overflow-scroll border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-700 p-2 shadow-sm">
                                <h1 className="font-semibold text-secondary dark:text-slate-100">
                                    Similar quizzes
                                </h1>
                            </div>
                            <div className="grid grid-cols-1 gap-2 p-2">
                                {similarsLoading ? (
                                    <div className=" inline-flex items-center justify-center gap-1">
                                        <div className="h-4 w-4 animate-spin border-2 border-slate-300 border-t-primary rounded-full"></div>
                                        <span>Getting Similar Quizzes...</span>
                                    </div>
                                ) : (
                                    similarQuizzes.map((quiz, idx) => (
                                        <QuizCard
                                            key={idx}
                                            quiz={quiz}
                                            handleAttempt={(id: string) =>
                                                navigate(
                                                    RoutePaths.QUIZ_DETAILS.replace(
                                                        ":quizId",
                                                        id,
                                                    ),
                                                )
                                            }
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SectionLayout>
    );
}
