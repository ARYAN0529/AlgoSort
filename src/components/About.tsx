import { useEffect, useRef, useState, memo } from "react";
import { motion } from "framer-motion";

// ─── Design tokens (match WelcomePage exactly) ────────────────────────────────
const BG = "#F7F7F5";
const ACCENT = "#0F6E5C";

// ─── Timeline ─────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    label: "The problem",
    heading: "Textbooks aren't enough.",
    body: "Sorting algorithms are taught the same way they've always been — a wall of pseudocode, a diagram with labeled boxes, and a homework problem. It works for some people. For most, it doesn't stick.",
  },
  {
    label: "The realization",
    heading: "Motion is the missing piece.",
    body: "The moment you watch a pivot partition an array in real time — and you can pause it, rewind it, slow it down — the algorithm stops being abstract. It becomes a thing that does something. That's the gap AlgoSort was built to close.",
  },
  {
    label: "The build",
    heading: "Started as a weekend project.",
    body: "AlgoSort started as a personal tool to prep for placements — a quick visualizer so sorting algorithms actually made sense before interviews. One algorithm became five. The weekend became a proper project.",
  },
  {
    label: "Where it's going",
    heading: "More algorithms. More depth.",
    body: "Graph traversal, dynamic programming, tree operations — the visualizer approach applies to all of it. AlgoSort is growing toward a full interactive CS fundamentals toolkit, one algorithm at a time.",
  },
];

// ─── Principle cards ──────────────────────────────────────────────────────────
const PRINCIPLES = [
  {
    letter: "S",
    title: "Show, don't tell",
    body: "Every claim about how an algorithm behaves should be visible in the animation, not just stated in a tooltip.",
  },
  {
    letter: "C",
    title: "Control is learning",
    body: "Passive watching teaches less than active stepping. You should be able to pause at any comparison and ask 'why was that swap made?'",
  },
  {
    letter: "H",
    title: "Honest complexity",
    body: "Big-O is only useful if you can connect it to actual work. AlgoSort shows real comparison counts alongside the formula.",
  },
];

// ─── Animated bar row (decorative, loops silently) ───────────────────────────
function AnimatedBars() {
  const [heights, setHeights] = useState(() =>
    Array.from({ length: 14 }, () => 20 + Math.random() * 70)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setHeights((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        const j = Math.floor(Math.random() * next.length);
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 900);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-end gap-1.5 h-16 mt-2">
      {heights.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-[2px] transition-all duration-700 ease-in-out"
          style={{ height: `${h}%`, backgroundColor: ACCENT, opacity: 0.18 + (h / 100) * 0.5 }}
        />
      ))}
    </div>
  );
}

// ─── Nav / Footer (same as Features) ─────────────────────────────────────────
function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5"
      style={{ backgroundColor: BG }}
    >
      <a href="/" className="flex items-center gap-3">
        <div className="flex items-end gap-[3px] h-6">
          {[3, 5, 4, 7, 6, 4].map((h, i) => (
            <div key={i} className="w-[3.5px] rounded-t-[1px] bg-neutral-900" style={{ height: `${h * 3.4}px` }} />
          ))}
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-900">
          Algo<span className="text-neutral-400">Sort</span>
        </span>
      </a>

      <div className="hidden md:flex items-center gap-10 text-[15px] font-medium text-neutral-500">
        <a href="/visualizer" className="hover:text-neutral-900 transition-colors">Visualizer</a>
        <a href="/features" className="hover:text-neutral-900 transition-colors">Features</a>
        <a href="/about" className="text-neutral-900 font-semibold">About</a>
      </div>

      <a
        href="/visualizer"
        className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-700 text-[14px] font-semibold text-white transition-colors"
      >
        Start Visualizing
      </a>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="w-full px-8 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex items-end gap-[3px] h-4">
            {[3, 5, 4, 7, 6, 4].map((h, i) => (
              <div key={i} className="w-[2.5px] rounded-t-[1px] bg-neutral-900" style={{ height: `${h * 2.2}px` }} />
            ))}
          </div>
          <span className="text-neutral-400 text-xs">
            © {new Date().getFullYear()} <span className="text-neutral-900 font-semibold">AlgoSort</span>
          </span>
        </div>
        <div className="flex items-center gap-6 text-xs font-medium text-neutral-500">
          <a href="/visualizer" className="hover:text-neutral-900 transition-colors">Visualizer</a>
          <a href="https://github.com/ARYAN0529/AlgoSort" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-900 transition-colors">GitHub</a>
          <a href="mailto:hello@algosort.dev" className="hover:text-neutral-900 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}

// ─── About Page ───────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900" style={{ backgroundColor: BG }}>
      <Nav />

      {/* ── Hero ── */}
      <section className="px-8 md:px-16 pt-16 pb-8 max-w-3xl mx-auto w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 text-[11px] font-medium mb-8"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}0D` }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
          The story
        </div>

        <h1 className="text-4xl md:text-[58px] font-semibold tracking-[-0.03em] leading-[1.1] mb-6">
          Sorting algorithms,<br />finally visible.
        </h1>

        <p className="text-neutral-500 text-lg leading-relaxed max-w-xl">
          AlgoSort is a free, open-source algorithm visualizer built by a CS student
          who got tired of not really understanding what the code was doing.
        </p>

        {/* decorative bar row */}
        <div className="mt-10 rounded-xl overflow-hidden border border-neutral-200 bg-white px-6 pt-5 pb-3">
          <p className="text-[11px] font-mono text-neutral-300 mb-1">// 14 elements, shuffling</p>
          <AnimatedBars />
        </div>
      </section>

      {/* ── Timeline ── */}
      <section className="px-8 md:px-16 py-16 max-w-3xl mx-auto w-full">
        <div className="relative">
          {/* vertical rule */}
          <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-neutral-200" />

          <div className="flex flex-col gap-10">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex gap-6">
                {/* dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 bg-white"
                    style={{ borderColor: i === 0 ? ACCENT : "#D4D4D4" }}
                  />
                </div>

                <div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
                    {item.label}
                  </p>
                  <p className="font-semibold text-[18px] text-neutral-900 mb-2 leading-snug">
                    {item.heading}
                  </p>
                  <p className="text-neutral-500 text-[15px] leading-relaxed max-w-lg">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Design principles ── */}
      <section className="px-8 md:px-16 pb-20 max-w-3xl mx-auto w-full">
        <div className="border-t border-neutral-200 pt-14">
          <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Design principles</p>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-[-0.025em] mb-10">
            Three things AlgoSort doesn't compromise on.
          </h2>

          <div className="flex flex-col gap-4">
            {PRINCIPLES.map((p, i) => (
              <div
                key={i}
                className="flex gap-5 items-start rounded-2xl border border-neutral-200 bg-white px-6 py-5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
                >
                  {p.letter}
                </div>
                <div>
                  <p className="font-semibold text-[15px] text-neutral-900 mb-1">{p.title}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Builder card ── */}
      <section className="px-8 md:px-16 pb-20 max-w-3xl mx-auto w-full">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8">
          <div className="flex items-start gap-5">
            {/* avatar placeholder — bars as identity */}
            <div
              className="w-14 h-14 rounded-xl flex-shrink-0 flex items-end gap-[2.5px] px-2.5 pb-2 border border-neutral-100"
              style={{ backgroundColor: `${ACCENT}0C` }}
            >
              {[4, 7, 5, 9, 6].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-[1.5px]"
                  style={{ height: `${h * 5}px`, backgroundColor: ACCENT, opacity: 0.7 }}
                />
              ))}
            </div>

            <div className="flex-1">
              <p className="font-semibold text-[15px] text-neutral-900">Aryan</p>
              <p className="text-[13px] text-neutral-400 mb-3">
                B.Tech CSE · JECRC University · Full-stack intern at SecretEye
              </p>
              <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                Built AlgoSort to make sense of sorting algorithms before campus placements.
                Ended up building something worth sharing. Still a student,
                still adding algorithms.
              </p>

              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/ARYAN0529"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  ARYAN0529
                </a>
                <a
                  href="https://leetcode.com/aryandz0529"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0z" />
                  </svg>
                  aryandz0529
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Open source note ── */}
      <section className="px-8 md:px-16 pb-24 max-w-3xl mx-auto w-full">
        <div
          className="rounded-2xl px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-5"
          style={{ backgroundColor: "#0F6E5C" }}
        >
          <div>
            <p className="font-semibold text-xl text-white mb-1">Fully open source.</p>
            <p className="text-[#A8D8CF] text-sm leading-relaxed max-w-sm">
              Fork it, break it, add an algorithm. PRs welcome — especially if
              you're a student building your portfolio too.
            </p>
          </div>
          <a
            href="https://github.com/ARYAN0529/AlgoSort"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white font-semibold text-sm hover:opacity-90 transition-opacity"
            style={{ color: ACCENT }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            View on GitHub
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}