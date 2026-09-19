/**
 * Stand-in photography for a recipe with no `coverImageUrl` yet.
 */
const DISH_GRADIENTS = [
  "linear-gradient(150deg, #E2A34C 0%, #C9722F 55%, #9C4E27 100%)",
  "linear-gradient(150deg, #8CA85C 0%, #5C7A3C 55%, #38512A 100%)",
  "linear-gradient(150deg, #EBC886 0%, #D69F4E 55%, #A96F2E 100%)",
  "linear-gradient(150deg, #E9A183 0%, #D2734F 55%, #9E4C33 100%)",
  "linear-gradient(150deg, #DE8B5C 0%, #C1462F 55%, #8C2A22 100%)",
  "linear-gradient(150deg, #D4A878 0%, #A9713F 55%, #6E4426 100%)",
];

/** Fisher-Yates, doesn't mutate `items`. */
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

// Picked once per id and cached in memory, not hashed from it — so a
// recipe's color stays put while browsing (flipping between pages, going
// back to one you already saw) without needing a deterministic algorithm.
// A full page reload clears this and everything gets reassigned.
const assigned = new Map<string, string>();

export function placeholderGradient(id: string): string {
  const existing = assigned.get(id);
  if (existing) return existing;

  const gradient = shuffle(DISH_GRADIENTS)[0];
  assigned.set(id, gradient);
  return gradient;
}
