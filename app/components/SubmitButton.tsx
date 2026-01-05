interface SubmitButtonProps {
  isLoading?: boolean;
  isDisabled?: boolean;
  loadingText?: string;
  children?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function SubmitButton({
  isLoading = false,
  isDisabled = false,
  loadingText = "Sending...",
  children = "Send Magic Link",
  onClick,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading || isDisabled}
      className="w-full py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 text-white bg-brown-800 hover:bg-brown-900 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 hover:shadow-lg hover:shadow-brown-300"
      onClick={onClick}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
