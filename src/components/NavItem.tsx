import { useState } from "react";

interface NavItemProps {
  label: string;
  href?: string;
  onClick?: () => void;
}

/**
 * A nav link whose label flies up and out on hover while an identical
 * duplicate flies up and in underneath it, so the text always appears
 * to "replace itself." The `cycle` counter is bumped on every mouse
 * enter and used as a React key on the two label spans — remounting
 * them each time guarantees a clean animation run even if the pointer
 * re-enters mid-animation, which a pure CSS :hover restart can't do
 * reliably.
 */
export default function NavItem({ label, href = "#", onClick }: NavItemProps) {
  const [cycle, setCycle] = useState(0);

  return (
    <a
      href={href}
      onClick={onClick}
      onMouseEnter={() => setCycle((c) => c + 1)}
      className="nav-hover pointer-events-auto relative inline-block h-[1.2em] overflow-hidden text-sm font-medium tracking-tight text-white/64 transition-colors duration-300 hover:text-white"
    >
      <span className="invisible whitespace-nowrap">{label}</span>
      <span key={`out-${cycle}`} className="nav-out absolute inset-0 whitespace-nowrap">
        {label}
      </span>
      <span
        key={`in-${cycle}`}
        className="nav-in absolute inset-0 translate-y-[150%] whitespace-nowrap opacity-0"
      >
        {label}
      </span>
    </a>
  );
}
