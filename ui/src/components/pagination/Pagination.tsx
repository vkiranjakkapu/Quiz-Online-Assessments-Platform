import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import ActionButton from "../button/ActionButton";

export type PaginationButtonsProps = {
    theme?: "primary" | "secondary";
    currentPage: number;
    totalPages: number;
    goToNextPage: () => void;
    goToPrevPage: () => void;
};

export function PaginationButtons({
    theme,
    currentPage,
    totalPages,
    goToNextPage,
    goToPrevPage,
}: PaginationButtonsProps) {
    return (
        <div className="space-y-2 text-start md:text-end">
            {/* Pagination buttons */}
            <div
                className={`inline-flex items-center rounded-lg outline outline-offset-2 ${theme == "primary" ? "outline-primary " : "outline-secondary "} overflow-hidden`}
            >
                <ActionButton
                    icon={ChevronLeftIcon}
                    resetStyles={`text-white ${theme == "primary" ? "bg-primary hover:bg-primary/60" : "bg-secondary hover:bg-secondary/60"} transition-colors duration-75`}
                    padding="p-1"
                    onClick={goToPrevPage}
                    disabled={currentPage == 1}
                />
                <ActionButton
                    icon={ChevronRightIcon}
                    resetStyles={`text-white ${theme == "primary" ? "bg-primary hover:bg-primary/60" : "bg-secondary hover:bg-secondary/60"} transition-colors duration-75`}
                    padding="p-1"
                    onClick={goToNextPage}
                    disabled={totalPages == currentPage}
                />
            </div>
            <span className="block lowercase text-sm">
                Showing page {currentPage} of {totalPages}
            </span>
        </div>
    );
}
