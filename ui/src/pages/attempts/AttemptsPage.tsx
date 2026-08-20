import { ArrowPathIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BadgeComponent from "../../components/BadgeComponent";
import ActionButton from "../../components/button/ActionButton";
import { PaginationButtons } from "../../components/pagination/Pagination";
import usePagination from "../../components/pagination/usePagination";
import SectionLayout from "../../components/SectionLayout";
import SpinnerComponent from "../../components/SpinnerComponent";
import { RoutePaths } from "../../routes/RoutePaths";
import type { Attempt } from "../../services/AttemptService";
import AttemptService, { AttemptStatus } from "../../services/AttemptService";
import type { Quiz } from "../../services/QuizService";
import {
    formatDurationTaken,
    formatIsoDate,
} from "../../utils/DateTimeParseHelper";

export type AttemptsPageProps = {
    data?: {
        quiz: Quiz;
        shareAttempts?: (attempts: Attempt[]) => void;
    };
};

export default function AttemptsPage({ data }: AttemptsPageProps) {
    const navigate = useNavigate();
    const [prevAttempts, setPrevAttempts] = useState<Attempt[]>([]);
    const [dataLoadingStatus, setDataLoadingStatus] = useState<boolean>(true);

    const refreshAttempts = useCallback(() => {
        AttemptService.getPreviousAttempts<Attempt[]>(
            data ? data.quiz.id : undefined,
        )
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    setPrevAttempts(resp.sort((a, b) => b.id - a.id));
                    if (data?.shareAttempts) {
                        data.shareAttempts(resp);
                    }
                }
            })
            .finally(() => {
                setDataLoadingStatus(false);
            });
    }, [data]);

    useEffect(() => {
        refreshAttempts();
    }, [refreshAttempts]);

    const {
        currentPage,
        totalPages,
        currentItems: currentAttempts,
        goToNextPage,
        goToPrevPage,
    } = usePagination(prevAttempts, 10);

    return (
        <SectionLayout
            breadCrumbs={[
                {
                    text: "Attempts",
                    uri: RoutePaths.ATTEMPTS,
                },
                ...(data
                    ? [
                          {
                              text: data.quiz.title + "",
                              uri: RoutePaths.ATTEMPT_DETAILS.replace(
                                  ":attemptId",
                                  data?.quiz.id ?? "",
                              ),
                          },
                      ]
                    : []),
            ]}
            title="Attempts"
            description={`Your Previous Quiz Attempts`}
        >
            <div className="bg-slate-100 dark:bg-slate-900 rounded-lg">
                <div className="space-y-2">
                    {totalPages > 1 && (
                        <>
                            <div className="inline-flex flex-col md:flex-row md:items-center p-3 gap-y-3 md:justify-between container">
                                <ActionButton
                                    icon={ArrowPathIcon}
                                    text="Refresh"
                                    theme="primary"
                                    padding="rounded-sm px-1.5"
                                    onClick={() => {
                                        setDataLoadingStatus(true);
                                        refreshAttempts();
                                    }}
                                />
                                <PaginationButtons
                                    goToNextPage={goToNextPage}
                                    goToPrevPage={goToPrevPage}
                                    totalPages={totalPages}
                                    currentPage={currentPage}
                                />
                            </div>
                            <hr className="border-b border-slate-200 dark:border-slate-800" />
                        </>
                    )}

                    {dataLoadingStatus ? (
                        <div className="p-2">
                            <SpinnerComponent
                                text="Fetching attempts..."
                                customize="animate-pulse"
                            />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                                <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                                    <tr>
                                        <th scope="col" className="px-6 py-3.5">
                                            #
                                        </th>
                                        <th scope="col" className="px-6 py-3.5">
                                            Quiz
                                        </th>
                                        <th scope="col" className="px-6 py-3.5">
                                            score
                                        </th>
                                        <th scope="col" className="px-6 py-3.5">
                                            time spent
                                        </th>
                                        <th scope="col" className="px-6 py-3.5">
                                            Result
                                        </th>
                                        <th
                                            colSpan={2}
                                            scope="col"
                                            className="px-6 py-3.5"
                                        >
                                            Time
                                        </th>
                                        <th scope="col" className="px-6 py-3.5">
                                            Details
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-200 transition-colors dark:divide-slate-800">
                                    {currentAttempts.map((attempt, idx) => {
                                        return (
                                            <tr
                                                key={attempt.id}
                                                className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40"
                                            >
                                                <td className="px-6 py-4">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {attempt.quiz.title}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {attempt.score ?? "N/A"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {formatDurationTaken(
                                                        attempt.timeSpent,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {attempt.score == null ? (
                                                        <BadgeComponent
                                                            value={AttemptStatus.IN_PROGRESS}
                                                            type="warning"
                                                        />
                                                    ) : Number(attempt.score) >=
                                                      Number(
                                                          attempt.quiz?.settings
                                                              ?.passingScore,
                                                      ) ? (
                                                        <BadgeComponent
                                                            value="PASS"
                                                            type="success"
                                                        />
                                                    ) : (
                                                        <BadgeComponent
                                                            value="FAILED"
                                                            type="danger"
                                                        />
                                                    )}
                                                </td>
                                                <td
                                                    colSpan={2}
                                                    className="px-6 py-4"
                                                >
                                                    {formatIsoDate(
                                                        attempt.attemptTime,
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <ActionButton
                                                        text="Details"
                                                        icon={ChevronRightIcon}
                                                        resetStyles=""
                                                        iconAfter
                                                        onClick={() => {
                                                            navigate(
                                                                RoutePaths.ATTEMPT_DETAILS.replace(
                                                                    ":attemptId",
                                                                    attempt.id +
                                                                        "",
                                                                ),
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {prevAttempts.length == 0 && (
                                        <tr className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40">
                                            <td
                                                className="px-6 py-4"
                                                colSpan={8}
                                            >
                                                You haven't attempted
                                                {data && " this Quiz"} before
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </SectionLayout>
    );
}
