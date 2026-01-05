interface HeaderProps {
  title?: string;
  subtitle?: string;
  description?: string;
}

export function Header({
  title = "Bullet Journal",
  subtitle = "Sign in to your journal",
  description = "We'll send you a secure magic link",
}: HeaderProps) {
  return (
    <div className="space-y-3 sm:space-y-4 text-center mb-10 sm:mb-14">
      <div
        className="text-5xl sm:text-6xl md:text-7xl font-bold text-brown-800"
        style={{ fontFamily: "var(--font-caveat)" }}
      >
        {title}
      </div>
      <p className="text-base sm:text-lg font-medium text-tan-500">
        {subtitle}
      </p>
      <p className="text-xs sm:text-sm text-tan-400">{description}</p>
    </div>
  );
}
