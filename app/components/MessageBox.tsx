import { LinkIcon } from "./Icons";

interface SuccessMessageProps {
  title?: string;
  message?: string;
}

export function SuccessMessage({
  title = "Check your email!",
  message = "Click the magic link to sign in",
}: SuccessMessageProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl border-2 border-green-200 bg-green-50 animate-in fade-in duration-300">
      <div className="flex gap-3">
        <span className="text-xl flex-shrink-0">✓</span>
        <div>
          <p className="font-semibold text-sm sm:text-base text-green-900">
            {title}
          </p>
          <p className="text-xs sm:text-sm opacity-75 text-green-900">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export function ErrorMessage({
  title = "Something went wrong",
  message,
}: ErrorMessageProps) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl border-2 border-red-200 bg-red-50 animate-in fade-in duration-300">
      <div className="flex gap-3">
        <span className="text-xl flex-shrink-0">✕</span>
        <div>
          <p className="font-semibold text-sm sm:text-base text-red-900">
            {title}
          </p>
          <p className="text-xs sm:text-sm opacity-75 text-red-900">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

interface DebugLinkProps {
  debugLink: string;
}

export function DebugLink({ debugLink }: DebugLinkProps) {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="p-5 sm:p-6 rounded-2xl border-2 border-blue-200 bg-blue-50">
      <p className="font-medium text-xs sm:text-sm mb-3 text-blue-900 inline-flex items-center gap-1.5">
        <LinkIcon className="h-4 w-4" /> Dev: Magic Link
      </p>
      <a
        href={debugLink}
        className="text-blue-600 break-all hover:underline text-xs sm:text-sm font-mono"
      >
        {debugLink}
      </a>
    </div>
  );
}
