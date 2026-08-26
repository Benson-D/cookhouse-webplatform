export function SpendingHeader({ subtitle }: { subtitle: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-[22px] pb-2.5 pt-[18px]">
      <h1 className="m-0 font-display text-[19px] font-semibold text-ink">Spending</h1>
      <span className="tabular font-mono text-[11.5px] text-ink-faint">{subtitle}</span>
    </div>
  );
}
