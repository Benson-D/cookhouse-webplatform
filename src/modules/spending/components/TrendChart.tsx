"use client";

import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { BarRectangleItem, BarShapeProps, LabelProps } from "recharts";
import { formatCurrency, formatMonthShort } from "../utils";
import type { TrendMonth } from "../types";

/** Bold, accent-colored month label under the selected bar; plain and faint otherwise. */
function MonthTick({
  x,
  y,
  payload,
  selectedMonth,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  selectedMonth: string | null;
}) {
  if (x === undefined || y === undefined || !payload) return null;
  const isSelected = payload.value === selectedMonth;

  return (
    <text
      x={x}
      y={y + 12}
      textAnchor="middle"
      fontSize={11}
      fontWeight={isSelected ? 700 : 400}
      fill={isSelected ? "var(--accent)" : "var(--ink-faint)"}
    >
      {formatMonthShort(payload.value)}
    </text>
  );
}

/** The dollar figure that floats above only the selected bar. */
function SelectedBarLabel({ x, y, width, value, selectedIndex, index }: LabelProps & { selectedIndex: number }) {
  if (index !== selectedIndex || typeof x !== "number" || typeof y !== "number" || typeof width !== "number") {
    return null;
  }
  return (
    <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize={12} fontWeight={600} fill="var(--ink)">
      {formatCurrency(Number(value))}
    </text>
  );
}

/** Solid for the selected bar, faded for the rest — `Cell` is deprecated in Recharts, so this is the `shape` prop's replacement for per-bar styling. */
function BarShape({ selectedIndex, ...rectangleProps }: BarShapeProps & { selectedIndex: number }) {
  return (
    <Rectangle
      {...rectangleProps}
      cursor="pointer"
      fill="var(--accent)"
      opacity={rectangleProps.index === selectedIndex ? 1 : 0.55}
    />
  );
}

/**
 * Months are bars, not a line — the data is discrete monthly buckets, and
 * each bar doubles as a tap target for `topItems`, which a point on a line
 * is a fuzzier thing to aim at.
 */
export function TrendChart({
  months,
  selectedMonth,
  onSelectMonth,
}: {
  months: TrendMonth[];
  selectedMonth: string | null;
  onSelectMonth: (monthKey: string) => void;
}) {
  const selectedIndex = months.findIndex((month) => month.month === selectedMonth);

  return (
    // A rounded panel behind the whole chart — bars, gridlines and axis
    // labels all sit inside it, not on the bare page background.
    <div className="rounded-[10px] bg-surface-2 pt-3 pr-2">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={months} margin={{ top: 24, right: 8, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line-soft)" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={<MonthTick selectedMonth={selectedMonth} />}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            width={44}
            tickFormatter={(value: number) => `$${value}`}
            tick={{ fontSize: 9.5, fill: "var(--ink-faint)" }}
          />
          <Bar
            dataKey="total"
            barSize={22}
            radius={[4, 4, 0, 0]}
            // A $0 month renders a zero-height bar with no clickable area at
            // all — this floors it to a thin sliver so every month stays a
            // real tap target, not just the ones with purchases.
            minPointSize={3}
            onClick={(data: BarRectangleItem) => onSelectMonth((data.payload as TrendMonth).month)}
            label={<SelectedBarLabel selectedIndex={selectedIndex} />}
            shape={(props: BarShapeProps) => <BarShape {...props} selectedIndex={selectedIndex} />}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
