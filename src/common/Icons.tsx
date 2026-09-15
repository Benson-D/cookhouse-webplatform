import type { SVGProps } from "react";

/** Same stroke/cap/join as TabBarIcons, so any icon in the app reads as one set. */
const iconProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

type IconProps = { className?: string; width?: number; height?: number };

export function SearchIcon({ className, width = 16, height = 16 }: IconProps) {
  return (
    <svg {...iconProps} width={width} height={height} className={className}>
      <circle cx="10" cy="10" r="6" />
      <path d="M20 20l-5.5-5.5" />
    </svg>
  );
}

export function HouseIcon({ className, width = 16, height = 16 }: IconProps) {
  return (
    <svg {...iconProps} width={width} height={height} className={className}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
