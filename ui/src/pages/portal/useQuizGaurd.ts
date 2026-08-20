import { useEffect } from "react";
import type { AttemptProgress } from "../../services/AttemptService";
import AttemptService from "../../services/AttemptService";

/**
 * Handles tab close, page refresh, tab switch, and route changes for active quiz attempts.
 */
export const useQuizGuard = (
    attempt: AttemptProgress | null,
    isAttemptActive: boolean,
) => {
    useEffect(() => {
        if (!isAttemptActive || !attempt) return;

        // 1. Tab Close & Page Refresh
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            (event as unknown as Record<string, unknown>).returnValue = "";

            // Triggers interruption payload with fetch keepalive flag
            AttemptService.markQuizInterrupted(attempt);
        };

        // 2. Tab Switch & Browser Minimize
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                AttemptService.markQuizInterrupted(attempt);
            }
        };

        // 3. React Router / Browser Back & Forward Navigation
        const handlePopState = () => {
            if (
                window.confirm(
                    "Leaving will mark your attempt attempt as interrupted. Continue?",
                )
            ) {
                AttemptService.markQuizInterrupted(attempt);
            } else {
                window.history.pushState(null, "", window.location.href);
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.removeEventListener("popstate", handlePopState);
        };
    }, [attempt, isAttemptActive]);
};
