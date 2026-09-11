// main page where all sorting is going to perform
import { useState, useRef } from "react";

function Visualizer() {
  const algorithms = [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Merge Sort",
    "Quick Sort",
  ];

  const [selectedAlgo, setSelectedAlgo] = useState("Merge Sort"); // active algo from dropdown
  const [arraySize, setArraySize] = useState(20);                  // slider: how many bars
  const [speed, setSpeed] = useState("Medium");                    // animation speed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);     // custom dropdown toggle

  // Close dropdown when clicking outside
  const dropdownRef = useRef(null);

  const handleAlgoSelect = (algo) => {
    setSelectedAlgo(algo);
    setIsDropdownOpen(false); // close dropdown after pick
  };

  const handleRandomize = () => {
    // TODO: shuffle your bars array here
    alert("Randomize array!");
  };

  const handleSort = () => {
    // TODO: kick off the selected algo animation here
    alert(`Sorting with: ${selectedAlgo}`);
  };

  return (
    <div className="bg-[#F7F7F5] min-h-screen">

      {/* ── NAVBAR / CONTROL BAR ── */}
      <div className="max-w-[900px] mx-auto mt-8 bg-white rounded-xl shadow-md px-6 py-5">

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-5 text-center tracking-tight">
          Algo Sort
        </h1>

        {/* Controls row */}
        <div className="flex flex-wrap items-center justify-center gap-4">

          {/* ── Algorithm Dropdown ── */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Algorithm
            </label>
            <div className="relative" ref={dropdownRef}>
              {/* Trigger button that mimics the screenshot's select box */}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center justify-between gap-3 w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-800 font-medium hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                {selectedAlgo}
                {/* Chevron icon — rotates when open */}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown list — absolutely positioned below the button */}
              {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {algorithms.map((algo) => (
                    <li
                      key={algo}
                      onClick={() => handleAlgoSelect(algo)}
                      className={`px-4 py-2 text-sm cursor-pointer transition-colors ${
                        algo === selectedAlgo
                          ? "bg-gray-100 font-semibold text-gray-900" // highlight current
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {algo}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* ── Size Slider ── */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Size: {arraySize}
            </label>
            <input
              type="range"
              min={5}
              max={100}
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-36 accent-blue-500 cursor-pointer" // accent-blue gives the thumb/track the blue color from screenshot
            />
          </div>

          {/* ── Speed Dropdown (native select — simpler for a secondary control) ── */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Speed
            </label>
            <select
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition cursor-pointer"
            >
              <option>Slow</option>
              <option>Medium</option>
              <option>Fast</option>
            </select>
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex items-end gap-2 pb-[1px]">
            {/* Randomize — secondary, outlined look */}
            <button
              onClick={handleRandomize}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition"
            >
              Randomize
            </button>

            {/* Sort — primary CTA, matches the blue in screenshot */}
            <button
              onClick={handleSort}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Sort
            </button>
          </div>
        </div>
      </div>

      {/* ── Visualization Canvas ── */}
      <div className="bg-[#EBEBEA] max-w-[900px] w-full mx-auto mt-4 rounded-xl shadow-inner h-[420px] flex flex-col justify-end px-4 pb-4 gap-1">
        {/* Placeholder bars — replace with your real array-to-bars rendering */}
        <div className="flex items-end justify-center gap-[3px] h-full w-full">
          {Array.from({ length: arraySize }, (_, i) => (
            <div
              key={i}
              style={{
                height: `${Math.floor(Math.random() * 80) + 10}%`, // random height placeholder
                width: `${Math.max(4, Math.floor(600 / arraySize))}px`,
              }}
              className="bg-gray-400 rounded-t-sm"
            />
          ))}
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Comparing
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" /> Swapping
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> Pivot
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Sorted
        </span>
      </div>
    </div>
  );
}

export default Visualizer;