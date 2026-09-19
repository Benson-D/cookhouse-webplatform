/**
 * Stand-in photography for a recipe with no `coverImageUrl` yet. Hashing the
 * id keeps a given recipe's colour stable instead of reshuffling on every
 * render.
 */
const DISH_GRADIENTS = [
  "linear-gradient(150deg, #E2A34C 0%, #C9722F 55%, #9C4E27 100%)",
  "linear-gradient(150deg, #8CA85C 0%, #5C7A3C 55%, #38512A 100%)",
  "linear-gradient(150deg, #EBC886 0%, #D69F4E 55%, #A96F2E 100%)",
  "linear-gradient(150deg, #E9A183 0%, #D2734F 55%, #9E4C33 100%)",
  "linear-gradient(150deg, #DE8B5C 0%, #C1462F 55%, #8C2A22 100%)",
  "linear-gradient(150deg, #D4A878 0%, #A9713F 55%, #6E4426 100%)",
];

// FNV-1a: recipe ids are Prisma cuids, which share a timestamp-derived
// prefix for anything created within the same session — a plain
// `hash * 31 + char` accumulator weights that shared prefix so heavily that
// a batch of recipes created back to back kept landing on the same
// gradient. FNV-1a's multiply-and-mix-every-step keeps a few differing
// trailing characters from getting drowned out.
function hashToSeed(seed: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

/** Mulberry32 — a small, fast PRNG that always produces the same sequence for a given seed. */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates, doesn't mutate `items`. */
function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

/** Seeds the shuffle with the id itself, so the same recipe always lands on the same gradient. */
export function placeholderGradient(seed: string): string {
  const random = seededRandom(hashToSeed(seed));
  return shuffle(DISH_GRADIENTS, random)[0];
}
