import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type SectionLayoutProps = {
    children: ReactNode;
    title?: string;
    breadCrumbs?: { anchors: { text: string; uri: string }[] };
    description?: string;
};

export default function SectionLayout({
    children,
    title,
    breadCrumbs,
    description,
}: SectionLayoutProps) {
    const navigate = useNavigate();

    return (
        <section className="rounded-lg shadow-sm bg-slate-100 dark:bg-gray-800 dark:text-white">
            <div className="p-6 space-y-4">
                {(title || breadCrumbs || description) && (
                    <div>
                        <h3 className="text-secondary dark:text-slate-50 font-semibold">
                            {breadCrumbs
                                ? breadCrumbs.anchors.map((path, idx) => {
                                      const isLast =
                                          idx ===
                                          breadCrumbs.anchors.length - 1;
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
                                                  isLast ? "page" : undefined
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
                        <hr className="mt-2 border-slate-300 dark:border-slate-600" />
                    </div>
                )}
                <div>{children}</div>
            </div>
        </section>
    );
}
