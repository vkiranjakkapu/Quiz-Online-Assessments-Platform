export function parseIsoDurationToSeconds(durationStr?: string | null): number {
    if (!durationStr) return 0;
    // Updated regex with (\d+(?:\.\d+)?) to capture decimal values
    const regex = /PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?/;
    const matches = durationStr.match(regex);
    if (!matches) return 0;

    // Use parseFloat instead of parseInt to retain fractional seconds
    const hours = parseFloat(matches[1] || "0");
    const minutes = parseFloat(matches[2] || "0");
    const seconds = parseFloat(matches[3] || "0");

    // Math.round strips remaining fractional milliseconds for clean display string output
    return Math.round(hours * 3600 + minutes * 60 + seconds);
}

export function formatSecondsToDisplay(totalSeconds: number): string {
    if (totalSeconds <= 0) return "00:00";

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => String(num).padStart(2, "0");

    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Default: "Aug 19, 2026, 10:56 PM"
 * formatIsoDate(rawDate); 
 * 
 * Custom options for Date Only: "August 19, 2026"
 * formatIsoDate(rawDate, { dateStyle: "long" }); 
 * 
 * Custom options for Relative/Short: "08/19/2026"
 * formatIsoDate(rawDate, { month: "2-digit", day: "2-digit", year: "numeric" });
 */
export const formatIsoDate = (
    isoString?: string | null,
    options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    },
): string => {
    if (!isoString) return "";

    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-US", options).format(date);
};

/**
 * Transforms ISO durations (e.g. "PT3.030515S", "PT1M45S", "PT1H2M") 
 * into readable text like "3 secs", "1 min 45 secs", or "1 hr 2 mins".
 */
export function formatDurationTaken(durationStr?: string | null): string {
    if (!durationStr) return "0 secs";

    const regex = /PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?/;
    const matches = durationStr.match(regex);
    if (!matches) return "0 secs";

    const hours = Math.floor(parseFloat(matches[1] || "0"));
    const minutes = Math.floor(parseFloat(matches[2] || "0"));
    const seconds = Math.round(parseFloat(matches[3] || "0"));

    const parts: string[] = [];

    if (hours > 0) {
        parts.push(`${hours} ${hours === 1 ? "hr" : "hrs"}`);
    }
    if (minutes > 0) {
        parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);
    }
    if (seconds > 0 || parts.length === 0) {
        parts.push(`${seconds} ${seconds === 1 ? "sec" : "secs"}`);
    }

    return parts.join(" ");
}