import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "@cookhouse/api-contract";

/**
 * Prop types for the grocery-lists module, inferred from the router rather
 * than hand-written — same reasoning as `modules/recipes/types.ts`: a backend
 * shape change becomes a type error here instead of a runtime surprise.
 */
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type GroceryList = RouterOutputs["groceryLists"]["getActive"];
export type GroceryListItem = GroceryList["items"][number];
