import { Bar } from "../types/index";

// bubbleSort is an async generator — it yields a fresh array snapshot
// after every meaningful step so the Visualizer can render each frame.
// "yield" = pause here, show this frame, then resume when ready.
export async function* bubbleSort(input: Bar[]): AsyncGenerator<Bar[]> {
  // work on a copy so we never mutate the original array
  const arr: Bar[] = input.map((b) => ({ ...b }));
  const n = arr.length;

  // outer loop: each pass bubbles the largest unsorted element to the end
  for (let i = 0; i < n - 1; i++) {
    // inner loop: compare adjacent pairs, stop shrinking at already-sorted tail
    for (let j = 0; j < n - i - 1; j++) {
      // mark the two bars being compared right now
      arr[j].state = "comparing";
      arr[j + 1].state = "comparing";
      yield [...arr]; // 🟦 frame: show the comparison

      if (arr[j].value > arr[j + 1].value) {
        // swap the two bars in place
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield [...arr]; // 🟠 frame: show the swap
      }

      // reset both back to default before moving to the next pair
      arr[j].state = "default";
      arr[j + 1].state = "default";
    }

    // the element that just bubbled to its final position is now sorted
    arr[n - 1 - i].state = "sorted";
    yield [...arr]; // 🟢 frame: highlight the newly sorted bar
  }

  // the last remaining element is sorted by definition
  arr[0].state = "sorted";
  yield [...arr]; // final frame: everything green
}