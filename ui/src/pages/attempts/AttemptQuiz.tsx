import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    CloudArrowUpIcon,
    SquaresPlusIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type SetStateAction,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import BadgeComponent from "../../components/BadgeComponent";
import ActionButton from "../../components/button/ActionButton";
import type { NotificationProps } from "../../components/Notification";
import Notification from "../../components/Notification";
import SectionLayout from "../../components/SectionLayout";
import useProfile from "../../context/useProfile";
import { RoutePaths } from "../../routes/RoutePaths";
import AttemptService, {
    AttemptStatus,
    SaveProgress,
    type Attempt,
    type AttemptProgress,
} from "../../services/AttemptService";
import type { Question, Quiz } from "../../services/QuizService";
import QuizService from "../../services/QuizService";
import {
    formatSecondsToDisplay,
    parseIsoDurationToSeconds,
} from "../../utils/DurationParseHelper";

type AllNotifications = {
    attempt: NotificationProps;
};

export default function QuizAttempt() {
    const { quizId } = useParams<{ quizId: string }>();
    const { profile } = useProfile();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState<Quiz | null>(null);

    const [startCountDown, setStartCountDown] = useState<number | null>(null);
    const [attemptInProgress, setAttemptInProgress] = useState<boolean>(false);
    const quizStartedRef = useRef(false);
    const [attempt, setAttempt] = useState<AttemptProgress>(
        {} as AttemptProgress,
    );

    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
        null,
    );

    const questionsList = quiz?.questions ?? [];
    const currentQuestionIndex = questionsList.findIndex(
        (q) => String(q.id) === String(selectedQuestion?.id),
    );
    const isFirstQuestion = currentQuestionIndex <= 0;
    const isLastQuestion =
        currentQuestionIndex >= questionsList.length - 1 ||
        questionsList.length === 0;

    const [timeLeftInSeconds, setTimeLeftInSeconds] = useState<number | null>(
        null,
    );
    const [saveProgressStatus, setSaveProgressStatus] = useState<SaveProgress>(
        SaveProgress.SAVED,
    );

    const [notifications, updateNotifications] =
        useState<AllNotifications | null>({} as AllNotifications);

    function setNotifications<K extends keyof AllNotifications>(
        belongs: K,
        value: SetStateAction<NotificationProps>,
    ) {
        updateNotifications((prev) => {
            const current = prev ?? ({} as AllNotifications);

            const nextValue =
                typeof value === "function"
                    ? (
                          value as (
                              prevVal: NotificationProps,
                          ) => NotificationProps
                      )(current[belongs])
                    : value;

            return {
                ...current,
                [belongs]: nextValue,
            };
        });
    }

    const saveQuizProgress = useCallback(
        ({ payload }: { payload: AttemptProgress }) => {
            setSaveProgressStatus(SaveProgress.SAVING);

            AttemptService.saveQuizProgress<Attempt>(payload).then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setSaveProgressStatus(SaveProgress.SAVED);
                    setAttempt((prev) => ({ ...prev, attemptId: resp.id }));
                } else {
                    setSaveProgressStatus(SaveProgress.UN_SAVED);
                    setNotifications("attempt", {
                        type: "error",
                        messages:
                            resp.validationErrors &&
                            resp.validationErrors.length > 0
                                ? [
                                      ...resp.validationErrors.map(
                                          (ve) => `${ve.field} ${ve.message}`,
                                      ),
                                  ]
                                : [resp.errorMessage],
                    });
                }
            });
        },
        [],
    );

    const beginQuiz = useCallback(() => {
        if (!quiz) return;

        const initialAttempt: AttemptProgress = {
            studentId: profile?.id ?? "",
            quizId: quizId ?? "",
            answers: (quiz.questions ?? []).map((question) => ({
                questionId: Number(question.id),
                answerId: null,
            })),
            status: AttemptStatus.IN_PROGRESS,
        };

        setAttemptInProgress(true);
        setAttempt(initialAttempt);
        setSelectedQuestion((quiz.questions ?? [])[0]);
        const totalSecs = parseIsoDurationToSeconds(
            quiz?.settings?.maxDuration,
        );
        setTimeLeftInSeconds(totalSecs);

        saveQuizProgress({ payload: initialAttempt });
    }, [quiz, profile?.id, quizId, saveQuizProgress]);

    useEffect(() => {
        if (startCountDown === null) return;

        const countdownInterval = setInterval(() => {
            setStartCountDown((prev) => {
                if (prev === null) return null;

                if (prev <= 1) {
                    clearInterval(countdownInterval);

                    if (!quizStartedRef.current) {
                        quizStartedRef.current = true;
                        beginQuiz();
                    }
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [startCountDown, quiz?.settings?.maxDuration, beginQuiz]);

    useEffect(() => {
        if (!attemptInProgress || timeLeftInSeconds === null) return;

        if (timeLeftInSeconds <= 0) {
            // Optional: Trigger auto-submit when timer reaches zero
            return;
        }

        const timerInterval = setInterval(() => {
            setTimeLeftInSeconds((prev) =>
                prev !== null && prev > 0 ? prev - 1 : 0,
            );
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [attemptInProgress, timeLeftInSeconds]);

    useEffect(() => {
        QuizService.getQuizById<Quiz>(quizId ?? "").then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setQuiz(resp);
            }
        });
    }, [quizId]);

    const handleQuestionClick = (questionId: number) => {
        const foundQuestion = questionsList.find(
            (q) => String(q.id) === String(questionId),
        );
        if (foundQuestion) {
            setSelectedQuestion(foundQuestion);
        }
    };

    const handleOptionClick = (opId: number) => {
        if (!selectedQuestion) return;

        setAttempt((prev) => ({
            ...prev,
            answers: prev.answers.map((ans) =>
                ans.questionId === Number(selectedQuestion.id)
                    ? { ...ans, answerId: opId }
                    : ans,
            ),
        }));
    };

    const handlePrevQuestion = () => {
        if (!isFirstQuestion) {
            setSelectedQuestion(questionsList[currentQuestionIndex - 1]);
        }
    };

    const handleNextQuestion = () => {
        if (!isLastQuestion) {
            setSelectedQuestion(questionsList[currentQuestionIndex + 1]);
        }
    };

    return (
        <SectionLayout>
            <div className="space-y-3">
                <h1 className="p-2.5 inline-flex flex-col md:flex-row w-full justify-start md:justify-between gap-2 text-secondary dark:text-white shadow-sm border border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900 rounded-lg">
                    <span className="inline-flex items-center gap-2">
                        <ActionButton
                            icon={ArrowLeftIcon}
                            theme="secondary"
                            padding="p-1 rounded-sm"
                            onClick={() =>
                                navigate(
                                    RoutePaths.QUIZ_DETAILS.replace(
                                        ":quizId",
                                        quizId ?? "",
                                    ),
                                )
                            }
                        />
                        <span>{quiz?.title ?? "loading..."}</span>
                    </span>
                    {attemptInProgress && (
                        <div className="space-x-2 flex">
                            <BadgeComponent
                                type="info"
                                value={`${saveProgressStatus === SaveProgress.SAVING ? SaveProgress.SAVING + "..." : SaveProgress.SAVED}`}
                                icon={CloudArrowUpIcon}
                                customize={`${saveProgressStatus === SaveProgress.SAVING ? "animate-pulse" : ""}`}
                            />
                            <ActionButton
                                icon={CheckCircleIcon}
                                theme="secondary"
                                text="Submit"
                                padding="rounded-sm text-sm py-1 px-1.5"
                            />
                        </div>
                    )}
                    {startCountDown !== null && startCountDown !== 0 && (
                        <BadgeComponent
                            type="warning"
                            value={`The Quiz will begin in ${startCountDown}`}
                            icon={ClockIcon}
                            customize="animate-pulse"
                        />
                    )}
                </h1>
                {notifications && notifications.attempt && (
                    <Notification
                        type={notifications.attempt.type}
                        messages={notifications.attempt.messages}
                    />
                )}
                {!attemptInProgress ? (
                    <div className="space-y-2 bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg p-3 shadow-sm">
                        <h4 className="font-semibold">Note:</h4>
                        <ul className="text-sm list-disc list-inside space-y-2">
                            <li>
                                Quiz Will be auto-submitted after{" "}
                                {quiz?.settings?.maxDuration?.substring(2)}
                            </li>
                            <li>Keep an eye on the timer while you answer</li>
                            <li>All the best!</li>
                        </ul>
                        <ActionButton
                            icon={SquaresPlusIcon}
                            theme="secondary"
                            text={`${"Start"}`}
                            padding="rounded-sm w-full text-sm py-1 px-1.5"
                            onClick={() => {
                                setStartCountDown(1);
                            }}
                            disabled={quiz == null ? true : false}
                        />
                    </div>
                ) : (
                    <>
                        <div className="inline-flex flex-col md:flex-row justify-between w-full bg-white border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg p-3 gap-y-3 shadow-sm">
                            {/* Questions Count */}
                            <div className="inline-flex flex-col md:flex-row justify-start md:justify-center gap-3 ">
                                <ActionButton
                                    text={`Answered : ${attempt.answers.filter((a) => a.answerId !== null).length}`}
                                    resetStyles="rounded bg-emerald-500/30 text-xs font-medium text-emerald-700 dark:text-emerald-400 cursor-text"
                                    padding="p-2 md:p-1 md:px-2"
                                />
                                <ActionButton
                                    text={`Un-Answered : ${attempt.answers.filter((a) => a.answerId === null).length}`}
                                    resetStyles="rounded bg-amber-400/30 text-xs font-medium text-amber-700 dark:text-amber-400 cursor-text"
                                    padding="p-2 md:p-1 md:px-2"
                                />
                            </div>

                            {/* Timer */}
                            {timeLeftInSeconds !== null && (
                                <div className="inline-flex items-center justify-center gap-1 text-secondary">
                                    <h1 className="relative">
                                        {timeLeftInSeconds <= 60 && (
                                            <div className="absolute inset-0 bg-amber-100/70 z-0 animate-ping rounded-full"></div>
                                        )}
                                        <BadgeComponent
                                            type={`${timeLeftInSeconds <= 60 ? "warning" : "info"}`}
                                            value={
                                                timeLeftInSeconds !== null
                                                    ? formatSecondsToDisplay(
                                                          timeLeftInSeconds,
                                                      )
                                                    : "00:00"
                                            }
                                            customize="relative z-1"
                                        />
                                    </h1>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3 bg-slate-100 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 rounded-lg p-3 shadow-sm">
                            {/* Question Navigation */}
                            <div className="p-3 rounded-lg flex flex-row gap-2 justify-between align-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                <ActionButton
                                    theme="secondary"
                                    padding="p-0 px-1.5 rounded-sm"
                                    icon={ChevronLeftIcon}
                                    onClick={handlePrevQuestion}
                                    disabled={isFirstQuestion}
                                />
                                <div className="flex-1 inline-flex items-center justify-center gap-3 overflow-scroll">
                                    {attempt.answers.map((ques, idx) => {
                                        const isSelected =
                                            ques.questionId ===
                                            Number(selectedQuestion?.id);

                                        let style =
                                            "rounded size-6.5 bg-amber-400/30 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400";

                                        if (isSelected) {
                                            style =
                                                "rounded size-6.5 bg-cyan-400/30 px-2.5 py-1 text-xs font-medium text-cyan-700 dark:text-cyan-400";
                                        } else if (ques.answerId !== null) {
                                            style =
                                                "rounded size-6.5 bg-emerald-500/30 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400";
                                        }

                                        return (
                                            <ActionButton
                                                key={ques.questionId || idx}
                                                text={`Q${idx + 1}`}
                                                resetStyles={style}
                                                padding="p-2 md:p-1"
                                                onClick={() =>
                                                    handleQuestionClick(
                                                        ques.questionId,
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>
                                <ActionButton
                                    theme="secondary"
                                    padding="p-0 px-1.5 rounded-sm"
                                    iconAfter
                                    icon={ChevronRightIcon}
                                    onClick={handleNextQuestion}
                                    disabled={isLastQuestion}
                                />
                            </div>

                            {/* Question Text */}
                            <p className="p-3 font-semibold rounded-lg text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                                {selectedQuestion?.questionText}
                            </p>

                            {/* Question Options */}
                            <ul className="space-y-2">
                                {selectedQuestion &&
                                    selectedQuestion.options &&
                                    selectedQuestion.options.map((op, idx) => {
                                        const selectedAnswerId =
                                            attempt.answers.find(
                                                (ans) =>
                                                    ans.questionId ===
                                                    Number(
                                                        selectedQuestion?.id,
                                                    ),
                                            )?.answerId;
                                        return (
                                            <li
                                                key={op.id || idx}
                                                className="flex items-center gap-2 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 p-2 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors duration-75"
                                                onClick={() => {
                                                    document
                                                        .getElementById(
                                                            `opt-${op.id}`,
                                                        )
                                                        ?.click();
                                                }}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`answer-${selectedQuestion?.id}`}
                                                    id={`opt-${op.id}`}
                                                    checked={
                                                        selectedAnswerId ===
                                                        Number(op.id)
                                                    }
                                                    onChange={() =>
                                                        handleOptionClick(
                                                            Number(op.id),
                                                        )
                                                    }
                                                />
                                                <label htmlFor={`opt-${op.id}`}>
                                                    {op.optionText}
                                                </label>
                                            </li>
                                        );
                                    })}
                            </ul>

                            {/* Action Buttons */}
                            <div className="space-x-2 text-end">
                                <ActionButton
                                    resetStyles="rounded bg-amber-500/30 text-amber-700 dark:text-amber-400"
                                    icon={XCircleIcon}
                                    text="Clear Answer"
                                    onClick={() => {
                                        if (!selectedQuestion) return;

                                        setAttempt((prev) => ({
                                            ...prev,
                                            answers: prev.answers.map((ans) =>
                                                ans.questionId ===
                                                Number(selectedQuestion.id)
                                                    ? { ...ans, answerId: null }
                                                    : ans,
                                            ),
                                        }));
                                    }}
                                    padding="p-0.5 px-1.5 rounded-sm"
                                    disabled={
                                        attempt.answers.find(
                                            (an) =>
                                                an.questionId ===
                                                Number(selectedQuestion?.id),
                                        )?.answerId === null
                                    }
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </SectionLayout>
    );
}
