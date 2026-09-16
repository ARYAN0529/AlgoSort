import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Design tokens (match WelcomePage exactly) ────────────────────────────────
const BG = "#F7F7F5";
const ACCENT = "#0F6E5C";

// ─── Feature data ─────────────────────────────────────────────────────────────
const ALGORITHMS = [
  {
    name: "Bubble Sort",
    complexity: { time: "O(n²)", space: "O(1)" },
    tag: "Comparison",
    blurb:
      "The classic beginner algorithm. Each pass bubbles the largest unsorted element to its final position — satisfying to watch, inefficient at scale.",
    bars: [72, 34, 91, 18, 55, 43, 78, 26],
  },
  {
    name: "Quick Sort",
    complexity: { time: "O(n log n)", space: "O(log n)" },
    tag: "Divide & Conquer",
    blurb:
      "Picks a pivot, partitions around it, then recurses on both halves. Average-case king of in-place sorting — watch the pivot do its work.",
    bars: [45, 88, 22, 67, 11, 94, 33, 56],
  },
  {
    name: "Merge Sort",
    complexity: { time: "O(n log n)", space: "O(n)" },
    tag: "Divide & Conquer",
    blurb:
      "Splits down to single elements, then merges sorted pairs back up. Guaranteed O(n log n) regardless of input — the stable sort workhorse.",
    bars: [30, 60, 15, 85, 50, 20, 70, 40],
  },
  {
    name: "Heap Sort",
    complexity: { time: "O(n log n)", space: "O(1)" },
    tag: "Selection",
    blurb:
      "Builds a max-heap, then extracts the root repeatedly. In-place and cache-unfriendly — the algorithm that does the most work invisibly.",
    bars: [55, 20, 80, 35, 65, 10, 90, 45],
  },
  {
    name: "Insertion Sort",
    complexity: { time: "O(n²)", space: "O(1)" },
    tag: "Comparison",
    blurb:
      "Builds a sorted prefix one element at a time, shifting as it goes. Near-linear on almost-sorted data — the algorithm that rewards good input.",
    bars: [82, 78, 75, 44, 60, 30, 20, 10],
  },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Step-through mode",
    body:
      "Pause at any point in the sort and step forward or backward one comparison at a time. Every swap gets a reason.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" strokeLinecap="round" />
      </svg>
    ),
    title: "Speed control",
    body:
      "Drag from 1× to 16× playback. Slow enough to follow every swap, fast enough to watch 1,000-element arrays finish in seconds.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" strokeLinecap="round" />
      </svg>
    ),
    title: "Array generator",
    body:
      "Random, nearly-sorted, reversed, or custom input. The same algorithm behaves very differently on different data shapes — see it yourself.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Live complexity panel",
    body:
      "Comparison and swap counters update in real time alongside a running complexity curve — connect the formula to the actual work happening.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M4 6h16M4 12h8m-8 6h16" strokeLinecap="round" />
      </svg>
    ),
    title: "Side-by-side compare",
    body:
      "Run two algorithms on the same array simultaneously. Watch Quick Sort lap Bubble Sort — or see why Merge Sort beats Heap Sort on large inputs.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-5 h-5">
        <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Pseudocode trace",
    body:
      "The algorithm's pseudocode stays visible on the side. The active line highlights with each step — so you're reading code while watching it run.",
  },
];

// ─── Mini bar chart for algo cards ───────────────────────────────────────────
const MiniBar = memo(function MiniBar({ bars, active }) {
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-[2px] h-8">
      {bars.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-[1px] transition-all duration-300"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: active ? ACCENT : "#D4D4D4",
            opacity: active ? 0.85 : 1,
          }}
        />
      ))}
    </div>
  );
});

// ─── Algorithm card ───────────────────────────────────────────────────────────
const AlgoCard = memo(function AlgoCard({ algo, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer"
      style={{
        borderColor: active ? ACCENT : "#E5E5E5",
        backgroundColor: active ? "#F0FAF7" : "white",
        boxShadow: active ? `0 0 0 1px ${ACCENT}` : "none",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: active ? `${ACCENT}18` : "#F5F5F5",
            color: active ? ACCENT : "#737373",
          }}
        >
          {algo.tag}
        </span>
        <MiniBar bars={algo.bars} active={active} />
      </div>
      <p className="font-semibold text-[14px] text-neutral-900">{algo.name}</p>
      <div className="flex gap-3 mt-1">
        <span className="text-[11px] font-mono text-neutral-400">T: {algo.complexity.time}</span>
        <span className="text-[11px] font-mono text-neutral-400">S: {algo.complexity.space}</span>
      </div>
    </button>
  );
});

// ─── Nav / Footer (shared shell) ──────────────────────────────────────────────
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
        <a href="/features" className="text-neutral-900 font-semibold">Features</a>
        <a href="/about" className="hover:text-neutral-900 transition-colors">About</a>
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

// ─── Features Page ────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  const [activeAlgo, setActiveAlgo] = useState(0);
  const algo = ALGORITHMS[activeAlgo];

  return (
    <div className="min-h-screen flex flex-col font-sans text-neutral-900" style={{ backgroundColor: BG }}>
      <Nav />

      {/* ── Hero ── */}
      <section className="px-8 md:px-16 pt-16 pb-12 max-w-5xl mx-auto w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 text-[11px] font-medium mb-8"
          style={{ color: ACCENT, backgroundColor: `${ACCENT}0D` }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ACCENT }} />
          What's inside
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.1] mb-5 text-neutral-900">
          Everything you need to<br />
          <span style={{ color: ACCENT }}>actually understand</span> sorting.
        </h1>
        <p className="text-neutral-500 text-lg max-w-xl leading-relaxed">
          Not a textbook. Not a lecture. AlgoSort puts the algorithm in motion
          and puts you in control of it.
        </p>
      </section>

      {/* ── Algorithm Explorer ── */}
      <section className="px-8 md:px-16 pb-20 max-w-5xl mx-auto w-full">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-6 items-start">

          {/* Left — algo list */}
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-mono text-neutral-400 mb-2 uppercase tracking-widest">5 algorithms</p>
            {ALGORITHMS.map((a, i) => (
              <AlgoCard
                key={a.name}
                algo={a}
                active={i === activeAlgo}
                onClick={() => setActiveAlgo(i)}
              />
            ))}
          </div>

          {/* Right — detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAlgo}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
              className="rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 shadow-[0_2px_24px_rgba(0,0,0,0.06)]"
            >
              {/* window chrome */}
              <div className="flex items-center gap-[6px] mb-6">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                <span className="ml-3 text-[11px] font-mono text-neutral-400">{algo.name}.vis</span>
              </div>

              {/* Big bars */}
              <div className="flex items-end gap-[4px] h-36 mb-6">
                {algo.bars.map((v, i) => {
                  const max = Math.max(...algo.bars);
                  const pct = (v / max) * 100;
                  return (
                    <motion.div
                      key={i}
                      className="flex-1 rounded-t-[3px]"
                      style={{ backgroundColor: ACCENT, opacity: 0.75 + (pct / 100) * 0.25 }}
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.5, delay: i * 0.04, ease: [0.32, 0.72, 0, 1] }}
                    />
                  );
                })}
              </div>

              {/* Algo metadata */}
              <div className="border-t border-neutral-100 pt-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-xl text-neutral-900">{algo.name}</p>
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 inline-block"
                      style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
                    >
                      {algo.tag}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-neutral-400 mb-0.5">Time</p>
                    <p className="font-mono font-semibold text-[15px] text-neutral-900">{algo.complexity.time}</p>
                    <p className="text-[11px] text-neutral-400 mt-1.5 mb-0.5">Space</p>
                    <p className="font-mono font-semibold text-[15px] text-neutral-900">{algo.complexity.space}</p>
                  </div>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed">{algo.blurb}</p>

                <a
                  href="/visualizer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
                  style={{ color: ACCENT }}
                >
                  Visualize {algo.name}
                  <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Feature grid ── */}
      <section className="px-8 md:px-16 pb-24 max-w-5xl mx-auto w-full">
        <div className="border-t border-neutral-200 pt-16">
          <p className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest mb-3">Visualizer features</p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.025em] mb-12 text-neutral-900">
            Built for learners,<br />not just viewers.
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-neutral-200 rounded-2xl overflow-hidden border border-neutral-200">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 hover:bg-[#F7FBF9] transition-colors duration-200"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${ACCENT}12`, color: ACCENT }}
                >
                  {f.icon}
                </div>
                <p className="font-semibold text-[15px] text-neutral-900 mb-2">{f.title}</p>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="px-8 md:px-16 pb-24 max-w-5xl mx-auto w-full">
        <div
          className="rounded-2xl px-8 py-12 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{ backgroundColor: "#0F6E5C", color: "white" }}
        >
          <div>
            <p className="font-semibold text-2xl md:text-3xl tracking-tight leading-snug mb-2">
              Ready to see it move?
            </p>
            <p className="text-[#A8D8CF] text-sm leading-relaxed max-w-sm">
              Pick an algorithm, set your array size, and hit play. It clicks faster than you think.
            </p>
          </div>
          <a
            href="/visualizer"
            className="shrink-0 px-7 py-3.5 rounded-xl bg-white font-semibold text-sm transition-opacity hover:opacity-90"
            style={{ color: ACCENT }}
          >
            Open the Visualizer
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}