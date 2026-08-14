import {
    AdjustmentsHorizontalIcon,
    BoltIcon,
    CheckBadgeIcon,
    CheckCircleIcon,
    CheckIcon,
    ClockIcon,
    ExclamationCircleIcon,
    InformationCircleIcon,
    ListBulletIcon,
    MegaphoneIcon,
    NumberedListIcon,
    PaperClipIcon,
    PencilSquareIcon,
    PlusCircleIcon,
    SquaresPlusIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState, type MouseEvent, type SubmitEvent } from "react";
import ActionButton from "../../components/ActionButton";
import ModalComponent from "../../components/ModalComponent";
import SectionLayout from "../../components/SectionLayout";
import usePrincipal from "../../context/usePrincipal";
import QuizService, {
    QuestionDifficulty,
    QuizDifficulty,
    QuizStatus,
    type Category,
    type Question,
    type QuestionOption,
    type Quiz,
} from "../../services/QuizService";

export type FormErrorsProps = {
    type: "success" | "error";
    errors: string[];
};

export default function Quizzes() {
    const { isAdmin } = usePrincipal();
    const [modalState, toggleModalState] = useState(true);
    const [formErrors, setFormErrors] = useState<FormErrorsProps | null>({
        type: "error",
        errors: [],
    });
    const [secondsLeft, setSecondsLeft] = useState<number>(0);

    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState(false);
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
        null,
    );

    useEffect(() => {
        QuizService.getAllCategories<Category[]>().then((resp) => {
            if (resp && !("errorMessage" in resp)) {
                setCategories(resp);
            } else {
                console.log(resp);
            }
        });
    }, []);

    const updateQuestionField = <K extends keyof Question>(
        field: K,
        value: Question[K],
    ) => {
        if (!selectedQuestion) return;

        const updatedQuestion = { ...selectedQuestion, [field]: value };
        setSelectedQuestion(updatedQuestion);

        setAllQuestions((prev) =>
            prev.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q,
            ),
        );
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

        setAllQuestions((prev) =>
            prev.map((q) =>
                q.id === updatedQuestion.id ? updatedQuestion : q,
            ),
        );
    };

    const addQuiz = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalQuiz: Quiz = {
            ...quiz,
            category: { ...quiz?.category },
            questions: [
                ...allQuestions.map(
                    (q) =>
                        ({
                            questionText: q.questionText,
                            explanation: q.explanation,
                            marks: q.marks,
                            options: q.options
                                ? [
                                      ...q.options.map(
                                          (opt) =>
                                              ({
                                                  optionText: opt.optionText,
                                                  isCorrect: opt.isCorrect,
                                              }) as QuestionOption,
                                      ),
                                  ]
                                : [],
                            difficulty: q.difficulty,
                        }) as Question,
                ),
            ],
        };

        setQuiz(finalQuiz);

        console.log(finalQuiz);

        QuizService.createQuiz<Quiz>(finalQuiz)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setQuiz(resp);
                    setSecondsLeft(5);
                    setFormErrors({
                        type: "success",
                        errors: [
                            `Quiz ${quiz?.status === QuizStatus.DRAFT ? "draft" : ""} has been saved successfully.`,
                        ],
                    });
                } else {
                    setFormErrors({
                        type: "error",
                        errors: [resp.errorMessage],
                    });
                    console.log(resp);
                }
            })
            .finally(() => {
                if (secondsLeft != 0) {
                    // const modalCountDown = setInterval(() => {
                    //     setSecondsLeft(secondsLeft - 1);
                    // }, secondsLeft);
                    const clearFormErrors = setTimeout(() => {
                        setFormErrors(null);
                    }, 5000);
                    return () => {
                        // clearInterval(modalCountDown);
                        clearTimeout(clearFormErrors);
                    };
                }
            });
    };

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

        setAllQuestions((prev) => [...prev, newQuestion]);
        setSelectedQuestion(newQuestion);
    };

    const addOption = (e?: MouseEvent<HTMLButtonElement>) => {
        if (e) e.preventDefault();
        if (!selectedQuestion) return;

        const newOption: QuestionOption = {
            id: String(Date.now()),
            optionText: "",
            isCorrect: false,
        };

        const updatedQuestions = allQuestions.map((q) =>
            q.id === selectedQuestion.id
                ? {
                      ...q,
                      options: [...(q.options ?? []), newOption],
                  }
                : q,
        );

        setAllQuestions(updatedQuestions);

        // Keep selectedQuestion reference updated
        setSelectedQuestion((prev) =>
            prev
                ? {
                      ...prev,
                      options: [...(prev.options ?? []), newOption],
                  }
                : null,
        );
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
                    onSubmit={addQuiz}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                    {formErrors && formErrors?.errors.length > 0 && (
                        <div
                            className={`p-2.5 col-span-full flex flex-row gap-2 items-center dark:text-white text-sm rounded-lg 
                                ${
                                    formErrors.type == "success"
                                        ? " bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                        : " bg-rose-500/10 text-rose-700 dark:text-rose-400"
                                }`}
                        >
                            {formErrors.type == "error" ? (
                                <ExclamationCircleIcon
                                    className={`text-rose-500 size-4`}
                                />
                            ) : (
                                <CheckCircleIcon className="text-emerald-500 size-4" />
                            )}
                            <span>{formErrors.errors.join(", ")}</span>
                        </div>
                    )}
                    <div className="p-2.5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex flex-col">
                        <h1 className="text-sm font-semibold inline-flex w-full items-center gap-1 text-secondary dark:text-slate-100">
                            <InformationCircleIcon className="size-4" />
                            Quiz
                        </h1>
                        <hr className="border border-slate-200 dark:border-slate-700/50" />
                        <div className="grid grid-cols-1 gap-2">
                            <div className="inline-flex w-full min-h-8.5 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                <label
                                    htmlFor="title"
                                    className="text-sm flex items-center justify-center gap-1 px-2 bg-slate-200/60 dark:bg-slate-700/60"
                                >
                                    <InformationCircleIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                    <span>Title</span>
                                </label>
                                <input
                                    type="text"
                                    onChange={(e) =>
                                        setQuiz((prev) => ({
                                            ...prev,
                                            title: e.target.value,
                                        }))
                                    }
                                    defaultValue={quiz?.title}
                                    id="title"
                                    className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50"
                                    placeholder="Quiz title"
                                    required
                                />
                            </div>
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
                                                setQuiz((prev) => ({
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
                                                if (
                                                    categories.filter(
                                                        (c) =>
                                                            c.name?.toLowerCase() ==
                                                            e.target.value.toLowerCase(),
                                                    ).length != 0
                                                ) {
                                                    setFormErrors((er) => ({
                                                        type: "error",
                                                        errors: er?.errors
                                                            ? [
                                                                  ...er.errors,
                                                                  "Category already exists!",
                                                              ]
                                                            : [],
                                                    }));
                                                }
                                                setQuiz((prev) => ({
                                                    ...prev,
                                                    category: {
                                                        ...prev?.category,
                                                        name: e.target.value,
                                                    },
                                                }));
                                            }}
                                            value={quiz?.category?.name ?? ""}
                                            id="category"
                                            className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
                                            placeholder="New Category"
                                            required
                                        />
                                    ) : (
                                        <select
                                            onChange={(e) =>
                                                setQuiz((prev) => ({
                                                    ...prev,
                                                    category: {
                                                        id: e.target.value,
                                                    },
                                                }))
                                            }
                                            id="category"
                                            className="flex-1 px-1 dark:bg-slate-900/50"
                                            value={quiz?.category?.id ?? ""}
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
                                                setQuiz((prev) => ({
                                                    ...prev,
                                                    category: {},
                                                }));
                                                setNewCategory(!newCategory);
                                            }}
                                        />
                                    )}
                                </div>
                                {newCategory && (
                                    <div className="inline-flex w-full shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                        <label
                                            htmlFor="catDescription"
                                            className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60"
                                        >
                                            <PencilSquareIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                            {/* <span>Description</span> */}
                                        </label>
                                        <textarea
                                            rows={2}
                                            onChange={(e) => {
                                                setQuiz((prev) => ({
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
                                                quiz?.category?.description ??
                                                ""
                                            }
                                            id="catDescription"
                                            className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50"
                                            placeholder="Category Description"
                                            required
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="inline-flex w-full shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                <div className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60">
                                    <InformationCircleIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                    <span>Description</span>
                                </div>
                                <textarea
                                    rows={2}
                                    onChange={(e) => {
                                        setQuiz((prev) => ({
                                            ...prev,
                                            description: String(e.target.value),
                                        }));
                                    }}
                                    value={quiz?.description ?? ""}
                                    id="description"
                                    className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50"
                                    placeholder="Short Description"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-2.5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 flex flex-col">
                        <h1 className="text-sm font-semibold inline-flex w-full items-center gap-1 text-secondary dark:text-slate-100">
                            <AdjustmentsHorizontalIcon className="size-4" />
                            Settings
                        </h1>
                        <hr className="border border-slate-200 dark:border-slate-700/50" />
                        <div className="grid grid-cols-1 gap-2">
                            <div className="inline-flex w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                <div className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60">
                                    <CheckBadgeIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                    <span>Passing Score</span>
                                </div>
                                <input
                                    type="number"
                                    onWheel={(e) =>
                                        (e.target as HTMLInputElement).blur()
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
                                            ].includes(e.key)
                                        )
                                            e.preventDefault();
                                    }}
                                    onChange={(e) => {
                                        setQuiz((prev) => ({
                                            ...prev,
                                            settings: {
                                                ...prev?.settings,
                                                passingScore: e.target.value,
                                            },
                                        }));
                                    }}
                                    value={quiz?.settings?.passingScore ?? ""}
                                    id="passingScore"
                                    pattern="\d*"
                                    min="1"
                                    step="1"
                                    className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50"
                                    placeholder="Passing Score"
                                    required
                                />
                            </div>
                            <div className="flex flex-col md:flex-row w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                <div className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60">
                                    <ClockIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                    <span>Duration</span>
                                </div>
                                <input
                                    type="number"
                                    onWheel={(e) =>
                                        (e.target as HTMLInputElement).blur()
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
                                            ].includes(e.key)
                                        )
                                            e.preventDefault();
                                    }}
                                    name="maxDuration"
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const typeSelect =
                                            document.getElementById(
                                                "durationType",
                                            ) as HTMLSelectElement;
                                        const type =
                                            typeSelect?.value === "hours"
                                                ? "H"
                                                : "M";

                                        setQuiz((prev) => ({
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
                                        quiz?.settings?.maxDuration
                                            ? quiz.settings?.maxDuration.substring(
                                                  2,
                                                  quiz.settings?.maxDuration
                                                      .length - 1,
                                              )
                                            : ""
                                    }
                                    id="maxDuration"
                                    pattern="\d*"
                                    min="1"
                                    step="1"
                                    className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50"
                                    placeholder="Enter Duration"
                                    required
                                />
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

                                        setQuiz((prev) => ({
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
                                        quiz?.settings?.maxDuration
                                            ? quiz?.settings?.maxDuration
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
                            </div>
                            <div className="inline-flex w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                <div className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60">
                                    <PencilSquareIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                    <span>Attempts</span>
                                </div>
                                <input
                                    type="number"
                                    onWheel={(e) =>
                                        (e.target as HTMLInputElement).blur()
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
                                            ].includes(e.key)
                                        )
                                            e.preventDefault();
                                    }}
                                    value={quiz?.settings?.maxAttempts ?? ""}
                                    onChange={(e) => {
                                        setQuiz((prev) => ({
                                            ...prev,
                                            settings: {
                                                ...prev?.settings,
                                                maxAttempts: Number(
                                                    e.target.value,
                                                ),
                                            },
                                        }));
                                    }}
                                    id="maxAttempts"
                                    pattern="\d*"
                                    min="1"
                                    step="1"
                                    className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50"
                                    placeholder="Attempts Allowed"
                                    required
                                />
                            </div>
                            <div className="flex-1 inline-flex dark:text-slate-300 w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                <label
                                    htmlFor="quizDifficulty"
                                    className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60"
                                >
                                    <BoltIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                    <span>Difficulty</span>
                                </label>
                                <select
                                    onChange={(e) =>
                                        setQuiz((prev) => ({
                                            ...prev,
                                            settings: {
                                                ...prev?.settings,
                                                difficulty: e.target
                                                    .value as QuizDifficulty,
                                            },
                                        }))
                                    }
                                    id="quizDifficulty"
                                    className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50 cursor-pointer"
                                    value={quiz?.settings?.difficulty ?? ""}
                                    required
                                >
                                    <option value="">Select</option>
                                    {Object.keys(QuizDifficulty).map(
                                        (dif, idx) => (
                                            <option
                                                key={idx}
                                                value={dif}
                                                className="capitalize"
                                            >
                                                {dif}
                                            </option>
                                        ),
                                    )}
                                </select>
                            </div>
                            <div className="flex-1 inline-flex dark:text-slate-300 w-full min-h-9 shrink-0 shadow-sm border border-slate-200 dark:border-slate-700 rounded overflow-hidden">
                                <label
                                    htmlFor="status"
                                    className="text-sm gap-1 flex items-center justify-center px-2 bg-slate-200/60 dark:bg-slate-700/60"
                                >
                                    <MegaphoneIcon className="size-4.5 text-slate-600 dark:text-slate-300" />
                                    <span>Publish?</span>
                                </label>
                                <select
                                    onChange={(e) =>
                                        setQuiz((prev) => ({
                                            ...prev,
                                            status: e.target
                                                .value as QuizStatus,
                                        }))
                                    }
                                    id="status"
                                    className="flex-1 px-1.5 text-slate-700 dark:text-slate-200 dark:bg-slate-900/50 cursor-pointer"
                                    value={quiz?.status ?? ""}
                                    required
                                >
                                    <option value="">Select</option>
                                    {Object.keys(QuizStatus).map((dif, idx) => (
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
                    </div>
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
                        {allQuestions.length > 0 && (
                            <>
                                <hr className="border border-slate-200 dark:border-slate-700/50" />
                                <div className="grid grid-cols-1 gap-2">
                                    <div className="overflow-x-scroll">
                                        <div className="inline-flex gap-1 items-center text-sm">
                                            {allQuestions.length > 0 &&
                                                allQuestions.map(
                                                    (question, idx) => (
                                                        <ActionButton
                                                            key={idx}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setSelectedQuestion(
                                                                    allQuestions.filter(
                                                                        (q) =>
                                                                            q.id ==
                                                                            question.id,
                                                                    )[0],
                                                                );
                                                            }}
                                                            text={String(
                                                                idx + 1,
                                                            )}
                                                            type="button"
                                                            resetStyles={`rounded size-6.5 ${selectedQuestion?.id == question.id ? `bg-secondary text-white` : `bg-slate-200 dark:bg-slate-700/50 hover:bg-slate-300 dark:hover:bg-slate-700`}`}
                                                        />
                                                    ),
                                                )}
                                        </div>
                                    </div>
                                    <hr className="col-span-full border border-slate-200 dark:border-slate-700/50" />

                                    {/* Question */}
                                    <div className="space-y-3 p-3 dark:bg-slate-900/50 rounded-lg">
                                        <h1 className="text-sm font-semibold shadow-md p-2 bg-slate-100 dark:bg-slate-800 text-secondary dark:text-slate-100 rounded w-full inline-flex items-center justify-between gap-1">
                                            <span className="inline-flex items-center gap-1">
                                                <span>(Q)</span>
                                                <span>Question</span>
                                            </span>
                                            <ActionButton
                                                onClick={() => {
                                                    setAllQuestions((prev) => [
                                                        ...prev.filter(
                                                            (q) =>
                                                                q.id !=
                                                                selectedQuestion?.id,
                                                        ),
                                                    ]);
                                                    setSelectedQuestion(
                                                        allQuestions[
                                                            allQuestions.length -
                                                                2
                                                        ],
                                                    );
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
                                                            ].includes(e.key)
                                                        )
                                                            e.preventDefault();
                                                    }}
                                                    onChange={(e) =>
                                                        updateQuestionField(
                                                            "marks",
                                                            Number(
                                                                e.target.value,
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
                                                                onChange={(e) =>
                                                                    updateOptionField(
                                                                        option.id,
                                                                        "optionText",
                                                                        e.target
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
                                                                onChange={(e) =>
                                                                    updateOptionField(
                                                                        option.id,
                                                                        "isCorrect",
                                                                        e.target
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
                        <ActionButton
                            icon={CheckIcon}
                            text={
                                secondsLeft != 0
                                    ? `Closing in ${secondsLeft}`
                                    : "Create"
                            }
                            theme="primary"
                            padding="py-0.5 px-1.5 rounded-sm"
                            type="submit"
                        />
                    </div>
                </form>
            </ModalComponent>
            <h1>Quizzes</h1>
        </SectionLayout>
    );
}
