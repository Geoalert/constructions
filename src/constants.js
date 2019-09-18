export const _LEGENDS = {
  DIFF: {
    colors: ["#A82A2A", "#FFB366", "#15B371"],
    names: ["Новые", "В процессе", "Завершен"]
  },
  PLAIN: {
    colors: ["#A82A2A"],
    names: ["Стройплощадки"]
  }
};

export const LEGENDS = {
  DIFF: [
    { name: "Новые", color: "#A82A2A" },
    { name: "В процессе", color: "#FFB366" },
    { name: "Завершен", color: "#15B371" }
  ],
  PLAIN: [{ name: "Стройплощадки", color: "#A82A2A" }]
};

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
