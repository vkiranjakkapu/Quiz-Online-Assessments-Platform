import {
    AdjustmentsHorizontalIcon,
    BoltIcon,
    CheckBadgeIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    EllipsisHorizontalIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    ListBulletIcon,
    MagnifyingGlassIcon,
    MegaphoneIcon,
    NumberedListIcon,
    PaperClipIcon,
    PencilSquareIcon,
    PlusCircleIcon,
    SquaresPlusIcon,
    TrashIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type MouseEvent,
    type SetStateAction,
    type SubmitEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/ActionButton";
import { InputComponent } from "../../components/form/InputComponent";
import {
    SelectComponent,
    type OptionElementProps,
} from "../../components/form/SelectComponent";
import { TextAreaComponent } from "../../components/form/TextAreaComponent";
import { renderCellValue } from "../../components/Helper";
import ModalComponent from "../../components/ModalComponent";
import type { NotificationProps } from "../../components/Notification";
import Notification from "../../components/Notification";
import QuizCard from "../../components/QuizCard";
import SectionLayout from "../../components/SectionLayout";
import usePrincipal from "../../context/usePrincipal";
import { RoutePaths } from "../../routes/RoutePaths";
import QuizService, {
    QuestionDifficulty,
    QuizDifficulty,
    QuizStatus,
    type Category,
    type Question,
    type QuestionOption,
    type Quiz,
} from "../../services/QuizService";

export type AllNotifications = {
    form: NotificationProps;
    questions: NotificationProps;
};

export type QuizSearchProps = {
    title?: string;
    category?: string;
    status?: QuizStatus;
};

export default function Quizzes() {
    const { isAdmin } = usePrincipal();
    const navigate = useNavigate();

    const [modalState, toggleModalState] = useState(false);

    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
    const [searchQuery, setSearchQuery] = useState<QuizSearchProps | null>(
        null,
    );

    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
        null,
    );

    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState(false);

    const [loadingStatus, setLoadingStatus] = useState<boolean | null>(true);

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

    const refreshQuizzes = useCallback(() => {
        QuizService.getAllQuizzes<Quiz[]>()
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setAllQuizzes(resp);
                } else {
                    console.log(resp.errorMessage);
                }
            })
            .finally(() => {
                setLoadingStatus(false);
            });
    }, []);

    const filteredQuizzes: Quiz[] = useMemo(() => {
        if (!searchQuery) return allQuizzes;

        return allQuizzes.filter((q) => {
            // Title Filter
            const matchesTitle = searchQuery.title
                ? q.title
                      ?.toLowerCase()
                      .includes(searchQuery.title.trim().toLowerCase())
                : true;

            // Category Filter
            const matchesCategory = searchQuery.category
                ? String(q.category?.id) === String(searchQuery.category)
                : true;

            // Status Filter
            const matchesStatus = searchQuery.status
                ? q.status === searchQuery.status
                : true;

            return matchesTitle && matchesCategory && matchesStatus;
        });
    }, [searchQuery, allQuizzes]);

    const refreshCategories = useCallback(() => {
        QuizService.getAllCategories<Category[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setCategories(resp);
            } else {
                console.log(resp.errorMessage);
            }
        });
    }, []);

    useEffect(() => {
        refreshQuizzes();
        refreshCategories();
    }, [refreshQuizzes, refreshCategories]);

    const updateQuestionField = <K extends keyof Question>(
        field: K,
        value: Question[K],
    ) => {
        if (!selectedQuestion) return;

        const updatedQuestion = { ...selectedQuestion, [field]: value };
        setSelectedQuestion(updatedQuestion);
        updateQuestion(updatedQuestion);
    };

    const updateOptionField = (
        optionId: unknown,
        field: "optionText" | "isCorrect",
        value: string | boolean,
    ) => {
        if (!selectedQuestion) return;

        const updatedOptions = (selectedQuestion.options ?? []).map((opt) =>
            opt.id === optionId ? { ...opt, [field]: value } : opt,
        );

        const updatedQuestion = {
            ...selectedQuestion,
            options: updatedOptions,
        };
        setSelectedQuestion(updatedQuestion);
        updateQuestion(updatedQuestion);
    };

    const updateQuestion = (updatedQuestion: Question) => {
        setSelectedQuiz((prev) => ({
            ...prev,
            questions: [
                ...(prev?.questions ?? []).map((q) =>
                    q.id === updatedQuestion.id ? updatedQuestion : q,
                ),
            ],
        }));
    };

    const createQuiz = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedQuiz || !validRequest(selectedQuiz)) {
            return;
        }

        const payload = prepareRequest();

        if (selectedQuiz.id) {
            updateQuiz(payload);
            return;
        }

        QuizService.createQuiz<Quiz>(payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setSelectedQuiz(resp);
                setSecondsLeft(10);
                setNotifications("form", {
                    type: "success",
                    messages: [
                        `Quiz ${selectedQuiz?.status === QuizStatus.DRAFT ? "'draft'" : ``} has been created successfully.`,
                    ],
                });
                setLoadingStatus(true);
                refreshQuizzes();

                const intervalId = setInterval(() => {
                    setSecondsLeft((prev) => {
                        if (prev <= 1) {
                            setSelectedQuiz(null);
                            clearInterval(intervalId);
                            toggleModalState(false);
                            updateNotifications(null);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => {
                    clearInterval(intervalId);
                };
            } else {
                setNotifications("form", {
                    type: "error",
                    messages: [resp.errorMessage],
                });
            }
        });
    };

    const updateQuiz = (quiz?: Quiz) => {
        const payload = quiz ?? prepareRequest();

        QuizService.updateQuiz<Quiz>(selectedQuiz?.id, payload).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setSelectedQuiz(resp);
                setSecondsLeft(10);
                setNotifications("form", {
                    type: "success",
                    messages: [
                        `Quiz ${selectedQuiz?.status === QuizStatus.DRAFT ? "'draft'" : ``} has been updated successfully.`,
                    ],
                });
                setLoadingStatus(true);
                refreshQuizzes();

                const intervalId = setInterval(() => {
                    setSecondsLeft((prev) => {
                        if (prev <= 1) {
                            setSelectedQuiz(null);
                            clearInterval(intervalId);
                            toggleModalState(false);
                            updateNotifications(null);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);

                return () => {
                    clearInterval(intervalId);
                };
            } else {
                setNotifications("form", {
                    type: "error",
                    messages: [resp.errorMessage],
                });
            }
        });
    };

    const editQuiz = (quiz: Quiz) => {
        updateNotifications(null);
        setSelectedQuiz(quiz);
        setSelectedQuestion((quiz.questions ?? [])[0] ?? null);
        toggleModalState(!modalState);
    };

    const updateQuizStatus = (quiz: Quiz) => {
        if (quiz.status == QuizStatus.DRAFT) {
            const copy: Quiz = { ...quiz, status: QuizStatus.PUBLISHED };
            if (!validRequest(copy)) {
                setSelectedQuiz(quiz);
                setSelectedQuestion((quiz.questions ?? [])[0] ?? null);
                toggleModalState(!modalState);
                return;
            }
        }

        const status =
            quiz.status == QuizStatus.PUBLISHED
                ? QuizStatus.UN_PUBLISHED
                : QuizStatus.PUBLISHED;

        QuizService.updateQuizStatus<Quiz>(quiz.id, { status }).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                window.alert(
                    `Quiz status has been successfully updated to '${status}'.`,
                );
                refreshQuizzes();
            } else {
                window.alert(resp.errorMessage);
            }
        });
    };

    const deleteQuiz = (quizId: string) => {
        QuizService.deleteQuiz<Quiz>(quizId).then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                window.alert(`Quiz has been successfully deleted.`);
                refreshQuizzes();
            } else {
                window.alert(resp.errorMessage);
            }
        });
    };

    function prepareRequest(): Quiz {
        if (!selectedQuiz) return {} as Quiz;

        const isTempId = (id?: string) => !id || /^\d{13}$/.test(id);

        return {
            ...selectedQuiz,
            questions: (selectedQuiz.questions ?? []).map((q) => {
                const questionId = isTempId(q.id) ? undefined : q.id;

                return {
                    ...(questionId ? { id: questionId } : {}),
                    questionText: q.questionText ?? "",
                    explanation: q.explanation ?? "",
                    marks: q.marks ?? 1,
                    difficulty: q.difficulty,
                    options: (q.options ?? []).map((opt) => {
                        const optionId = isTempId(opt.id) ? undefined : opt.id;
                        return {
                            ...(optionId ? { id: optionId } : {}),
                            optionText: opt.optionText ?? "",
                            isCorrect: Boolean(opt.isCorrect),
                        };
                    }),
                } as Question;
            }),
        };
    }

    function validRequest(quiz: Quiz): boolean {
        updateNotifications(null);

        const quizErrors: string[] = [];
        const formErrors: string[] = [];

        if (
            !quiz?.id &&
            categories.filter(
                (c) =>
                    c.name?.toLowerCase() ===
                    (quiz?.category?.name ?? "").toLowerCase(),
            ).length !== 0
        ) {
            formErrors.push("Category already exists!");
        }

        if (quiz?.status === QuizStatus.PUBLISHED) {
            const targetQuestions = quiz.questions ?? [];

            if (targetQuestions.length === 0) {
                formErrors.push(
                    "Quiz without Questions is not allowed to be published. Use DRAFT instead.",
                );
            } else {
                const quesWithZeroOptions = targetQuestions
                    .map((q, index) =>
                        !q.options || q.options.length === 0
                            ? index
                            : undefined,
                    )
                    .filter((v): v is number => v !== undefined);

                if (quesWithZeroOptions.length > 0) {
                    quizErrors.push(
                        `Options not added for [${quesWithZeroOptions.map((i) => "Q" + (i + 1)).join(", ")}].`,
                    );
                }

                const optionsWithNoCorrectAnswer = targetQuestions
                    .map((q, index) => {
                        if (quesWithZeroOptions.includes(index))
                            return undefined;
                        if (
                            q.options &&
                            q.options.filter((o) => o.isCorrect).length === 0
                        ) {
                            return index;
                        }
                        return undefined;
                    })
                    .filter((v): v is number => v !== undefined);

                if (optionsWithNoCorrectAnswer.length > 0) {
                    quizErrors.push(
                        `Correct Option not provided for [${optionsWithNoCorrectAnswer.map((i) => "Q" + (i + 1)).join(", ")}].`,
                    );
                }

                const totalScore = targetQuestions
                    .map((q) => q.marks ?? 0)
                    .reduce((sum, current) => sum + current, 0);

                if (totalScore < Number(quiz.settings?.passingScore)) {
                    quizErrors.push(
                        `Total Marks (${totalScore}) is below the Passing Score (${quiz.settings?.passingScore}).`,
                    );
                }
            }
        }

        let hasErrors = false;

        if (quizErrors.length !== 0) {
            setNotifications("questions", {
                type: "error",
                messages: quizErrors,
            });
            hasErrors = true;
        }

        if (formErrors.length !== 0) {
            setNotifications("form", {
                type: "error",
                messages: formErrors,
            });
            hasErrors = true;
        }

        return !hasErrors;
    }

    const addQuestion = (e?: MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();

        const newQuestion: Question = {
            id: String(Date.now()),
            quiz: {} as Quiz,
            questionText: "",
            marks: 1,
            explanation: "",
            difficulty: QuestionDifficulty.BEGINNER,
            options: [],
        };

        setSelectedQuiz((prev) => ({
            ...prev,
            questions: [...(prev?.questions ?? []), newQuestion],
        }));
        setSelectedQuestion(newQuestion);
    };

    const deleteQuestion = () => {
        const updatedQuestions = (selectedQuiz?.questions ?? []).filter(
            (qu) => qu.id !== selectedQuestion?.id,
        );

        setSelectedQuiz((prev) => ({
            ...prev,
            questions: updatedQuestions,
        }));

        const nextQuestion = updatedQuestions[0] || null;
        setSelectedQuestion(nextQuestion);
    };

    const addOption = (e?: MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        if (!selectedQuestion) return;

        const newOption: QuestionOption = {
            id: String(Date.now()),
            optionText: "",
            isCorrect: false,
        };

        const updatedQuestion: Question = {
            ...selectedQuestion,
            options: [...(selectedQuestion.options ?? []), newOption],
        } as Question;

        setSelectedQuiz((prev) => ({
            ...prev,
            questions: [
                ...(prev?.questions ?? []).map((q) =>
                    q.id == selectedQuestion?.id ? updatedQuestion : q,
                ),
            ],
        }));

        setSelectedQuestion((prev) =>
            prev
                ? {
                      ...prev,
                      options: [...(prev.options ?? []), newOption],
                  }
                : null,
        );
    };

    const deleteOption = (optionId: string) => {
        const updatedQuestion: Question = {
            ...selectedQuestion,
            options: [
                ...(selectedQuestion?.options ?? []).filter(
                    (op) => op.id != optionId,
                ),
            ],
        };
        setSelectedQuestion(updatedQuestion);

        setSelectedQuiz((prev) => ({
            ...prev,
            questions: [
                ...(prev?.questions ?? []).filter(
                    (qu) => qu.id != selectedQuestion?.id,
                ),
                updatedQuestion,
            ],
        }));
    };

    return (
        <SectionLayout
            title="Quizzes"
            description="All quizzes were listed below"
            actionButtons={
                isAdmin()
                    ? [
                          {
                              text: "New Quiz",
                              type: "button",
                              icon: SquaresPlusIcon,
                              theme: "primary",
                              onClick: () => toggleModalState(!modalState),
                          },
                      ]
                    : []
            }
        >
            <ModalComponent
                icon={SquaresPlusIcon}
                title="Create Quiz"
                isOpen={modalState}
                onClose={() => toggleModalState(!modalState)}
                maxWidthClass="max-w-6xl"
            >
                <form
                    onSubmit={createQuiz}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                    {notifications && notifications.form && (
                        <Notification
                            type={notifications.form.type}
                            messages={notifications.form.messages}
                        />
                    )}
                    <div className="p-2.5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex flex-col">
                        <h1 className="text-sm font-semibold inline-flex w-full items-center gap-1 text-secondary dark:text-slate-100">
                            <InformationCircleIcon className="size-4" />
                            Quiz
                        </h1>
                        <hr className="border border-slate-200 dark:border-slate-700/50" />
                        <div className="grid grid-cols-1 gap-2">
                            <InputComponent
                                id="title"
                                type="text"
                                label={{
                                    icon: InformationCircleIcon,
                                    text: "Title",
                                }}
                                defaultValue={selectedQuiz?.title}
                                placeholder="Quiz title"
                                onChange={(e) =>
                                    setSelectedQuiz((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                customize="w-full"
                                required
                            />
                            <div
                                className={`space-y-2 ${newCategory ? "bg-slate-200/30 border border-slate-200 shadow-sm dark:border-slate-700 dark:bg-slate-900 p-2" : ""} rounded`}
                            >
                                {newCategory && (
                                    <div className="text-sm font-semibold text-secondary dark:text-slate-200 gap-1 flex flex-col items-center justify-start md:flex-row md:justify-between px-2 bg-slate-50 dark:bg-slate-700/60 rounded py-1">
                                        <span>Create New Category</span>
                                        <span>(OR)</span>
                                        <ActionButton
                                            type="button"
                                            text="Select"
                                            icon={
                                                newCategory
                                                    ? ListBulletIcon
                                                    : PlusCircleIcon
                                            }
                                            padding="px-2 m-0.5 rounded"
                                            theme="secondary"
                                            // resetStyles=""
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedQuiz((prev) => ({
                                                    ...prev,
                                                    category: {},
                                                }));
                                                setNewCategory(!newCategory);
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="inline-flex w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                    <label
                                        htmlFor="category"
                                        className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60"
                                    >
                                        <PaperClipIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                        {!newCategory && <span>Category</span>}
                                    </label>
                                    {newCategory ? (
                                        <input
                                            type="text"
                                            onChange={(e) => {
                                                setSelectedQuiz((prev) => ({
                                                    ...prev,
                                                    category: {
                                                        ...prev?.category,
                                                        name: e.target.value,
                                                    },
                                                }));
                                            }}
                                            value={
                                                selectedQuiz?.category?.name ??
                                                ""
                                            }
                                            id="category"
                                            className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
                                            placeholder="New Category"
                                            required
                                        />
                                    ) : (
                                        <select
                                            onChange={(e) =>
                                                setSelectedQuiz((prev) => ({
                                                    ...prev,
                                                    category: {
                                                        id: e.target.value,
                                                    },
                                                }))
                                            }
                                            id="category"
                                            className="flex-1 px-1 dark:bg-slate-900/50"
                                            value={
                                                selectedQuiz?.category?.id ?? ""
                                            }
                                            required
                                        >
                                            <option value="">Select</option>
                                            {categories.map((cat) => (
                                                <option
                                                    key={cat.id}
                                                    value={cat.id}
                                                >
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                    {!newCategory && (
                                        <ActionButton
                                            type="button"
                                            icon={
                                                newCategory
                                                    ? ListBulletIcon
                                                    : PlusCircleIcon
                                            }
                                            padding="px-2 m-0.5 rounded-e"
                                            theme="secondary"
                                            resetStyles=""
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSelectedQuiz((prev) => ({
                                                    ...prev,
                                                    category: {},
                                                }));
                                                setNewCategory(!newCategory);
                                            }}
                                        />
                                    )}
                                </div>
                                {newCategory && (
                                    <TextAreaComponent
                                        id="catDescription"
                                        label={{ icon: PencilSquareIcon }}
                                        rows={2}
                                        onChange={(e) => {
                                            setSelectedQuiz((prev) => ({
                                                ...prev,
                                                category: {
                                                    ...prev?.category,
                                                    description: String(
                                                        e.target.value,
                                                    ),
                                                },
                                            }));
                                        }}
                                        value={
                                            selectedQuiz?.category
                                                ?.description ?? ""
                                        }
                                        customize="w-full"
                                        placeholder="Category Description"
                                        required
                                    />
                                )}
                            </div>
                            <TextAreaComponent
                                id="description"
                                label={{
                                    icon: InformationCircleIcon,
                                    text: "Description",
                                }}
                                rows={2}
                                onChange={(e) => {
                                    setSelectedQuiz((prev) => ({
                                        ...prev,
                                        description: String(e.target.value),
                                    }));
                                }}
                                customize="w-full"
                                value={selectedQuiz?.description ?? ""}
                                placeholder="Quiz Description"
                                required
                            />
                            <SelectComponent
                                id="status"
                                options={
                                    Object.keys(QuizStatus).map((status) => ({
                                        data: { text: status, value: status },
                                    })) as OptionElementProps[]
                                }
                                label={{
                                    icon: MegaphoneIcon,
                                    text: "Publish?",
                                }}
                                onChange={(e) =>
                                    setSelectedQuiz((prev) => ({
                                        ...prev,
                                        status: e.target.value as QuizStatus,
                                    }))
                                }
                                customize="w-full"
                                value={selectedQuiz?.status ?? ""}
                                required
                            />
                            {selectedQuiz?.status && (
                                <div
                                    className={`p-1 shadow-sm text-center rounded w-full ${selectedQuiz.status == QuizStatus.PUBLISHED ? "bg-secondary/30 text-emerald-700 dark:text-slate-200" : "bg-orange-100 text-orange-700"}`}
                                >
                                    <span>
                                        {selectedQuiz.status == QuizStatus.DRAFT
                                            ? "Saving as an unpublished draft."
                                            : selectedQuiz.status ==
                                                QuizStatus.UN_PUBLISHED
                                              ? "This quiz won't be available to attempt."
                                              : "This quiz will be available to attempt."}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-2.5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex flex-col">
                        <h1 className="text-sm font-semibold inline-flex w-full items-center gap-1 text-secondary dark:text-slate-100">
                            <AdjustmentsHorizontalIcon className="size-4" />
                            Settings
                        </h1>
                        <hr className="border border-slate-200 dark:border-slate-700/50" />
                        <div className="grid grid-cols-1 gap-2">
                            <InputComponent
                                type="number"
                                id="passingScore"
                                label={{ icon: CheckBadgeIcon, text: "Pass" }}
                                onWheel={(e) =>
                                    (e.target as HTMLInputElement).blur()
                                }
                                onKeyDown={(e) => {
                                    if (
                                        ["e", "E", "-", "+", ".", ","].includes(
                                            e.key,
                                        )
                                    )
                                        e.preventDefault();
                                }}
                                onChange={(e) => {
                                    setSelectedQuiz((prev) => ({
                                        ...prev,
                                        settings: {
                                            ...prev?.settings,
                                            passingScore: e.target.value,
                                        },
                                    }));
                                }}
                                value={
                                    selectedQuiz?.settings?.passingScore ?? ""
                                }
                                pattern="\d*"
                                min="1"
                                step="1"
                                placeholder="Passing Score"
                                customize="w-full"
                                required
                            />
                            <InputComponent
                                type="number"
                                label={{ icon: ClockIcon, text: "Duration" }}
                                onWheel={(e) =>
                                    (e.target as HTMLInputElement).blur()
                                }
                                onKeyDown={(e) => {
                                    if (
                                        ["e", "E", "-", "+", ".", ","].includes(
                                            e.key,
                                        )
                                    )
                                        e.preventDefault();
                                }}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const typeSelect = document.getElementById(
                                        "durationType",
                                    ) as HTMLSelectElement;
                                    const type =
                                        typeSelect?.value === "hours"
                                            ? "H"
                                            : "M";

                                    setSelectedQuiz((prev) => ({
                                        ...prev,
                                        settings: {
                                            ...prev?.settings,
                                            maxDuration: val
                                                ? `PT${val}${type}`
                                                : "",
                                        },
                                    }));
                                }}
                                value={
                                    selectedQuiz?.settings?.maxDuration
                                        ? selectedQuiz.settings?.maxDuration.substring(
                                              2,
                                              selectedQuiz.settings?.maxDuration
                                                  .length - 1,
                                          )
                                        : ""
                                }
                                id="maxDuration"
                                pattern="\d*"
                                min="1"
                                step="1"
                                placeholder="Enter Duration"
                                required
                                customize="w-full"
                            >
                                <select
                                    name="durationType"
                                    onChange={(e) => {
                                        const input = document.getElementById(
                                            "maxDuration",
                                        ) as HTMLInputElement;
                                        const val = input?.value;
                                        const type =
                                            e.target.value === "hours"
                                                ? "H"
                                                : "M";

                                        setSelectedQuiz((prev) => ({
                                            ...prev,
                                            settings: {
                                                ...prev?.settings,
                                                maxDuration: val
                                                    ? `PT${val}${type}`
                                                    : "",
                                            },
                                        }));
                                    }}
                                    value={
                                        selectedQuiz?.settings?.maxDuration
                                            ? selectedQuiz?.settings?.maxDuration
                                                  ?.split("")
                                                  .pop()
                                                  ?.toLowerCase() == "h"
                                                ? "hours"
                                                : "minutes"
                                            : ""
                                    }
                                    id="durationType"
                                    className="bg-secondary text-white align-middle cursor-pointer px-1 m-0.5 rounded"
                                    required
                                >
                                    <option value="">Select</option>
                                    <option value="hours">Hours</option>
                                    <option value="minutes">Mins</option>
                                </select>
                            </InputComponent>
                            <InputComponent
                                label={{
                                    icon: PencilSquareIcon,
                                    text: "Attempts",
                                }}
                                type="number"
                                onWheel={(e) =>
                                    (e.target as HTMLInputElement).blur()
                                }
                                onKeyDown={(e) => {
                                    if (
                                        ["e", "E", "-", "+", ".", ","].includes(
                                            e.key,
                                        )
                                    )
                                        e.preventDefault();
                                }}
                                value={
                                    selectedQuiz?.settings?.maxAttempts ?? ""
                                }
                                onChange={(e) => {
                                    setSelectedQuiz((prev) => ({
                                        ...prev,
                                        settings: {
                                            ...prev?.settings,
                                            maxAttempts: Number(e.target.value),
                                        },
                                    }));
                                }}
                                id="maxAttempts"
                                pattern="\d*"
                                min="1"
                                step="1"
                                customize="w-full"
                                placeholder="Attempts Allowed"
                                required
                            />
                            <SelectComponent
                                label={{ icon: BoltIcon, text: "Difficulty" }}
                                options={Object.keys(QuizDifficulty).map(
                                    (dif) => ({
                                        data: { text: dif, value: dif },
                                    }),
                                )}
                                onChange={(e) =>
                                    setSelectedQuiz((prev) => ({
                                        ...prev,
                                        settings: {
                                            ...prev?.settings,
                                            difficulty: e.target
                                                .value as QuizDifficulty,
                                        },
                                    }))
                                }
                                id="quizDifficulty"
                                customize="w-full"
                                value={selectedQuiz?.settings?.difficulty ?? ""}
                                required
                            />
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="p-2.5 col-span-full shadow-sm border border-slate-200 dark:border-slate-700 space-y-2 rounded-lg bg-slate-50 dark:bg-slate-800 flex flex-col">
                        <h1 className="text-sm font-semibold w-full inline-flex items-center justify-between gap-1 text-secondary dark:text-slate-100">
                            <span className="inline-flex items-center gap-1">
                                <NumberedListIcon className="size-4" />
                                Add Questions to Quiz
                            </span>
                            <ActionButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    addQuestion();
                                }}
                                type="button"
                                text="Add Question"
                                theme="secondary"
                                icon={PlusCircleIcon}
                                padding="p-1 rounded-sm"
                            />
                        </h1>
                        {/* Questions */}
                        {selectedQuiz?.questions &&
                            selectedQuiz?.questions.length > 0 && (
                                <>
                                    {notifications &&
                                        notifications.questions && (
                                            <>
                                                <hr className="border border-slate-200 dark:border-slate-700/50" />
                                                <Notification
                                                    type={
                                                        notifications.questions
                                                            .type
                                                    }
                                                    messages={
                                                        notifications.questions
                                                            .messages
                                                    }
                                                />
                                            </>
                                        )}
                                    <hr className="col-span-full border border-slate-200 dark:border-slate-700/50" />
                                    <div className="grid grid-cols-1 gap-2">
                                        {/* Question Buttons */}
                                        <div className="overflow-x-scroll">
                                            <div className="inline-flex gap-1 items-center text-sm">
                                                {selectedQuiz?.questions
                                                    .length > 0 &&
                                                    selectedQuiz?.questions.map(
                                                        (question, idx) => (
                                                            <ActionButton
                                                                key={idx}
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.preventDefault();
                                                                    setSelectedQuestion(
                                                                        (
                                                                            selectedQuiz?.questions ??
                                                                            []
                                                                        ).filter(
                                                                            (
                                                                                q,
                                                                            ) =>
                                                                                q.id ==
                                                                                question.id,
                                                                        )[0],
                                                                    );
                                                                }}
                                                                text={String(
                                                                    "Q" +
                                                                        Number(
                                                                            idx +
                                                                                1,
                                                                        ),
                                                                )}
                                                                type="button"
                                                                resetStyles={`rounded size-6.5 ${selectedQuestion?.id == question.id ? `bg-secondary text-white` : `bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-700`}`}
                                                            />
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                        <hr className="col-span-full border border-slate-200 dark:border-slate-700/50" />

                                        {/* Question Details */}
                                        <div className="space-y-3 p-3 dark:bg-slate-900/50 rounded-lg">
                                            <h1 className="text-sm font-semibold shadow-md p-2 bg-slate-100 dark:bg-slate-800 text-secondary dark:text-slate-100 rounded w-full inline-flex items-center justify-between gap-1">
                                                <span className="inline-flex items-center gap-1">
                                                    <span>(Q)</span>
                                                    <span>Question</span>
                                                </span>
                                                <ActionButton
                                                    onClick={() => {
                                                        deleteQuestion();
                                                    }}
                                                    type="button"
                                                    text="Delete"
                                                    icon={TrashIcon}
                                                    resetStyles="rounded-sm bg-rose-800 text-white hover:bg-rose-900 transition-colors duration-75"
                                                />
                                            </h1>
                                            <div className="w-full min-h-9 dark:text-slate-300 inline-flex shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                                <label
                                                    htmlFor="question"
                                                    className="text-sm flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60"
                                                >
                                                    Question
                                                </label>
                                                <textarea
                                                    rows={1}
                                                    onChange={(e) =>
                                                        updateQuestionField(
                                                            "questionText",
                                                            e.target.value,
                                                        )
                                                    }
                                                    value={
                                                        selectedQuestion?.questionText ??
                                                        ""
                                                    }
                                                    name="question"
                                                    id="question"
                                                    className="flex-4/5 p-1.5 text-slate-700 dark:text-slate-200"
                                                    placeholder="Enter Question"
                                                    required
                                                />
                                            </div>
                                            <div className="w-full min-h-9 dark:text-slate-300 inline-flex shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                                <label
                                                    htmlFor="explanation"
                                                    className="text-sm flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60"
                                                >
                                                    Explanation
                                                </label>
                                                <textarea
                                                    rows={1}
                                                    onChange={(e) =>
                                                        updateQuestionField(
                                                            "explanation",
                                                            e.target.value,
                                                        )
                                                    }
                                                    value={
                                                        selectedQuestion?.explanation ??
                                                        ""
                                                    }
                                                    name="explanation"
                                                    id="explanation"
                                                    className="flex-4/5 p-1.5 text-slate-700 dark:text-slate-200"
                                                    placeholder="Explaination For Question"
                                                    required
                                                />
                                            </div>
                                            <hr className="col-span-full border border-slate-200 dark:border-slate-700/50" />

                                            {/* Question Settings */}
                                            <div className="flex flex-col md:flex-row gap-2">
                                                <div className="flex-1 inline-flex dark:text-slate-300 w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                                    <div className="text-sm flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60">
                                                        <label htmlFor="marks">
                                                            Marks
                                                        </label>
                                                    </div>
                                                    <input
                                                        type="number"
                                                        onWheel={(e) =>
                                                            (
                                                                e.target as HTMLInputElement
                                                            ).blur()
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                [
                                                                    "e",
                                                                    "E",
                                                                    "-",
                                                                    "+",
                                                                    ".",
                                                                    ",",
                                                                ].includes(
                                                                    e.key,
                                                                )
                                                            )
                                                                e.preventDefault();
                                                        }}
                                                        onChange={(e) =>
                                                            updateQuestionField(
                                                                "marks",
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        value={
                                                            selectedQuestion?.marks ??
                                                            ""
                                                        }
                                                        id="marks"
                                                        pattern="\d*"
                                                        min="1"
                                                        step="1"
                                                        className="flex-1 px-1.5 text-slate-700 dark:text-slate-200"
                                                        placeholder="Marks"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-1 inline-flex dark:text-slate-300 w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                                    <div className="text-sm flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60">
                                                        <label htmlFor="questionDifficulty">
                                                            Difficulty
                                                        </label>
                                                    </div>
                                                    <select
                                                        onChange={(e) =>
                                                            updateQuestionField(
                                                                "difficulty",
                                                                e.target
                                                                    .value as QuestionDifficulty,
                                                            )
                                                        }
                                                        id="questionDifficulty"
                                                        className="p-1.5 w-full "
                                                        value={
                                                            selectedQuestion?.difficulty ??
                                                            ""
                                                        }
                                                        required
                                                    >
                                                        <option value="">
                                                            Select
                                                        </option>
                                                        {Object.keys(
                                                            QuestionDifficulty,
                                                        ).map((dif, idx) => (
                                                            <option
                                                                key={idx}
                                                                value={dif}
                                                                className="capitalize"
                                                            >
                                                                {dif}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <hr className="col-span-full border border-slate-200 dark:border-slate-700/50" />

                                            {/* Options */}
                                            <h1 className="text-sm font-semibold shadow-md p-2 bg-slate-100 dark:bg-slate-800 text-secondary dark:text-slate-100 rounded w-full inline-flex items-center justify-between gap-1">
                                                <span className="inline-flex items-center gap-1">
                                                    <ListBulletIcon className="size-4" />
                                                    Options
                                                </span>
                                                <ActionButton
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addOption();
                                                    }}
                                                    type="button"
                                                    text="Add Option"
                                                    theme="secondary"
                                                    icon={PlusCircleIcon}
                                                    padding="p-1 rounded-sm"
                                                />
                                            </h1>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedQuestion?.options &&
                                                    selectedQuestion.options
                                                        ?.length > 0 &&
                                                    selectedQuestion.options.map(
                                                        (option, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="inline-flex w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden"
                                                            >
                                                                <div className="flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60">
                                                                    <CheckCircleIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                                                </div>
                                                                <textarea
                                                                    rows={1}
                                                                    value={String(
                                                                        option.optionText ??
                                                                            "",
                                                                    )}
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateOptionField(
                                                                            option.id,
                                                                            "optionText",
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    id={`optionText-${option.id}`}
                                                                    className="flex-4/5 p-1.5 text-slate-700 dark:text-slate-200"
                                                                    placeholder="Enter Option"
                                                                    required
                                                                />
                                                                <select
                                                                    name="isCorrect"
                                                                    id={`isCorrect-${option.id}`}
                                                                    className="flex-1/5 border-s border-slate-200 px-1.5 text-slate-700 dark:text-slate-200 dark:border-slate-700"
                                                                    value={String(
                                                                        option.isCorrect ??
                                                                            "",
                                                                    )}
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateOptionField(
                                                                            option.id,
                                                                            "isCorrect",
                                                                            e
                                                                                .target
                                                                                .value ===
                                                                                "true",
                                                                        )
                                                                    }
                                                                    required
                                                                >
                                                                    <option value="">
                                                                        Select
                                                                    </option>
                                                                    <option value="true">
                                                                        Correct
                                                                    </option>
                                                                    <option value="false">
                                                                        Wrong
                                                                    </option>
                                                                </select>
                                                                <ActionButton
                                                                    onClick={() => {
                                                                        deleteOption(
                                                                            option.id ??
                                                                                "",
                                                                        );
                                                                    }}
                                                                    type="button"
                                                                    icon={
                                                                        TrashIcon
                                                                    }
                                                                    resetStyles="rounded-sm bg-rose-800 text-white hover:bg-rose-900 transition-colors duration-75"
                                                                    padding="p-1 m-1 "
                                                                />
                                                            </div>
                                                        ),
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                    </div>
                    <hr className="col-span-full border border-slate-200 dark:border-slate-800" />
                    <div className="p-1 col-span-full w-full flex flex-row justify-end items-center gap-4">
                        {notifications && notifications.form && (
                            <div
                                className={`animate-pulse py-0.5 px-1.5 text-sm rounded-full inline-flex gap-1 items-center ${notifications.form.type === "error" ? "bg-rose-500/10 text-rose-700 dark:text-rose-400" : notifications.form.type === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400"}`}
                            >
                                {notifications.form.type === "error" ? (
                                    <>
                                        <ExclamationTriangleIcon className="size-4" />
                                        <span className="capitalize">
                                            Resolve The Errors to proceed
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleIcon className="size-4" />
                                        <span className="capitalize">
                                            {notifications.form.type}
                                        </span>
                                    </>
                                )}
                            </div>
                        )}
                        <ActionButton
                            icon={CheckCircleIcon}
                            text={
                                secondsLeft != 0
                                    ? `Closing in ${secondsLeft}`
                                    : "Create"
                            }
                            theme="primary"
                            padding="py-0.5 px-1.5 rounded-sm"
                            type="submit"
                            disabled={secondsLeft != 0}
                        />
                    </div>
                </form>
            </ModalComponent>

            {loadingStatus ? (
                <div className="text-semibold inline-flex gap-2 items-center">
                    <div className="h-5 w-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin"></div>
                    <span>Fetching Quizzes...</span>
                </div>
            ) : allQuizzes.length > 0 ? (
                <>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                            <div className="cols-span-full md:col-span-4">
                                {/* Search fields */}
                                <div className="text-sm inline-flex w-full md:w-auto flex-col md:flex-row overflow-hidden min-h-9 rounded text-slate-700 bg-slate-100 dark:bg-slate-700/50 dark:text-white border border-slate-300 dark:border-slate-600">
                                    {/* Title Input */}
                                    <InputComponent
                                        id="filterTitle"
                                        value={searchQuery?.title ?? ""}
                                        type="text"
                                        placeholder="Search by title"
                                        onChange={(e) =>
                                            setSearchQuery((prev) => ({
                                                ...(prev ?? {}),
                                                title: e.target.value,
                                            }))
                                        }
                                        label={{ icon: MagnifyingGlassIcon }}
                                        customize="w-full bg-slate-50"
                                    />
                                    {/* Category Select */}
                                    <SelectComponent
                                        id="filterCategory"
                                        value={searchQuery?.category ?? ""}
                                        label={{ icon: PaperClipIcon }}
                                        selection="Category"
                                        options={
                                            categories.map((cat) => ({
                                                data: {
                                                    text: cat.name,
                                                    value: cat.id,
                                                },
                                            })) as OptionElementProps[]
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value
                                                ? String(e.target.value)
                                                : undefined;
                                            setSearchQuery((prev) => ({
                                                ...(prev ?? {}),
                                                category: val,
                                            }));
                                        }}
                                        customize="w-full"
                                    />
                                    {/* Status Select */}
                                    <SelectComponent
                                        id="filterStatus"
                                        value={searchQuery?.status ?? ""}
                                        label={{ icon: EllipsisHorizontalIcon }}
                                        selection="Status"
                                        options={
                                            Object.keys(QuizStatus).map(
                                                (status) => ({
                                                    data: {
                                                        text: status,
                                                        value: status,
                                                    },
                                                }),
                                            ) as OptionElementProps[]
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value
                                                ? (e.target.value as QuizStatus)
                                                : undefined;
                                            setSearchQuery((prev) => ({
                                                ...(prev ?? {}),
                                                status: val,
                                            }));
                                        }}
                                        customize="w-full"
                                    />
                                    {/* Reset Action Button */}
                                    <ActionButton
                                        resetStyles=""
                                        padding="p-2"
                                        icon={XCircleIcon}
                                        onClick={() => setSearchQuery(null)}
                                    />
                                </div>
                            </div>

                            <div className="col-span-full md:col-span-1">
                                {/* Pagination buttons */}
                                <div className="space-y-2 text-start md:text-end">
                                    <div className="inline-flex items-center rounded-lg outline outline-offset-2 outline-primary overflow-hidden">
                                        <ActionButton
                                            icon={ChevronLeftIcon}
                                            resetStyles="text-white bg-primary hover:bg-primary/60 transition-colors duration-75"
                                            padding="p-1"
                                        />
                                        <ActionButton
                                            icon={ChevronRightIcon}
                                            resetStyles="text-white bg-primary hover:bg-primary/60 transition-colors duration-75"
                                            padding="p-1"
                                        />
                                    </div>
                                    <span className="block lowercase text-sm">
                                        Showing page 1 of 2
                                    </span>
                                </div>
                            </div>
                        </div>
                        <hr className="w-full border-slate-300 dark:border-slate-600" />

                        {/* Quiz Cards */}
                        {filteredQuizzes.length == 0 ? (
                            <div className="capitalize text-sm inline-flex gap-1 items-center">
                                <ClockIcon className="size-4" />
                                <span>No quizzes found with given search</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {filteredQuizzes.map((quiz, idx) => (
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
                                        handleEdit={editQuiz}
                                        handlePublish={updateQuizStatus}
                                        handleDelete={deleteQuiz}
                                        renderCellValue={renderCellValue}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="capitalize text-sm inline-flex gap-1 items-center">
                    <ClockIcon className="size-4" />
                    <span>No Quizzes has been created so far</span>
                </div>
            )}
        </SectionLayout>
    );
}
