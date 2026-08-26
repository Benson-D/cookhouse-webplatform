import { CHButton } from "./CHButton/CHButton";

/** Not an approved design — extrapolated so a failure reads as part of the page, not a foreign alert box. Worth a real design pass. */
export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="px-[22px] py-6" role="alert">
      <div className="max-w-[62ch] border-l-2 border-accent pl-4 text-sm text-ink-soft">
        <p className="m-0">
          <strong className="font-semibold text-ink">{title}.</strong>{" "}
          {message ?? "The request didn't complete."}
        </p>
        {onRetry && (
          <CHButton variant="ghost" onClick={onRetry} className="mt-3">
            Try again
          </CHButton>
        )}
      </div>
    </div>
  );
}
