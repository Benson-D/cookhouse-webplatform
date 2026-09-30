"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BarShapeProps } from "recharts";
import { formatCurrency, formatStoreName, splitLabel } from "../utils";
import type { StoreSpend } from "../types";

/** "Other" is a leftover bucket, not a peer store, so it gets a muted fill instead of a sixth hue. */
function barFill(store: StoreSpend, index: number): string {
  return store.foldedStores ? "var(--ink-faint)" : `var(--cat-${index + 1})`;
}

/** Store name under its bar, wrapped onto two lines when it's too long for one. */
function StoreTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  if (x === undefined || y === undefined || !payload) return null;
  const lines = splitLabel(formatStoreName(payload.value));

  return (
    <text x={x} y={y + 12} textAnchor="middle" fontSize={10.5} fill="var(--ink-faint)">
      {lines.map((line, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : 13}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

const HOVER_HIGHLIGHT_WIDTH = 44;

/** The faint band behind a hovered bar, kept close to the bar instead of filling its whole column. */
function HoverHighlight({
  x,
  y,
  width,
  height,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}) {
  if (x === undefined || y === undefined || width === undefined || height === undefined)
    return null;
  return (
    <rect
      x={x + (width - HOVER_HIGHLIGHT_WIDTH) / 2}
      y={y}
      width={HOVER_HIGHLIGHT_WIDTH}
      height={height}
      rx={6}
      fill="var(--ink)"
      opacity={0.06}
    />
  );
}

/** A store's top items on hover — or, for "Other", which stores it folds together. */
function StoreTooltip({ active, store }: { active?: boolean; store?: StoreSpend }) {
  if (!active || !store) return null;

  const rows = store.foldedStores
    ? store.foldedStores.map((folded) => ({
        name: formatStoreName(folded.store),
        total: folded.total,
      }))
    : (store.topItems ?? []).map((item) => ({ name: item.name, total: item.total }));

  return (
    <div className="min-w-[180px] rounded-lg border border-line bg-surface px-3 py-2.5 text-[12.5px] shadow-frame">
      <div className="flex items-baseline justify-between gap-3 font-semibold text-ink">
        <span>{formatStoreName(store.store)}</span>
        <span className="tabular font-mono">{formatCurrency(store.total)}</span>
      </div>
      <div className="mt-1.5 flex flex-col gap-1 text-ink-soft">
        {rows.map((row) => (
          <div key={row.name} className="flex items-baseline justify-between gap-3">
            <span>{row.name}</span>
            <span className="tabular font-mono">{formatCurrency(row.total)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StoreChart({ stores }: { stores: StoreSpend[] }) {
  return (
    <div className="rounded-[10px] bg-surface-2 pt-3 pr-2">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={stores} margin={{ top: 24, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--ink)" strokeOpacity={0.12} />
          <XAxis
            dataKey="store"
            axisLine={false}
            tickLine={false}
            interval={0}
            height={40}
            tick={<StoreTick />}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(value: number) => `$${value}`}
            tick={{ fontSize: 9.5, fill: "var(--ink-faint)" }}
          />
          <Tooltip
            cursor={<HoverHighlight />}
            content={({ active, payload }) => (
              <StoreTooltip
                active={active}
                store={payload?.[0]?.payload as StoreSpend | undefined}
              />
            )}
          />
          <Bar
            dataKey="total"
            barSize={28}
            radius={[4, 4, 0, 0]}
            minPointSize={3}
            shape={(props: BarShapeProps) => (
              <Rectangle {...props} fill={barFill(props.payload as StoreSpend, props.index)} />
            )}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
