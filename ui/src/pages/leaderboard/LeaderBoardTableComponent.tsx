import { PaginationButtons } from "../../components/pagination/Pagination";
import usePagination from "../../components/pagination/usePagination";
import type { LeaderBoardData } from "../../services/LeaderBoardService";
import { formatDurationTaken } from "../../utils/DateTimeParseHelper";

export default function LeaderBoardTableComponent({
    data,
}: {
    data: LeaderBoardData[];
}) {
    const {
        currentPage,
        totalPages,
        currentItems: leaderBoard,
        goToNextPage,
        goToPrevPage,
    } = usePagination(data, 8);

    return (
        <div className="flex flex-col gap-y-2">
            {totalPages > 1 && (
                <PaginationButtons
                    theme="primary"
                    currentPage={currentPage}
                    goToPrevPage={goToPrevPage}
                    goToNextPage={goToNextPage}
                    totalPages={totalPages}
                />
            )}
            <div className="overflow-x-auto bg-slate-100 dark:bg-slate-900 rounded-lg">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                    <thead className="border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
                        <tr>
                            <th scope="col" className="px-6 py-3.5">
                                # Rank
                            </th>
                            <th scope="col" className="px-6 py-3.5">
                                Student Name
                            </th>
                            <th scope="col" className="px-6 py-3.5">
                                score
                            </th>
                            <th scope="col" className="px-6 py-3.5">
                                Timespent
                            </th>
                            <th scope="col" className="px-6 py-3.5">
                                category
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 transition-colors dark:divide-slate-800">
                        {leaderBoard.map((item, idx) => {
                            return (
                                <tr
                                    key={idx}
                                    className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40"
                                >
                                    <td className="px-6 py-4">{idx + 1}</td>
                                    <td className="px-6 py-4">
                                        {`${item.student.firstName} ${item.student.lastName}`}
                                    </td>
                                    <td className="px-6 py-4">{item.score}</td>
                                    <td className="px-6 py-4">
                                        {formatDurationTaken(
                                            item.attempt.timeSpent,
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.attempt.quiz.category?.name}
                                    </td>
                                </tr>
                            );
                        })}
                        {data.length == 0 && (
                            <tr className="hover:bg-slate-50/80 transition-colors dark:hover:bg-slate-800/40">
                                <td className="px-6 py-4" colSpan={8}>
                                    Nobody attempted this quiz so far
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
