import type { SVGProps } from "react";

/** Same on all three so they read as one set, not three different hands. */
const iconProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  width: 20,
  height: 20,
  "aria-hidden": true,
};

type IconProps = { className?: string };

/** Recipes — echoes the app's own favicon. */
export function PotIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M5 9v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V9" />
      <path d="M4 9h16" />
      <path d="M3 8h2M19 8h2" />
    </svg>
  );
}

export function CartIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M4 4h2l2.2 11.2a2 2 0 0 0 2 1.6h6.6a2 2 0 0 0 2-1.6L20 8H7" />
      <circle cx="10" cy="20" r="1.4" />
      <circle cx="17" cy="20" r="1.4" />
    </svg>
  );
}

/** Receipt — ties to receipt scanning, not a generic card icon. */
export function ReceiptIcon({ className }: IconProps) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M6 3h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3V3Z" />
      <path d="M9 8h6M9 12h6M9 16h3" />
    </svg>
  );
}
