import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

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
    Array.from({ length: n }, (_, i) => ({
      value: Math.floor(20 + Math.random() * 78),
      state: "default" as Bar["state"],
    }));

  // Bubble sort generator with state updates
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
        // Reset all to default briefly
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

  const barColor = (state: Bar["state"]) => {
    if (state === "comparing") return "bg-cyan-400 shadow-[0_0_12px_#00d4ff]";
    if (state === "sorted") return "bg-indigo-400 shadow-[0_0_10px_#818cf8]";
    return "bg-indigo-700/70";
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
      className="px-3 py-1 rounded-full text-xs font-medium border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 whitespace-nowrap"
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
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-sm hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-colors duration-300"
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      {/* subtle glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-indigo-500/5 to-transparent" />
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const bars = useHeroSort();
  const [algoIdx, setAlgoIdx] = useState(0);

  // Cycle algo label
  useEffect(() => {
    const id = setInterval(
      () => setAlgoIdx((i) => (i + 1) % ALGO_LABELS.length),
      2200
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-[#080C18] text-white font-sans selection:bg-indigo-500/40 overflow-x-hidden">
      {/* ── Background grid + glow ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

      {/* ── Nav ── */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.06]"
      >
        <div className="flex items-center gap-2">
          {/* Logo mark */}
          <div className="flex items-end gap-[2px] h-5">
            {[3, 5, 4, 7, 6, 4].map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-t-[1px] bg-indigo-400"
                style={{ height: `${h * 3}px` }}
              />
            ))}
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Algo<span className="text-indigo-400">Sort</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Algorithms</a>
          <a href="#" className="hover:text-white transition-colors">Docs</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium text-white transition-colors"
        >
          Launch App →
        </motion.button>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-20 pb-16 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Interactive Algorithm Visualizer
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
        >
          See Sorting{" "}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400">
              Come Alive
            </span>
            <motion.span
              className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-indigo-400 to-cyan-400"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              style={{ originX: 0 }}
            />
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
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
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-base shadow-lg shadow-indigo-500/25 transition-all"
          >
            Start Visualizing →
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-base backdrop-blur-sm transition-all"
          >
            View on GitHub
          </motion.button>
        </motion.div>

        {/* ── Live Visualizer Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 shadow-2xl shadow-black/40 mb-8"
        >
          {/* Window dots */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <div className="ml-4 flex items-center gap-2">
              <span className="text-xs text-slate-500">Running:</span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={algoIdx}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.3 }}
                  className="text-xs font-mono text-cyan-400"
                >
                  {ALGO_LABELS[algoIdx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Bars */}
          <HeroBars bars={bars} />

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-5 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" /> Comparing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-400" /> Sorted
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-indigo-700" /> Unsorted
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
      <section className="relative z-10 max-w-2xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-3 divide-x divide-white/[0.08] border border-white/[0.08] rounded-2xl bg-white/[0.02] backdrop-blur-sm overflow-hidden"
        >
          {STATS.map(({ value, label }, i) => (
            <div key={i} className="flex flex-col items-center py-7 px-4">
              <span className="text-3xl font-bold text-white mb-1">{value}</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-400 mb-3 font-medium">
            Why AlgoSort
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Built for learners who want to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              actually get it
            </span>
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
          className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-br from-indigo-600/15 via-violet-600/10 to-transparent p-10 md:p-14 text-center"
        >
          {/* Glow orbs */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-indigo-500/15 blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-cyan-500/10 blur-[60px] pointer-events-none" />

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to master sorting?
          </h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            No setup. No install. Open your browser and start learning in
            seconds.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-lg shadow-indigo-500/30 transition-all"
          >
            Start Visualizing — It's Free →
          </motion.button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 md:px-12 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-end gap-[2px] h-4">
              {[3, 5, 4, 7, 6, 4].map((h, i) => (
                <div key={i} className="w-[2px] rounded-t-[1px] bg-indigo-400/60" style={{ height: `${h * 2.5}px` }} />
              ))}
            </div>
            <span className="text-sm font-semibold text-white/70">
              Algo<span className="text-indigo-400">Sort</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Built with ❤️ for CS students everywhere
          </p>
          <div className="flex gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}