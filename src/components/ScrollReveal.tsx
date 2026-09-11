import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  containerClassName?: string;
  textClassName?: string;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

/**
 * Splits its text children into individual word spans and drives three
 * independent ScrollTrigger-scrubbed animations as the block travels
 * through the viewport:
 *   1. the whole block rotates from `baseRotation`deg to 0deg
 *   2. each word fades from `baseOpacity` to 1, staggered 0.05s apart
 *   3. each word sharpens from `blurStrength`px of blur to 0px
 */
export default function ScrollReveal({
  children,
  containerClassName = "",
  textClassName = "",
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement | null>(null);

  const splitWords = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    return text.split(/(\s+)/).map((segment, index) => {
      if (segment.trim() === "") {
        return segment;
      }
      return (
        <span className="word inline-block will-change-[transform,filter,opacity]" key={index}>
          {segment}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const wordElements = el.querySelectorAll<HTMLElement>(".word");
    const ctx = gsap.context(() => {
      // 1. Rotation of the whole block, tied to scroll position.
      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          rotate: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: rotationEnd,
            scrub: true,
          },
        }
      );

      // 2. Per-word opacity, staggered.
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );

      // 3. Per-word blur, unrelated stagger so it settles a touch faster.
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [baseRotation, baseOpacity, blurStrength, rotationEnd, wordAnimationEnd]);

  return (
    <h2 ref={containerRef} className={containerClassName}>
      <span className={textClassName}>{splitWords}</span>
    </h2>
  );
}
