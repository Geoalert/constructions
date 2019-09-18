function createSliderRange(years) {
  const intYears = years.map(y => +y);
  const firstYear = d3.min(intYears);
  const lastYear = d3.max(intYears);
  const yearsScale = d3
    .scaleLinear()
    .domain([firstYear, lastYear])
    .range([0, 1]);
  const formatYear = year => d3.format(".0%")(yearsScale(year));
  intYears.shift();
  intYears.pop();
  const range = intYears.reduce(
    (range, year) => {
      const key = formatYear(year);
      range[key] = year;
      return range;
    },
    { min: firstYear, max: lastYear }
  );
  return [range, firstYear];
}

// export function updateSlider(slider, years) {
//   const [sliderRange, firstYear] = createSliderRange(years);
//   slider.noUiSlider.updateOptions({
//     range: sliderRange,
//     start: ["" + firstYear]
//   });
// }

export function createSlider(nodeId, years) {
  const [sliderRange, firstYear] = createSliderRange(years);
  console.log(sliderRange);
  const sliderNode = d3.select(nodeId).node();
  // const sliderNode = document.getElementById(nodeId);
  return noUiSlider.create(sliderNode, {
    range: sliderRange,
    start: ["" + firstYear],
    snap: true,
    connect: true,
    pips: {
      mode: "steps",
      stepped: true,
      density: -1
    }
  });
}
