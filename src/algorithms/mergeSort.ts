import { Bar } from "../types/index";

// mergeSort: divide the array in half repeatedly until you have single
// elements, then merge pairs back in sorted order.
// Always O(n log n) — the most consistent of the bunch.
export async function* mergeSort(input: Bar[]): AsyncGenerator<Bar[]> {
  const arr: Bar[] = input.map((b) => ({ ...b }));

  // merge takes two already-sorted sub-arrays (arr[left..mid] and
  // arr[mid+1..right]) and weaves them into one sorted stretch.
  // It's an inner generator so it can yield frames up to the outer caller.
  async function* merge(
    arr: Bar[],
    left: number,
    mid: number,
    right: number
  ): AsyncGenerator<Bar[]> {
    // copy both halves so we can read old values while writing back
    const L = arr.slice(left, mid + 1).map((b) => ({ ...b }));
    const R = arr.slice(mid + 1, right + 1).map((b) => ({ ...b }));

    let i = 0; // pointer into L
    let j = 0; // pointer into R
    let k = left; // write position in arr

    while (i < L.length && j < R.length) {
      // highlight the two candidates being compared
      arr[left + i].state = "comparing";
      arr[mid + 1 + j].state = "comparing";
      yield [...arr]; // 🟦 frame: show the comparison

      if (L[i].value <= R[j].value) {
        arr[k] = { ...L[i], state: "default" };
        i++;
      } else {
        // taking from the right half — this is conceptually a "swap"
        arr[k] = { ...R[j], state: "default" };
        j++;
      }
      yield [...arr]; // 🟠 frame: show the placed bar
      k++;
    }

    // drain whichever half still has elements left
    while (i < L.length) {
      arr[k] = { ...L[i], state: "default" };
      i++;
      k++;
    }
    while (j < R.length) {
      arr[k] = { ...R[j], state: "default" };
      j++;
      k++;
    }

    // the merged segment is now sorted — light it up green
    for (let x = left; x <= right; x++) arr[x].state = "sorted";
    yield [...arr]; // 🟢 frame: merged segment done
  }

  // split recursively, yield every inner frame up through the call stack
  async function* split(
    arr: Bar[],
    left: number,
    right: number
  ): AsyncGenerator<Bar[]> {
    if (left >= right) return; // base case: single element is already sorted

    const mid = Math.floor((left + right) / 2);
    yield* split(arr, left, mid);       // sort left half
    yield* split(arr, mid + 1, right);  // sort right half
    yield* merge(arr, left, mid, right); // merge the two sorted halves
  }

  yield* split(arr, 0, arr.length - 1);
}