import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@cookhouse/api-contract";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type SpendingSummary = RouterOutputs["spending"]["summary"];
export type SpendingTrend = RouterOutputs["spending"]["trend"];
export type TrendMonth = SpendingTrend["months"][number];
export type SpendingTopItems = RouterOutputs["spending"]["topItems"];
export type TopItem = SpendingTopItems["items"][number];
export type SpendingByCategory = RouterOutputs["spending"]["byCategory"];
export type SpendingByStore = RouterOutputs["spending"]["byStore"];

/** This is the one shape `SpendBarList` renders — `byCategory`'s `category` and `byStore`'s `store` both map to `label`. */
export type SpendBarRow = { label: string; total: number };

export type RangePreset = "thisMonth" | "lastMonth" | "3mo" | "6mo" | "9mo" | "12mo" | "thisYear";

export type DateRange = { from: Date; to: Date };
