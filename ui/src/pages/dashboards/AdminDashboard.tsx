import { defaults } from "chart.js/auto";
import { Line } from "react-chartjs-2";

import { useCallback, useEffect, useState } from "react";
import ReportsService, {
    type MonthlyQuizzesReport,
} from "../../services/ReportsService";
import { ClockIcon } from "@heroicons/react/24/outline";

defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "#6b855d";

export default function AdminDashBoard() {
    const [loading, setLoading] = useState(true);
    const [allReports, setAllReports] = useState<MonthlyQuizzesReport[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
    const [monthlyReports, setMonthlyReports] = useState<
        MonthlyQuizzesReport[] | null
    >(null);

    const fetchMonthlyQuizReports = useCallback((month?: string) => {
        ReportsService.getMonthlyQuizzesTrend<MonthlyQuizzesReport[]>(month)
            .then((resp) => {
                if (resp && !("errorMessage" in resp)) {
                    if (month) {
                        setMonthlyReports(resp);
                    } else {
                        setAllReports(resp);
                        setMonthlyReports(resp);
                    }
                } else {
                    console.log(resp);
                }
            })
            .catch((er) => {
                console.log(er);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchMonthlyQuizReports(selectedMonth ?? "");
    }, [fetchMonthlyQuizReports, selectedMonth]);

    // const handleMonthChange = (selectedMonth: string) => {
    //     setLoading(true);
    //     if (!selectedMonth) {
    //         setMonthlyReports(allReports);
    //         setLoading(false);
    //     } else {
    //         fetchMonthlyQuizReports(selectedMonth);
    //     }
    // };

    return (
        <>
            {loading ? (
                <div className="text-semibold inline-flex gap-2 items-center">
                    <div className="h-5 w-5 border-2 border-slate-300 border-t-primary rounded-full animate-spin"></div>
                    <span>Getting Quiz Reports...</span>
                </div>
            ) : allReports.length > 0 ? (
                <>
                    <div className="space-y-3">
                        <input
                            type="month"
                            name="month"
                            id="month"
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="py-1.5 px-2 rounded text-slate-700 bg-slate-200 dark:bg-slate-700 dark:text-white border border-slate-300 dark:border-slate-600"
                        />
                        <hr className="border border-slate-300 dark:border-slate-700" />
                    <div className="bg-slate-50 shadow-sm p-3 min-h-60 rounded-lg">
                        <Line
                            data={{
                                labels: monthlyReports?.map(
                                    (data) => data.date,
                                ),
                                datasets: [
                                    {
                                        label: "Quizzes Created Per Day",
                                        data: monthlyReports?.map(
                                            (data) => data.quizzes,
                                        ),
                                        backgroundColor: "#1b5879",
                                        borderColor: "#1b5879",
                                    },
                                    {
                                        label: "No.of Attempts Per Day",
                                        data: monthlyReports?.map(
                                            (data) => data.attempts,
                                        ),
                                        backgroundColor: "#6b855d",
                                        borderColor: "#6b855d",
                                    },
                                ],
                            }}
                            options={{
                                elements: {
                                    line: {
                                        tension: 0.3,
                                    },
                                },
                                plugins: {
                                    title: {
                                        text: "Quizzes Trend (Per Day)",
                                    },
                                },
                            }}
                        />
                    </div>
                    </div>
                </>
            ) : (
                <div className="capitalize text-sm inline-flex gap-1 items-center">
                    <ClockIcon className="size-4" />
                    <span>No Quizzes has been created so far</span>
                </div>
            )}
        </>
    );
}
