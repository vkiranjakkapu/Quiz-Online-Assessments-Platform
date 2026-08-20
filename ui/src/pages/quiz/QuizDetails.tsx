import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SectionLayout from "../../components/SectionLayout";
import { RoutePaths } from "../../routes/RoutePaths";
import QuizService, { QuizStatus, type Quiz } from "../../services/QuizService";
import QuizCard from "./QuizCard";
import QuizInfoCard from "./QuizInfoCard";
import SpinnerComponent from "../../components/SpinnerComponent";
import AttemptsPage from "../attempts/AttemptsPage";
import type { Attempt } from "../../services/AttemptService";

export default function QuizDetails() {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz>();
    const [similarQuizzes, setSimilarQuizzes] = useState<Quiz[]>([]);

    const [attempts, setAttempts] = useState<Attempt[]>([]);

    const [loading, setLoading] = useState(true);
    const [similarsLoading, setSimilarsLoading] = useState(true);

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
                                        q.status === QuizStatus.UN_PUBLISHED ||
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
                        className={`col-span-full order-1 ${similarQuizzes.length == 0 ? "col-span-full" : "md:col-span-4 lg:col-span-5"}`}
                    >
                        <div className="dark:bg-slate-700/40 shadow-sm  mx-auto p-4 rounded-lg border border-slate-200 dark:border-slate-700 space-y-3">
                            {loading ? (
                                <SpinnerComponent text="Fetching Quiz Details..." />
                            ) : (
                                <QuizInfoCard
                                    key={attempts.length}
                                    quiz={quiz ?? {}}
                                    showAttempt={
                                        attempts.length <
                                        Number(quiz?.settings?.maxAttempts)
                                    }
                                    attemptsLeft={
                                        Number(quiz?.settings?.maxAttempts) -
                                        attempts.length
                                    }
                                />
                            )}
                        </div>
                    </div>

                    <div className="order-2 md:order-3 col-span-full rounded-lg border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                        <AttemptsPage
                            key={quiz?.id}
                            data={{
                                quiz: quiz ?? {},
                                shareAttempts: (attempts) => {
                                    setAttempts(attempts);
                                },
                            }}
                        />
                    </div>

                    {/* Similar Quizzes */}
                    {similarQuizzes.length > 0 && (
                        <div className="col-span-full order-3 md:order-2 md:max-h-[70vh] md:col-span-3 lg:col-span-2 rounded relative overflow-scroll border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="hidden md:block sticky top-0 z-10 bg-slate-100 dark:bg-slate-700 p-2 shadow-sm">
                                <h1 className="font-semibold text-secondary dark:text-slate-100">
                                    Similar quizzes
                                </h1>
                            </div>
                            <div className="flex overflow-x-auto gap-4 md:grid md:grid-cols-1 md:gap-2 p-2">
                                {similarsLoading ? (
                                    <SpinnerComponent text="Getting Similar Quizzes..." />
                                ) : (
                                    <>
                                        {similarQuizzes.map((quiz, idx) => (
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
                                        ))}
                                        <div className="shrink-0 w-1"></div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </SectionLayout>
    );
}
