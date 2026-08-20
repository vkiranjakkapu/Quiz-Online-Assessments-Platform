export default function LeaderBoardTableComponent() {
    return (
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
                        <th colSpan={2} scope="col" className="px-6 py-3.5">
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
                                <td className="px-6 py-4">{idx + 1}</td>
                                <td className="px-6 py-4">
                                    {attempt.quiz.title}
                                </td>
                                <td className="px-6 py-4">
                                    {attempt.score ?? "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                    {formatDurationTaken(attempt.timeSpent)}
                                </td>
                                <td className="px-6 py-4">
                                    {attempt.score == null ? (
                                        <BadgeComponent
                                            value={AttemptStatus.IN_PROGRESS}
                                            type="warning"
                                        />
                                    ) : Number(attempt.score) >=
                                      Number(
                                          attempt.quiz?.settings?.passingScore,
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
                                <td colSpan={2} className="px-6 py-4">
                                    {formatIsoDate(attempt.attemptTime)}
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
                                                    attempt.id + "",
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
                            <td className="px-6 py-4" colSpan={8}>
                                You haven't attempted
                                {data && " this Quiz"} before
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
