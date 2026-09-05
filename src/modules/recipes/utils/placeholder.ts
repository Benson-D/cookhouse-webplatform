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

export function placeholderGradient(seed: string): string {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) | 0;
  }
  return DISH_GRADIENTS[Math.abs(hash) % DISH_GRADIENTS.length];
}
