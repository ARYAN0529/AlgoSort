export interface Bar {
  value: number;
  state: "default" | "comparing" | "sorted" | "pivot";
}