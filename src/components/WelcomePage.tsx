import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Add BOTH to index.html <head>:
//
// Inter (body + UI):
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
//
// Dancing Script (cycling headline word only):
// <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400..700&display=swap" rel="stylesheet" />
//
// tailwind.config.js:
// fontFamily: { sans: ['Inter', 'sans-serif'], script: ['Dancing Script', 'cursive'] }

// ─── Types ────────────────────────────────────────────────────────────────────
interface Bar {
  value: number;
  state: "default" | "comparing" | "sorted" | "pivot";
}

// ─── Constants ────────────────────────────────────────────────────────────────
const HEADLINE_WORDS = [
  "Bubble Sort",
  "Quick Sort",
  "Merge Sort",
  "Heap Sort",
  "Insertion Sort",
];

const BG = "#F7F7F5"; // Notion's warm off-white — single source of truth for page bg
const ACCENT = "#0F6E5C"; // deep teal — used sparingly for the one animated headline word

// ─── CyclingWord ──────────────────────────────────────────────────────────────
// Fixed-width, center-locked word cycler: the box width is pinned to the
// longest word in the list, so the animation always slides through dead
// center regardless of how long or short the current word is.
const CyclingWord = memo(function CyclingWord({
  words,
  intervalMs = 2000,
}: {
  words: string[];
  intervalMs?: number;
}) {
  const [idx, setIdx] = useState(0);
  const maxChars = useRef(Math.max(...words.map((w) => w.length))).current;

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % words.length), intervalMs);
    return () => clearInterval(id);
  }, [words, intervalMs]);

  return (
    <span
      className="relative inline-flex justify-center items-center overflow-hidden align-bottom"
      style={{ height: "1.15em", width: `${maxChars + 1}ch` }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={idx}
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-110%", opacity: 0 }}
          transition={{ duration: 0.42, ease: [0.32, 0.72, 0, 1] }}
          className="font-normal"
          style={{
            fontFamily: "'Dancing Script', cursive",
            display: "inline-block",
            whiteSpace: "nowrap",
            textAlign: "center",
            color: ACCENT,
          }}
        >
          {words[idx]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
});

// ─── useHeroSort ──────────────────────────────────────────────────────────────
function useHeroSort() {
  const [bars, setBars] = useState<Bar[]>([]);
  const running = useRef(true);
  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

  const randomArray = (n = 20) =>
    Array.from({ length: n }, () => ({
      value: Math.floor(15 + Math.random() * 82),
      state: "default" as Bar["state"],
    }));

  async function bubbleSort(arr: Bar[]) {
    const a = arr.map((b) => ({ ...b }));
    const n = a.length;
    for (let i = 0; i < n - 1 && running.current; i++) {
      for (let j = 0; j < n - i - 1 && running.current; j++) {
        a[j].state = "comparing";
        a[j + 1].state = "comparing";
        setBars([...a]);
        await sleep(70);
        if (a[j].value > a[j + 1].value) [a[j], a[j + 1]] = [a[j + 1], a[j]];
        a[j].state = "default";
        a[j + 1].state = "default";
      }
      a[n - 1 - i].state = "sorted";
    }
    a[0].state = "sorted";
    setBars([...a]);
    await sleep(1000);
  }

  useEffect(() => {
    running.current = true;
    let mounted = true;
    async function loop() {
      while (mounted) {
        const arr = randomArray(20);
        setBars(arr);
        await sleep(500);
        if (!mounted) break;
        await bubbleSort(arr);
        if (!mounted) break;
        setBars(arr.map((b) => ({ ...b, state: "default" })));
        await sleep(600);
      }
    }
    loop();
    return () => {
      mounted = false;
      running.current = false;
    };
  }, []);

  return bars;
}

// ─── HeroBars ─────────────────────────────────────────────────────────────────
const barStateStyle: Record<Bar["state"], { backgroundColor: string }> = {
  comparing: { backgroundColor: "#111111" },
  sorted: { backgroundColor: "#737373" },
  pivot: { backgroundColor: "#111111" },
  default: { backgroundColor: "#C8C8C8" },
};

const HeroBars = memo(function HeroBars({ bars }: { bars: Bar[] }) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  return (
    <div className="flex items-end justify-center gap-[3px] h-52 w-full">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="rounded-t-[2px] flex-1 max-w-[26px]"
          style={barStateStyle[bar.state]}
          animate={{ height: `${(bar.value / maxVal) * 100}%` }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
        />
      ))}
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const bars = useHeroSort();
  const [algoIdx, setAlgoIdx] = useState(0);

  // drives the "running:" label inside the visualizer card — same 2s cadence
  useEffect(() => {
    const id = setInterval(() => setAlgoIdx((i) => (i + 1) % HEADLINE_WORDS.length), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    // ── full-viewport wrapper, bg = Notion warm off-white everywhere ──
    <div
      className="min-h-screen flex flex-col text-neutral-900 font-sans overflow-x-hidden"
      style={{ backgroundColor: BG }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          NAV — same bg, no border, no white box
      ════════════════════════════════════════════════════════════════════════ */}
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-50 flex items-center justify-between px-8 md:px-16 py-5"
        style={{ backgroundColor: BG }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-[3px] h-6">
            {[3, 5, 4, 7, 6, 4].map((h, i) => (
              <div
                key={i}
                className="w-[3.5px] rounded-t-[1px] bg-neutral-900"
                style={{ height: `${h * 3.4}px` }}
              />
            ))}
          </div>
          <span className="font-bold text-xl tracking-tight text-neutral-900">
            Algo<span className="text-neutral-400">Sort</span>
          </span>
        </div>

        {/* CTA button */}
        <motion.a
          href="/visualizer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-700 text-[14px] font-semibold text-white transition-colors"
        >
          Start Visualizing
        </motion.a>
      </motion.nav>

      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 md:px-12 pt-10 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-neutral-300 bg-white/80 text-xs font-medium mb-10"
          style={{ color: ACCENT }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ACCENT }} />
          Interactive Algorithm Visualizer
        </motion.div>

        {/* ── Headline ──
            Line 1: "See Sorting" — Inter, semibold (not extrabold)
            Line 2: CyclingWord   — Dancing Script, normal weight, accent color */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-5xl md:text-[76px] font-semibold tracking-[-0.03em] leading-[1.12] mb-6 text-neutral-900"
        >
          See Sorting
          <br />
          <CyclingWord words={HEADLINE_WORDS} intervalMs={2000} />
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="text-neutral-500 text-lg max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Stop memorizing. Start understanding. AlgoSort turns abstract sorting
          algorithms into animations you can pause, rewind, and explore at your own pace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          <motion.a
            href="/visualizer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-700 text-white font-semibold text-sm transition-colors"
          >
            Start Visualizing
          </motion.a>

          <motion.a
            href="https://github.com/ARYAN0529/AlgoSort"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-neutral-300 bg-white hover:border-neutral-500 text-neutral-600 font-semibold text-sm transition-colors"
          >
            View on GitHub
          </motion.a>
        </motion.div>

        {/* ── Live Visualizer Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white shadow-[0_4px_40px_rgba(0,0,0,0.08)] p-6 md:p-8"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-[6px] mb-6">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
            <div className="ml-3 flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-400 font-mono">running</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={algoIdx}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.22 }}
                  className="text-[11px] font-mono font-medium"
                  style={{ color: ACCENT }}
                >
                  {HEADLINE_WORDS[algoIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <HeroBars bars={bars} />

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-5 text-[11px] text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px] bg-neutral-900 inline-block" /> comparing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px] bg-neutral-500 inline-block" /> sorted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-[2px] bg-neutral-300 inline-block" /> unsorted
            </span>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          STATS — white band
      ════════════════════════════════════════════════════════════════════════ */}
     

      {/* ═══════════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <footer className="bg-white border-t border-neutral-200">
        <div className="w-full px-8 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex items-end gap-[3px] h-4">
              {[3, 5, 4, 7, 6, 4].map((h, i) => (
                <div
                  key={i}
                  className="w-[2.5px] rounded-t-[1px] bg-neutral-900"
                  style={{ height: `${h * 2.2}px` }}
                />
              ))}
            </div>
            <span className="text-neutral-400 text-xs">
              © {new Date().getFullYear()} <span className="text-neutral-900 font-semibold">AlgoSort</span>
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-neutral-500">
            <a href="/visualizer" className="hover:text-neutral-900 transition-colors duration-150">
              Visualizer
            </a>
            <a
              href="https://github.com/ARYAN0529/AlgoSort"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors duration-150"
            >
              GitHub
            </a>
            <a href="mailto:hello@algosort.dev" className="hover:text-neutral-900 transition-colors duration-150">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}