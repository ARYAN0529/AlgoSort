import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Bar {
  value: number;
  state: "default" | "comparing" | "sorted" | "pivot";
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ALGO_LABELS = ["Bubble Sort", "Quick Sort", "Merge Sort", "Heap Sort", "Insertion Sort"];

const FEATURES = [
  {
    icon: "⚡",
    title: "Real-time Visualization",
    desc: "Watch every comparison and swap happen frame-by-frame with precise timing control.",
  },
  {
    icon: "🧠",
    title: "10+ Algorithms",
    desc: "From classic Bubble Sort to advanced Radix Sort — all beautifully animated.",
  },
  {
    icon: "📊",
    title: "Live Complexity",
    desc: "Time & space complexity updates live as the algorithm runs. Learn by seeing.",
  },
  {
    icon: "🎛️",
    title: "Full Control",
    desc: "Pause, step forward, rewind, adjust speed — you're in the director's chair.",
  },
];

const STATS = [
  { value: "10+", label: "Algorithms" },
  { value: "60fps", label: "Animations" },
  { value: "∞", label: "Array Sizes" },
];

// ─── Sorting animation hook ───────────────────────────────────────────────────
function useHeroSort() {
  const [bars, setBars] = useState<Bar[]>([]);
  const running = useRef(true);

  const sleep = (ms: number) =>
    new Promise<void>((res) => setTimeout(res, ms));

  const randomArray = (n = 18) =>
    Array.from({ length: n }, () => ({
      value: Math.floor(20 + Math.random() * 78),
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
        await sleep(80);
        if (a[j].value > a[j + 1].value) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
        }
        a[j].state = "default";
        a[j + 1].state = "default";
      }
      a[n - 1 - i].state = "sorted";
    }
    a[0].state = "sorted";
    setBars([...a]);
    await sleep(900);
  }

  useEffect(() => {
    running.current = true;
    let mounted = true;

    async function loop() {
      while (mounted) {
        const arr = randomArray(18);
        setBars(arr);
        await sleep(600);
        if (!mounted) break;
        await bubbleSort(arr);
        if (!mounted) break;
        setBars(arr.map((b) => ({ ...b, state: "default" })));
        await sleep(500);
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroBars({ bars }: { bars: Bar[] }) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);

  // White theme bar colors — no neon, just calm indigo + slate
  const barColor = (state: Bar["state"]) => {
    if (state === "comparing") return "bg-indigo-500";
    if (state === "sorted")    return "bg-slate-500";
    return "bg-slate-200";
  };

  return (
    <div className="flex items-end justify-center gap-[3px] h-48 w-full">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className={`rounded-t-sm flex-1 max-w-[28px] transition-colors duration-150 ${barColor(bar.state)}`}
          animate={{ height: `${(bar.value / maxVal) * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
        />
      ))}
    </div>
  );
}

function AlgoChip({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      // Subtle bordered pill, no color fill
      className="px-3 py-1 rounded-full text-xs font-medium border border-slate-200 bg-white text-slate-600 whitespace-nowrap shadow-sm"
    >
      {label}
    </motion.span>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  delay,
}: {
  icon: string;
  title: string;
  desc: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      // White card with a clean border and a gentle shadow — no glow
      className="relative rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-slate-200 transition-shadow duration-300"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-slate-900 font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const bars = useHeroSort();
  const [algoIdx, setAlgoIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setAlgoIdx((i) => (i + 1) % ALGO_LABELS.length),
      2200
    );
    return () => clearInterval(id);
  }, []);

  return (
    // Pure white background, dark text
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 overflow-x-hidden">

      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        // Clean white nav with a light bottom border — no blur, no dark bg
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-slate-100 bg-white"
      >
        <div className="flex items-center gap-2">
          {/* Logo mark — indigo bars on white */}
          <div className="flex items-end gap-[2px] h-5">
            {[3, 5, 4, 7, 6, 4].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-t-[1px] bg-indigo-500"
                style={{ height: `${h * 3}px` }}
              />
            ))}
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Algo<span className="text-indigo-500">Sort</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">Algorithms</a>
          {/* <a href="#" className="hover:text-slate-900 transition-colors">Docs</a> */}
          <a href="#" className="hover:text-slate-900 transition-colors">About</a>
        </div>

        {/* Solid indigo button — calm, no gradient */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-sm font-medium text-white transition-colors"
        >
          Start
        </motion.button>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-16 text-center">

        {/* Badge — light indigo tint, no border glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 text-xs font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          Interactive Algorithm Visualizer
        </motion.div>

        {/* Headline — dark on white, no gradient text */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-slate-900"
        >
          See Sorting{" "}
          <span className="relative inline-block text-indigo-500">
            Come Alive
            {/* Underline accent — single calm indigo line */}
            <motion.span
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-indigo-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{ originX: 0 }}
            />
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Stop memorizing. Start understanding. AlgoSort turns abstract sorting
          algorithms into living, breathing animations you can pause, rewind, and
          explore at your own pace.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
        >
          {/* Primary — solid indigo, no gradient */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => (window.location.href = "/visualizer")}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-base shadow-md shadow-indigo-100 transition-all"
          >
            Start Visualizing
          </motion.button>

          {/* Secondary — bordered, white bg */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base transition-all"
          >
            View on GitHub
          </motion.button>
        </motion.div>

        {/* ── Live Visualizer Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          // White card with a border and a soft shadow — no dark glass
          className="relative rounded-2xl border border-slate-100 bg-white shadow-lg p-6 md:p-8 mb-8"
        >
          {/* Window dots */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-400/70" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
            <span className="w-3 h-3 rounded-full bg-green-400/70" />
            <div className="ml-4 flex items-center gap-2">
              <span className="text-xs text-slate-400">Running:</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={algoIdx}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  // Indigo label, no neon cyan
                  className="text-xs font-mono text-indigo-500"
                >
                  {ALGO_LABELS[algoIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Bars */}
          <HeroBars bars={bars} />

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Comparing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" /> Sorted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-200" /> Unsorted
            </span>
          </div>
        </motion.div>

        {/* Algo chips */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {ALGO_LABELS.map((label, i) => (
            <AlgoChip key={label} label={label} delay={0.6 + i * 0.08} />
          ))}
          <AlgoChip label="+ 5 more" delay={1.05} />
        </div>
      </section>

      {/* ── Stats ── */}
      {/* Light grey strip to break up the white — subtle section separator */}
      <section className="relative z-10 bg-slate-50 border-y border-slate-100 py-2">
        <div className="max-w-2xl mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {STATS.map(({ value, label }, i) => (
              <div key={i} className="flex flex-col items-center py-7 px-4">
                <span className="text-3xl font-bold text-slate-900 mb-1">{value}</span>
                <span className="text-xs text-slate-400 tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Eyebrow — plain text, no ALL CAPS tracking decoration */}
          <p className="text-indigo-500 text-sm font-medium mb-3">Why AlgoSort</p>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Built for learners who want to actually get it
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 0.1} />
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          // Indigo-tinted section — light, not dark
          className="rounded-3xl border border-indigo-100 bg-indigo-50 p-10 md:p-14 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Ready to master sorting?
          </h2>
          <p className="text-slate-500 mb-8 max-w-xl mx-auto">
            No setup. No install. Open your browser and start learning in seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-base shadow-md shadow-indigo-200 transition-all"
          >
            Start Visualizing — It's Free
          </motion.button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-100 bg-white px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-4">
              {[3, 5, 4, 7, 6, 4].map((h, i) => (
                <div key={i} className="w-[2px] rounded-t-[1px] bg-indigo-400" style={{ height: `${h * 2.5}px` }} />
              ))}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Algo<span className="text-indigo-500">Sort</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">
            @aryan.0529
          </p>
          <div className="flex gap-6 text-xs text-slate-400">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}