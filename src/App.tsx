import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Instagram, Linkedin, Youtube } from "lucide-react";
import ScrollReveal from "./components/ScrollReveal";
import Reveal from "./components/Reveal";
import NavItem from "./components/NavItem";
import Logo from "./components/Logo";

// Cinematic showreel loop used as the scroll-scrubbed background plate.
const VIDEO_URL = "/king-kong-reel.mp4";

const NAV_LINKS = ["Studio", "Work", "Craft", "Talent", "Contact"];

const EASE = [0.16, 1, 0.3, 1] as const;

export default function App() {
  const [arrowCycle, setArrowCycle] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const screen3Ref = useRef<HTMLDivElement | null>(null);

  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 500, 800], [0, 0, -150]);

  // ------------------------------------------------------------------
  // Scroll-driven video scrubbing.
  //
  // The video's currentTime is mapped to how far the page has scrolled,
  // from 0 at the very top to the video's full duration by the point
  // the footer is 20% of the viewport height away from the top of the
  // screen. A `video.seeking` guard is required: scroll fires far more
  // often than the browser can seek, so without the guard, rapid scroll
  // events queue up competing currentTime assignments and the video
  // visibly tears between frames instead of scrubbing smoothly.
  // ------------------------------------------------------------------
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number | null = null;

    const scrubToScroll = () => {
      rafId = null;

      if (!video.duration || Number.isNaN(video.duration)) return;
      if (video.seeking) return; // avoid queueing competing seeks

      const footer = screen3Ref.current;
      const viewportHeight = window.innerHeight;
      const footerTop = footer
        ? footer.getBoundingClientRect().top + window.scrollY
        : document.documentElement.scrollHeight - viewportHeight;

      // Scroll distance from top (0) to the point the footer sits at
      // 20% of the viewport height from the top of the screen (1).
      const endScroll = Math.max(footerTop - viewportHeight * 0.8, 1);
      const fraction = Math.min(Math.max(window.scrollY / endScroll, 0), 1);

      video.currentTime = fraction * video.duration;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(scrubToScroll);
    };

    const onLoadedMetadata = () => {
      setIsLoaded(true);
      scrubToScroll();
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // In case metadata is already available (cached video).
    if (video.readyState >= 1) onLoadedMetadata();

    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* 1. Fixed video background */}
      <div ref={videoContainerRef} className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition-opacity duration-1000 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/40" />
      </div>

      {/* 2. Fixed header */}
      <motion.header
        style={{ y: headerY }}
        className="pointer-events-none fixed inset-x-0 top-0 z-20 flex justify-center pt-8"
      >
        <div className="pointer-events-auto flex w-[90%] max-w-[1400px] items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 text-white">
            <Logo className="h-8 w-8 text-white" />
            <span className="font-mono text-[13px] tracking-tight text-white/90">
              KING&nbsp;KONG
            </span>
          </a>

          <nav className="flex items-center gap-9">
            {NAV_LINKS.map((label) => (
              <NavItem key={label} label={label} />
            ))}
            <a
              href="#contact"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.03]"
            >
              START A PROJECT
            </a>
          </nav>
        </div>
      </motion.header>

      {/* 3. Scrollable content */}
      <main className="pointer-events-none relative z-10">
        {/* ------------------------------------------------------------ */}
        {/* SECTION 1 — HERO                                              */}
        {/* ------------------------------------------------------------ */}
        <section className="flex min-h-screen w-full items-end justify-center pb-16">
          <div className="grid w-[90%] max-w-[1400px] grid-cols-12 items-end gap-x-6 gap-y-10">
            <div className="col-span-12 lg:col-span-7">
              <Reveal>
                <p className="pointer-events-auto mb-5 font-mono text-xs tracking-tight text-white/40">
                  Est. animation studio — frame by frame
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h1
                  className="pointer-events-auto font-sans font-medium leading-[0.98] text-white"
                  style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                >
                  Scaling The Impossible Into Motion
                </h1>
              </Reveal>
            </div>

            <div className="col-span-12 flex flex-col items-start gap-8 lg:col-span-5 lg:items-end lg:justify-self-end">
              <Reveal delay={0.2}>
                <p className="pointer-events-auto max-w-[460px] text-left text-base leading-relaxed text-white/60 lg:text-right">
                  We are <span className="font-semibold text-white">King Kong</span> — a
                  full-service animation studio that turns scripts, sketches and
                  half-finished ideas into characters and worlds an audience believes
                  in, no matter their scale.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <button
                  onMouseEnter={() => setArrowCycle((c) => c + 1)}
                  className="group pointer-events-auto flex items-center gap-3 rounded-full border border-white/10 bg-white/8 py-3 pl-6 pr-3 text-sm font-semibold text-white backdrop-blur-[80px] transition-colors duration-500 hover:bg-white hover:text-black"
                >
                  <span>Watch Showreel</span>
                  <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black/20 group-hover:bg-black/10">
                    <ArrowUpRight
                      key={`out-${arrowCycle}`}
                      className="arrow-out absolute h-4 w-4"
                    />
                    <ArrowUpRight
                      key={`in-${arrowCycle}`}
                      className="arrow-in absolute h-4 w-4 -translate-x-[250%] opacity-0"
                    />
                  </span>
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* SECTION 2 — CRAFT                                             */}
        {/* ------------------------------------------------------------ */}
        <section className="w-full py-40">
          <div className="mx-auto w-[90%] max-w-[1400px]">
            <ScrollReveal
              containerClassName="pointer-events-auto mb-20 max-w-[900px] font-sans font-medium text-white"
              textClassName="leading-[1.15]"
              baseOpacity={0.1}
              baseRotation={3}
              blurStrength={5}
            >
              We animate at the scale of imagination itself — from the breath in a
              single character's chest to a creature too large for reality to
              hold.
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
              <Reveal className="pointer-events-auto flex flex-col justify-between gap-10 bg-black/60 p-8 backdrop-blur-md">
                <Logo className="h-10 w-10 text-white" />
                <div>
                  <p className="mb-2 font-mono text-xs text-white/40">01 — Global Pipeline</p>
                  <p className="text-lg font-medium text-white">
                    One studio, three timezones, a single continuous production
                    line.
                  </p>
                </div>
              </Reveal>

              <Reveal
                delay={0.1}
                className="pointer-events-auto flex flex-col justify-between gap-10 bg-black/60 p-8 backdrop-blur-md"
              >
                <span className="font-mono text-xs text-white/25">02</span>
                <div>
                  <p className="mb-2 font-mono text-xs text-white/40">
                    Character Animation
                  </p>
                  <p className="text-lg font-medium text-white">
                    Rigging &amp; Performance — believable weight, breath and
                    intent in every take.
                  </p>
                </div>
              </Reveal>

              <Reveal
                delay={0.2}
                className="pointer-events-auto flex flex-col justify-between gap-10 bg-black/60 p-8 backdrop-blur-md"
              >
                <span className="font-mono text-xs text-white/25">03</span>
                <div>
                  <p className="mb-2 font-mono text-xs text-white/40">
                    VFX &amp; Compositing
                  </p>
                  <p className="text-lg font-medium text-white">
                    Render Pipeline — a farm built to hold worlds too big for a
                    single machine.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ */}
        {/* SECTION 3 — FOOTER                                            */}
        {/* ------------------------------------------------------------ */}
        <section ref={screen3Ref} className="w-full px-[5%] pb-8 pt-24">
          <Reveal className="pointer-events-auto mx-auto w-full max-w-[1400px]">
            <div
              className="overflow-hidden rounded-[28px] border p-10 md:p-16"
              style={{
                backgroundColor: "rgba(26,26,26,0.6)",
                backdropFilter: "blur(80px)",
                WebkitBackdropFilter: "blur(80px)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <div className="mb-20 flex flex-col items-start justify-between gap-10 border-b border-white/10 pb-16 md:flex-row md:items-end">
                <h2
                  className="font-sans font-medium leading-[0.98] text-white"
                  style={{ fontSize: "clamp(2rem, 5vw, 4rem)" }}
                >
                  Ready To Build
                  <br />
                  Your Next World?
                </h2>
                <a
                  href="#contact"
                  className="group flex shrink-0 items-center gap-3 rounded-full bg-white py-4 pl-7 pr-4 text-sm font-semibold text-black"
                >
                  <span>Start a Project</span>
                  <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-black/10">
                    <ArrowUpRight className="arrow-out absolute h-4 w-4" />
                    <ArrowUpRight className="arrow-in absolute h-4 w-4 -translate-x-[250%] opacity-0" />
                  </span>
                </a>
              </div>

              <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
                <div>
                  <div className="mb-4 flex items-center gap-2 text-white">
                    <Logo className="h-7 w-7" />
                    <span className="font-mono text-xs tracking-tight">KING KONG</span>
                  </div>
                  <p className="max-w-[220px] text-sm leading-relaxed text-white/40">
                    A premium animation studio giving scale to the impossible.
                  </p>
                </div>

                <div>
                  <p className="mb-4 text-sm font-medium text-white/60">Company</p>
                  <ul className="space-y-3 text-sm text-white/40">
                    <li><a href="#" className="transition-colors hover:text-white">Studio</a></li>
                    <li><a href="#" className="transition-colors hover:text-white">Work</a></li>
                    <li><a href="#" className="transition-colors hover:text-white">Talent</a></li>
                    <li><a href="#" className="transition-colors hover:text-white">Careers</a></li>
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-sm font-medium text-white/60">Services</p>
                  <ul className="space-y-3 text-sm text-white/40">
                    <li><a href="#" className="transition-colors hover:text-white">Character Animation</a></li>
                    <li><a href="#" className="transition-colors hover:text-white">VFX &amp; Compositing</a></li>
                    <li><a href="#" className="transition-colors hover:text-white">Motion Capture</a></li>
                    <li><a href="#" className="transition-colors hover:text-white">Previsualization</a></li>
                  </ul>
                </div>

                <div>
                  <p className="mb-4 text-sm font-medium text-white/60">Connect</p>
                  <div className="flex gap-4">
                    <a href="#" aria-label="Instagram" className="text-white/40 transition-colors hover:text-white">
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="text-white/40 transition-colors hover:text-white">
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a href="#" aria-label="YouTube" className="text-white/40 transition-colors hover:text-white">
                      <Youtube className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/25 md:flex-row md:items-center">
                <span className="font-mono">© 2026 King Kong Studios. All rights reserved.</span>
                <div className="flex gap-6 font-mono">
                  <a href="#" className="transition-colors hover:text-white/60">Privacy</a>
                  <a href="#" className="transition-colors hover:text-white/60">Terms</a>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </>
  );
}
