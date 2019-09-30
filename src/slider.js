function createSliderRange(values) {
  const firstValue = d3.min(values, d => +d);
  const lastValue = d3.max(values, d => +d);
  const keysScale = d3
    .scaleLinear()
    .domain([0, values.length - 1])
    .range([0, 1]);
  const formatSliderKey = key => d3.format(".0%")(key);
  const sliderValues = values.slice();
  sliderValues.shift();
  sliderValues.pop();
  const range = sliderValues.reduce(
    (range, value) => {
      const valueIndex = values.indexOf(value);
      const key = formatSliderKey(keysScale(valueIndex));
      range[key] = +value;
      return range;
    },
    { min: firstValue, max: lastValue }
  );
  return [range, firstValue];
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
