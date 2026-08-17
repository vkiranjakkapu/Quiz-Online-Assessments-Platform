import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import ActionButton, { type ActionButtonProps } from "./ActionButton";

export type SectionLayoutProps = {
    children: ReactNode;
    title?: string;
    breadCrumbs?: { text: string; uri: string }[];
    description?: string;
    actionButtons?: ActionButtonProps[];
};

export default function SectionLayout({
    children,
    title,
    breadCrumbs,
    description,
    actionButtons,
}: SectionLayoutProps) {
    const navigate = useNavigate();

    return (
        <section className="rounded-lg shadow-sm bg-slate-50 dark:bg-gray-800 dark:text-white">
            <div className="p-6 space-y-4">
                {(title || breadCrumbs || description) && (
                    <>
                        <div className="flex flex-col md:flex-row justify-start md:justify-between w-full gap-2">
                            <div>
                                <h3 className="text-secondary dark:text-slate-50 font-semibold">
                                    {breadCrumbs
                                        ? breadCrumbs.map((path, idx) => {
                                              const isLast =
                                                  idx ===
                                                  breadCrumbs.length - 1;
                                              return (
                                                  <a
                                                      key={idx}
                                                      onClick={() => {
                                                          navigate(path.uri);
                                                      }}
                                                      className={`text-secondary cursor-pointer transition-colors duration-75 capitalize ${
                                                          isLast
                                                              ? "text-slate-500 dark:text-slate-100 pointer-events-none"
                                                              : "font-semibold hover:text-secondary dark:hover:text-secondary"
                                                      }`}
                                                      aria-current={
                                                          isLast
                                                              ? "page"
                                                              : undefined
                                                      }
                                                  >
                                                      {path.text}
                                                      {!isLast && (
                                                          <span className="text-slate-400 dark:text-white mx-1 select-none">
                                                              /
                                                          </span>
                                                      )}
                                                  </a>
                                              );
                                          })
                                        : title}
                                </h3>
                                {description && (
                                    <p className="text-sm">{description}</p>
                                )}
                            </div>

                            {actionButtons && actionButtons?.length != 0 && (
                                <div
                                    className="inline-flex flex-col md:self-center self-start rounded-lg shadow-sm outline-1 outline-offset-2 outline-primary md:flex-row"
                                    role="group"
                                >
                                    {actionButtons?.map((btn, idx) => {
                                        const isFirst = idx === 0;
                                        const isLast =
                                            idx === actionButtons!.length - 1;
                                        const roundedClass =
                                            isFirst && isLast
                                                ? "rounded-lg"
                                                : isFirst
                                                  ? actionButtons.length == 2
                                                      ? "border-e rounded-t-lg md:rounded-s-lg md:rounded-tr-none"
                                                      : "rounded-t-lg md:rounded-s-lg md:rounded-tr-none"
                                                  : isLast
                                                    ? "rounded-b-lg md:rounded-e-lg md:rounded-bl-none"
                                                    : "border-s border-e";
                                        return (
                                            <ActionButton
                                                text={btn.text}
                                                icon={btn.icon}
                                                onClick={btn.onClick}
                                                key={idx}
                                                theme={btn.theme}
                                                resetStyles={`${roundedClass} text-sm border-slate-200/70 dark:border-slate-900/70`}
                                                padding="py-1 px-1.5"
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <hr className="w-full border-slate-300 dark:border-slate-600" />
                    </>
                )}
                <div>{children}</div>
            </div>
        </section>
    );
}
