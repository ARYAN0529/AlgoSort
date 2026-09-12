import { Bar } from "../types/index";

    //selection -> find the miniimum 
// and swaps it into its correct position at the front.
// Same async generator pattern as bubbleSort — yields frames for the Visualizer.
export async function* selectionSort(input: Bar[]): AsyncGenerator<Bar[]> {
  const arr: Bar[] = input.map((b) => ({ ...b }));
  const n = arr.length;

  // outer loop: sorted portion grows from the left one element per pass
  for (let i = 0; i < n - 1; i++) {
    // assume the first unsorted element is the minimum
    let minIdx = i;
    arr[minIdx].state = "pivot"; // 🔴 pivot = "current minimum candidate"
    yield [...arr];

    // scan the rest of the unsorted portion for a smaller value
    for (let j = i + 1; j < n; j++) {
      arr[j].state = "comparing"; // 🟦 highlight bar being checked
      yield [...arr];

      if (arr[j].value < arr[minIdx].value) {
        // found a new minimum — reset old candidate, promote new one
        arr[minIdx].state = i === minIdx ? "default" : "default";
        minIdx = j;
        arr[minIdx].state = "pivot"; // new minimum candidate
      } else {
        // not the minimum, reset to default
        arr[j].state = "default";
      }
      yield [...arr];
    }

    // swap the found minimum into position i (only if it's not already there)
    if (minIdx !== i) {
      arr[minIdx].state = "default";
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }

    // position i is now finalized
    arr[i].state = "sorted"; // 🟢 this slot is done
    yield [...arr];
  }

  // last element is sorted by default
  arr[n - 1].state = "sorted";
  yield [...arr];
}