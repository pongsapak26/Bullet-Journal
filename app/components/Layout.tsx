import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return <div className="min-h-screen w-full bg-cream-300">{children}</div>;
}

interface PageHeaderProps {
  children: ReactNode;
  maxWidth?: "4xl" | "6xl";
}

export function PageHeader({ children, maxWidth = "6xl" }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-cream-300/95 backdrop-blur-sm border-b border-tan-300">
      <div className={`max-w-${maxWidth} mx-auto px-4 py-4`}>{children}</div>
    </header>
  );
}

interface PageMainProps {
  children: ReactNode;
  maxWidth?: "4xl" | "6xl";
  className?: string;
}

export function PageMain({
  children,
  maxWidth = "6xl",
  className = "",
}: PageMainProps) {
  return (
    <main className={`max-w-${maxWidth} mx-auto px-4 py-6 ${className}`}>
      {children}
    </main>
  );
}
