interface LogoProps {
  className?: string;
}

/**
 * The King Kong mark: an aperture-blade ring (a nod to the camera iris
 * every frame passes through) wrapped around a KK monogram. Reads at
 * both header scale and large footer scale without a raster asset.
 */
export default function Logo({ className = "h-8 w-8" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="King Kong"
      role="img"
    >
      <circle cx="20" cy="20" r="18.5" stroke="currentColor" strokeOpacity="0.25" />
      <path
        d="M20 3.5A16.5 16.5 0 0 1 35.8 17"
        stroke="#E8B54A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M20 36.5A16.5 16.5 0 0 1 4.2 23"
        stroke="#E8B54A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <text
        x="20"
        y="25.5"
        textAnchor="middle"
        fontFamily="Manrope, sans-serif"
        fontWeight={700}
        fontSize="13"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        KK
      </text>
    </svg>
  );
}
