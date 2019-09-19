export const _LEGENDS = {
  DIFF: {
    colors: ["#A82A2A", "#FFB366", "#15B371"],
    names: ["New", "In progress", "Completed"]
  },
  PLAIN: {
    colors: ["#A82A2A"],
    names: ["Constructions"]
  }
};

export const LEGENDS = {
  DIFF: [
    { name: "New", color: "#A82A2A" },
    { name: "In progress", color: "#FFB366" },
    { name: "Completed", color: "#15B371" }
  ],
  PLAIN: [{ name: "Constructions", color: "#A82A2A" }]
};

export const DEBUG = process.env.NODE_ENV !== "production";
export const FILL_COLOR = {
  PLAIN: [
    "match",
    ["get", "type"],
    "new",
    "#A82A2A",
    "in_progress",
    "#A82A2A",
    "done",
    "#15B371",
    "#6e599f"
  ],
  DIFF: [
    "match",
    ["get", "type"],
    "new",
    "#A82A2A",
    "in_progress",
    "#FFB366",
    "done",
    "#15B371",
    "#6e599f"
  ]
};
