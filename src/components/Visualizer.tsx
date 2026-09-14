// Visualizer.jsx — AlgoSort interactive sorting page
// Matches the welcome page's design tokens: #F7F7F5 bg, neutral-900 dark, clean white cards
import { useState, useRef, useEffect, useCallback, memo } from "react";

// ─── DESIGN TOKENS (mirror welcome page) ──────────────────────────────────────
const PAGE_BG = "#F7F7F5";

// Bar state → colour (blue/orange/red/green matches the legend)
const BAR_COLORS = {
  default:   "#D1D5DB", // gray-300  — unsorted
  comparing: "#3B82F6", // blue-500  — being compared
  swapping:  "#F97316", // orange-400 — being swapped
  pivot:     "#EF4444", // red-500   — pivot element
  sorted:    "#22C55E", // green-500 — in final position
};

// Speed label → animation delay in ms per step
const SPEED_MS = { Slow: 120, Medium: 50, Fast: 12 };

const ALGORITHMS = [
  "Bubble Sort",
  "Selection Sort",
  "Insertion Sort",
  "Merge Sort",
  "Quick Sort",
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Build a fresh random array of { value, state } objects.
// Called once on mount + every time arraySize changes or user randomizes.
function makeArray(n) {
  return Array.from({ length: n }, () => ({
    value: Math.floor(8 + Math.random() * 90), // 8–97 so bars are never invisible
    state: "default",
  }));
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── SORTING ALGORITHMS ───────────────────────────────────────────────────────
// Convention:
//   arr       — live array (mutated in place)
//   push      — (arr) => void — call to flush state to React
//   cancelled — { current: bool } — set to true to abort mid-sort

async function bubbleSort(arr, push, cancelled, ms) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (cancelled.current) return;

      arr[j].state = "comparing";
      arr[j + 1].state = "comparing";
      push([...arr]);
      await sleep(ms);

      if (arr[j].value > arr[j + 1].value) {
        arr[j].state = "swapping";
        arr[j + 1].state = "swapping";
        push([...arr]);
        await sleep(ms);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }

      arr[j].state = "default";
      arr[j + 1].state = "default";
    }
    arr[n - 1 - i].state = "sorted"; // this bar is in its final spot
    push([...arr]);
  }
  arr[0].state = "sorted";
  push([...arr]);
}

async function selectionSort(arr, push, cancelled, ms) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    arr[minIdx].state = "pivot"; // current minimum candidate

    for (let j = i + 1; j < n; j++) {
      if (cancelled.current) return;

      arr[j].state = "comparing";
      push([...arr]);
      await sleep(ms);

      if (arr[j].value < arr[minIdx].value) {
        if (minIdx !== i) arr[minIdx].state = "default";
        minIdx = j;
        arr[minIdx].state = "pivot";
      } else {
        arr[j].state = "default";
      }
    }

    if (minIdx !== i) {
      arr[i].state = "swapping";
      arr[minIdx].state = "swapping";
      push([...arr]);
      await sleep(ms);
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      arr[minIdx].state = "default";
    }

    arr[i].state = "sorted";
    push([...arr]);
  }
  arr[n - 1].state = "sorted";
  push([...arr]);
}

async function insertionSort(arr, push, cancelled, ms) {
  arr[0].state = "sorted";
  push([...arr]);

  for (let i = 1; i < arr.length; i++) {
    if (cancelled.current) return;

    const key = arr[i].value;
    arr[i].state = "pivot"; // the element being inserted
    let j = i - 1;

    while (j >= 0 && arr[j].value > key) {
      if (cancelled.current) return;
      arr[j].state = "comparing";
      push([...arr]);
      await sleep(ms);

      arr[j + 1].value = arr[j].value;
      arr[j].state = "sorted";
      j--;
    }

    arr[j + 1].value = key;
    arr[j + 1].state = "sorted";
    push([...arr]);
    await sleep(ms);
  }
}

async function mergeSort(arr, push, cancelled, ms) {
  async function merge(l, m, r) {
    const left  = arr.slice(l, m + 1).map((b) => b.value);
    const right = arr.slice(m + 1, r + 1).map((b) => b.value);
    let i = 0, j = 0, k = l;

    while (i < left.length && j < right.length) {
      if (cancelled.current) return;

      arr[k].state = "comparing";
      push([...arr]);
      await sleep(ms);

      arr[k].value = left[i] <= right[j] ? left[i++] : right[j++];
      arr[k].state = "swapping";
      push([...arr]);
      await sleep(ms);

      arr[k].state = "default";
      k++;
    }

    while (i < left.length)  { arr[k].value = left[i++];  arr[k].state = "default"; k++; }
    while (j < right.length) { arr[k].value = right[j++]; arr[k].state = "default"; k++; }

    // Mark this merged segment as sorted
    for (let x = l; x <= r; x++) arr[x].state = "sorted";
    push([...arr]);
  }

  async function sort(l, r) {
    if (l >= r || cancelled.current) return;
    const m = Math.floor((l + r) / 2);
    await sort(l, m);
    await sort(m + 1, r);
    await merge(l, m, r);
  }

  await sort(0, arr.length - 1);
}

async function quickSort(arr, push, cancelled, ms) {
  async function partition(low, high) {
    const pivotVal = arr[high].value;
    arr[high].state = "pivot";
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (cancelled.current) return i;

      arr[j].state = "comparing";
      push([...arr]);
      await sleep(ms);

      if (arr[j].value < pivotVal) {
        i++;
        arr[i].state = "swapping";
        arr[j].state = "swapping";
        push([...arr]);
        await sleep(ms);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        arr[i].state = "default";
      }
      arr[j].state = "default";
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    arr[i + 1].state = "sorted";
    arr[high].state = "default";
    push([...arr]);
    return i + 1;
  }

  async function sort(low, high) {
    if (low >= high || cancelled.current) return;
    const pi = await partition(low, high);
    await sort(low, pi - 1);
    await sort(pi + 1, high);
  }

  await sort(0, arr.length - 1);

  if (!cancelled.current) {
    arr.forEach((b) => (b.state = "sorted"));
    push([...arr]);
  }
}

const ALGO_FNS = {
  "Bubble Sort":    bubbleSort,
  "Selection Sort": selectionSort,
  "Insertion Sort": insertionSort,
  "Merge Sort":     mergeSort,
  "Quick Sort":     quickSort,
};

// ─── VIZ BARS ─────────────────────────────────────────────────────────────────
// Pure rendering component — no framer-motion so it stays fast at 100 bars.
// Bar width is calculated from the container so bars always fill the canvas.
const VizBars = memo(function VizBars({ bars }) {
  const maxVal = Math.max(...bars.map((b) => b.value), 1);
  const gap    = bars.length > 60 ? 1 : bars.length > 30 ? 2 : 3;

  return (
    <div
      className="flex items-end justify-center w-full h-full"
      style={{ gap }}
    >
      {bars.map((bar, i) => (
        <div
          key={i}
          style={{
            // flex-1 would overflow; use calc so bars always sum to 100% width
            flex: "1 1 0",
            maxWidth: Math.max(2, Math.floor(860 / bars.length) - gap),
            height: `${(bar.value / maxVal) * 100}%`,
            backgroundColor: BAR_COLORS[bar.state] ?? BAR_COLORS.default,
            borderRadius: "2px 2px 0 0",
            transition: "background-color 0.05s ease",
          }}
        />
      ))}
    </div>
  );
});

// ─── LOGO BARS (nav mini-logo) ────────────────────────────────────────────────
function LogoBars() {
  const heights = [3, 5, 4, 7, 6, 4];
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 24 }}>
      {heights.map((h, i) => (
        <div
          key={i}
          className="rounded-t-[1px] bg-neutral-900"
          style={{ height: h * 3.2, width: 3.5 }}
        />
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Visualizer() {
  // ── Controls ──
  const [selectedAlgo, setSelectedAlgo] = useState("Merge Sort");
  const [arraySize,    setArraySize]    = useState(30);
  const [speed,        setSpeed]        = useState("Medium");
  const [isDropOpen,   setIsDropOpen]   = useState(false);

  // ── Sort state ──
  const [isSorting, setIsSorting] = useState(false);
  const [isDone,    setIsDone]    = useState(false);

  // ── Array — stable ref prevents random re-rolls on every render ──
  const arrRef  = useRef(makeArray(30));
  const [bars, setBarsState] = useState(arrRef.current);
  // setBars updates both the live ref and React state
  const setBars = useCallback((next) => {
    arrRef.current = Array.isArray(next) ? next : next(arrRef.current);
    setBarsState([...arrRef.current]);
  }, []);

  // ── Cancel flag shared with async sort functions ──
  const cancelledRef = useRef(false);

  // ── Close dropdown when clicking outside ──
  const dropRef = useRef(null);
  useEffect(() => {
    function onOutsideClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setIsDropOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  // ── Rebuild array when size slider moves (only when idle) ──
  useEffect(() => {
    if (isSorting) return;
    const fresh = makeArray(arraySize);
    arrRef.current = fresh;
    setBarsState([...fresh]);
    setIsDone(false);
  }, [arraySize]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ──
  const handleRandomize = useCallback(() => {
    if (isSorting) return;
    const fresh = makeArray(arraySize);
    arrRef.current = fresh;
    setBarsState([...fresh]);
    setIsDone(false);
  }, [isSorting, arraySize]);

  const handleSort = useCallback(async () => {
    if (isSorting || isDone) return;

    cancelledRef.current = false;
    setIsSorting(true);

    // Reset all bar states before starting
    const working = arrRef.current.map((b) => ({ ...b, state: "default" }));
    arrRef.current = working;
    setBarsState([...working]);

    const fn = ALGO_FNS[selectedAlgo];
    if (fn) {
      await fn(
        working,
        (next) => {
          arrRef.current = next;
          setBarsState([...next]);
        },
        cancelledRef,
        SPEED_MS[speed],
      );
    }

    if (!cancelledRef.current) setIsDone(true);
    setIsSorting(false);
  }, [isSorting, isDone, selectedAlgo, speed]);

  const handleStop = useCallback(() => {
    cancelledRef.current = true;
    setIsSorting(false);
  }, []);

  const handleAlgoSelect = (algo) => {
    if (isSorting) return;
    setSelectedAlgo(algo);
    setIsDropOpen(false);
    setIsDone(false);
  };

  // ── Step counter display ──
  const sortLabel = isSorting
    ? "Sorting…"
    : isDone
    ? "Done ✓"
    : "Sort";

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: PAGE_BG }}>

      {/* ══════════════ NAV ══════════════ */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-neutral-200"
        style={{ backgroundColor: PAGE_BG }}
      >
        <a href="/" className="flex items-center gap-2.5">
          <LogoBars />
          <span className="font-bold text-xl tracking-tight text-neutral-900">
            Algo<span className="text-neutral-400">Sort</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-500">
          <a href="/"            className="hover:text-neutral-900 transition-colors">Home</a>
          <a href="#"            className="text-neutral-900 font-semibold">Visualizer</a>
          <a
            href="https://github.com/ARYAN0529"
            target="_blank" rel="noopener noreferrer"
            className="hover:text-neutral-900 transition-colors"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* ══════════════ MAIN CONTENT ══════════════ */}
      <main className="max-w-[920px] mx-auto px-4 py-10">

        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Visualizer</h1>
          <p className="text-neutral-500 text-sm mt-1">
            Pick an algorithm, set the size and speed, then hit Sort.
          </p>
        </div>

        {/* ══ Control Bar ══ */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm px-6 py-5 mb-4">
          <div className="flex flex-wrap items-end justify-start gap-6">

            {/* Algorithm dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 tracking-wide">
                Algorithm
              </label>
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => !isSorting && setIsDropOpen((p) => !p)}
                  disabled={isSorting}
                  className="flex items-center justify-between gap-3 w-44 px-3 py-2 border border-neutral-300 rounded-lg bg-white text-sm text-neutral-800 font-medium
                             hover:border-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-400
                             transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {selectedAlgo}
                  <svg
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isDropOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown list */}
                {isDropOpen && (
                  <ul className="absolute z-20 top-full mt-1 w-44 bg-white border border-neutral-200 rounded-xl shadow-xl overflow-hidden">
                    {ALGORITHMS.map((algo) => (
                      <li
                        key={algo}
                        onClick={() => handleAlgoSelect(algo)}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors select-none ${
                          algo === selectedAlgo
                            ? "bg-neutral-100 font-semibold text-neutral-900"
                            : "text-neutral-600 hover:bg-neutral-50"
                        }`}
                      >
                        {algo}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Size slider */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 tracking-wide">
                Size — <span className="text-neutral-900">{arraySize}</span>
              </label>
              <input
                type="range"
                min={5} max={100}
                value={arraySize}
                disabled={isSorting}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="w-36 cursor-pointer accent-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            {/* Speed */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-neutral-500 tracking-wide">
                Speed
              </label>
              <select
                value={speed}
                disabled={isSorting}
                onChange={(e) => setSpeed(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg bg-white text-sm text-neutral-800 font-medium
                           focus:outline-none focus:ring-2 focus:ring-neutral-400 transition
                           cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option>Slow</option>
                <option>Medium</option>
                <option>Fast</option>
              </select>
            </div>

            {/* Spacer — pushes buttons to the right on wide screens */}
            <div className="flex-1" />

            {/* Action buttons */}
            <div className="flex items-end gap-2">
              <button
                onClick={handleRandomize}
                disabled={isSorting}
                className="px-4 py-2 border border-neutral-300 rounded-lg text-sm font-medium text-neutral-700
                           bg-white hover:bg-neutral-50 transition
                           disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Randomize
              </button>

              {isSorting ? (
                <button
                  onClick={handleStop}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={handleSort}
                  disabled={isDone}
                  className="px-6 py-2 bg-neutral-900 hover:bg-neutral-700 text-white text-sm font-semibold
                             rounded-lg shadow-sm transition-colors
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sortLabel}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ══ Canvas ══
            Fixed height white card — bars render inside, pinned to bottom edge */}
        <div
          className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden"
          style={{ height: 420, padding: "20px 20px 0" }}
        >
          <VizBars bars={bars} />
        </div>

        {/* ══ Legend ══ */}
        <div className="flex flex-wrap justify-center gap-5 mt-4 text-sm text-neutral-500">
          {[
            { color: BAR_COLORS.comparing, label: "Comparing" },
            { color: BAR_COLORS.swapping,  label: "Swapping"  },
            { color: BAR_COLORS.pivot,     label: "Pivot"     },
            { color: BAR_COLORS.sorted,    label: "Sorted"    },
            { color: BAR_COLORS.default,   label: "Unsorted"  },
          ].map(({ color, label }) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: color }} />
              {label}
            </span>
          ))}
        </div>

        {/* ══ Algorithm info strip ══ */}
        <div className="mt-8 bg-white rounded-2xl border border-neutral-200 shadow-sm px-6 py-5">
          <AlgoInfo algo={selectedAlgo} />
        </div>

      </main>
    </div>
  );
}

// ─── ALGO INFO ────────────────────────────────────────────────────────────────
// Shows time/space complexity + a one-liner for the selected algorithm.
// No external data — purely static, but useful context while watching the sort.
const ALGO_META = {
  "Bubble Sort": {
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    note: "Repeatedly swaps adjacent elements. Simple but slow — good for understanding the basics.",
    stable: true,
  },
  "Selection Sort": {
    best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    note: "Finds the minimum element each pass and places it at the front. Not adaptive.",
    stable: false,
  },
  "Insertion Sort": {
    best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)",
    note: "Builds a sorted portion one element at a time. Excellent on nearly-sorted data.",
    stable: true,
  },
  "Merge Sort": {
    best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)",
    note: "Divides, recursively sorts, then merges. Consistent performance regardless of input.",
    stable: true,
  },
  "Quick Sort": {
    best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)",
    note: "Picks a pivot, partitions around it, recurses. Fast in practice despite worst-case O(n²).",
    stable: false,
  },
};

function AlgoInfo({ algo }) {
  const meta = ALGO_META[algo];
  if (!meta) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-neutral-900 text-base">{algo}</h2>
        <span
          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            meta.stable
              ? "bg-green-100 text-green-700"
              : "bg-neutral-100 text-neutral-500"
          }`}
        >
          {meta.stable ? "Stable" : "Unstable"}
        </span>
      </div>

      <p className="text-neutral-500 text-sm mb-4 leading-relaxed">{meta.note}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Best case",    value: meta.best    },
          { label: "Average",      value: meta.average },
          { label: "Worst case",   value: meta.worst   },
          { label: "Space",        value: meta.space   },
        ].map(({ label, value }) => (
          <div key={label} className="bg-neutral-50 rounded-xl px-4 py-3 border border-neutral-100">
            <div className="text-[11px] text-neutral-400 mb-1">{label}</div>
            <div className="text-sm font-semibold text-neutral-800 font-mono">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}