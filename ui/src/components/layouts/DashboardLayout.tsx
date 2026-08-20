import type { ReactNode } from "react";
import BodyLayout from "./BodyLayout";

export type DashboardLayoutProps = {
    children: ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    return (
        <BodyLayout>
            <div className="w-5/6 md:w-4/5 mx-auto my-8 space-y-4">
                {children}
            </div>
        </BodyLayout>
    );
}
