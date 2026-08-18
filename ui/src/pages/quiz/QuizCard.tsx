import {
    ArchiveBoxXMarkIcon,
    InformationCircleIcon,
    MegaphoneIcon,
    PencilIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import { QuizStatus, type Quiz } from "../../services/QuizService";
import usePrincipal from "../../context/usePrincipal";
import ActionButton from "../../components/button/ActionButton";

export type QuizCardProps = {
    quiz: Quiz;
    handleAttempt: (id: string) => void;
    handleEdit?: (quiz: Quiz) => void;
    handlePublish?: (quiz: Quiz) => void;
    handleDelete?: (id: string) => void;
    renderCellValue?: (input: unknown) => ReactNode;
};

export default function QuizCard({
    quiz,
    handleAttempt,
    handleEdit,
    handlePublish,
    handleDelete,
    renderCellValue,
}: QuizCardProps) {
    const { isAdmin } = usePrincipal();

    return (
        <div className="rounded-lg overflow-hidden bg-slate-50 hover:bg-slate-200/40 dark:bg-slate-800 hover:dark:bg-slate-900/60 shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-700 p-2 transition-all duration-100">
            <div className="relative rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-sm"></div>
                <img
                    src="/undraw_choose_5kz4.svg"
                    alt="Quiz Thumbnail"
                    className="max-h-40 rounded-lg"
                />
                <div className="absolute inset-0">
                    <div className="h-full flex items-center justify-center capitalize">
                        <div className="p-2 w-4/5 h-4/5 bg-slate-100/50 dark:bg-slate-700/30 text-primary dark:text-white flex flex-col items-center justify-center rounded-lg">
                            <p className="font-semibold">{quiz.title}</p>
                            <p className="text-sm">{quiz.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-2 space-y-3 text-center">
                <div className="w-full flex flex-col md:flex-row justify-center items-center gap-2 text-sm">
                    <span className="text-start">
                        No.Of Qs - {quiz.questions?.length}
                    </span>
                    <span className="hidden md:block">|</span>
                    <span className="text-end">
                        Duration {quiz.settings?.maxDuration?.substring(2)}
                    </span>
                </div>
                {renderCellValue && (
                    <p className="text-sm">{renderCellValue(quiz.status)}</p>
                )}
                {isAdmin() && (handleEdit || handlePublish || handleDelete) && (
                    <div className="inline-flex rounded-lg overflow-hidden outline outline-primary outline-offset-2">
                        {handleEdit && (
                            <ActionButton
                                icon={PencilIcon}
                                theme="primary"
                                resetStyles="text-sm"
                                onClick={() => handleEdit(quiz)}
                            />
                        )}
                        {handlePublish && (
                            <ActionButton
                                icon={
                                    quiz.status == QuizStatus.PUBLISHED
                                        ? ArchiveBoxXMarkIcon
                                        : MegaphoneIcon
                                }
                                text={
                                    quiz.status == QuizStatus.PUBLISHED
                                        ? "UnPublish"
                                        : "Publish"
                                }
                                onClick={() => handlePublish(quiz)}
                                theme="primary"
                                resetStyles="text-sm"
                            />
                        )}
                        {handleDelete && (
                            <ActionButton
                                icon={TrashIcon}
                                theme="primary"
                                onClick={() => {
                                    handleDelete(quiz.id ?? "");
                                }}
                                resetStyles="text-sm"
                            />
                        )}
                    </div>
                )}
                <div className="inline-flex rounded-lg overflow-hidden outline outline-primary outline-offset-2">
                    <ActionButton
                        icon={InformationCircleIcon}
                        text="Details"
                        theme="primary"
                        onClick={() => {
                            handleAttempt(quiz.id ?? "");
                        }}
                        resetStyles="text-sm"
                    />
                </div>
            </div>
        </div>
    );
}
