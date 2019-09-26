import * as d3 from "d3";
import area from "@turf/area";
import { featureCollection, convertArea } from "@turf/helpers";

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const convertToKm2 = value => convertArea(value, "meters", "kilometers");
const floor2 = value => Math.floor(value * 100) / 100;
const getArea = compose(
  floor2,
  convertToKm2,
  area,
  featureCollection
);

const sumByKeys = (obj, keys) =>
  keys.reduce((sum, key) => sum + (obj[key] || 0), 0);

function getLineData(areas, types) {
  const plotData = [];
  for (let date in areas) {
    const value = sumByKeys(areas[date], types);
    plotData.push({ date: d3.timeParse("%Y")(date), value });
  }
  return plotData;
}

function formatData(rawData) {
  return d3
    .nest()
    .key(f => f.properties.year)
    .key(f => f.properties.type)
    .rollup(f => getArea(f))
    .object(rawData);
}

function createChart(nodeId, chartWidth, chartHeight, showX = false) {
  let margin = { top: 10, right: 50, bottom: 10, left: 40 },
    width = chartWidth - margin.left - margin.right,
    height = chartHeight - margin.top - margin.bottom;

  // append the svg object
  const svg = d3
    .select(nodeId)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Initialise a X axis:
  const x = d3.scaleTime().range([10, width]);
  const xAxis = d3.axisBottom().scale(x);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .attr("class", "myXaxis");

  // Initialize an Y axis
  const y = d3.scaleLinear().range([height, 0]);
  const yAxis = d3
    .axisLeft()
    .scale(y)
    .ticks(3);
  svg.append("g").attr("class", "myYaxis");

  // Create a function that takes a dataset as input and update the plot:
  return function(data, color = "steelblue") {
    const t = d3.transition().duration(750);
    x.domain([d3.min(data, d => d.date), d3.max(data, d => d.date)]);
    if (showX) {
      // Create the X axis:
      xAxis.tickValues(data.map(d => d.date));
      svg
        .selectAll(".myXaxis")
        .transition(t)
        .call(xAxis);
    }

    // create the Y axis
    y.domain([d3.min(data, d => d.value), d3.max(data, d => d.value)]);
    svg
      .selectAll(".myYaxis")
      .transition(t)
      .call(yAxis);

    svg
      .append("text")
      .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("font-size", "14px")
      .attr("font-weight", "500")
      .attr("x", 35)
      .attr("y", 10)
      .text("Area km²");
    // Create a update selection: bind to the new data
    const line = svg.selectAll(".lineTest").data([data], d => d.date);

    // Updata the line
    line
      .enter()
      .append("path")
      .attr("class", "lineTest")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveMonotoneX)
          .x(d => x(d.date))
          .y(() => height)
      )
      .merge(line)
      .transition(t)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveMonotoneX)
          .x(d => x(d.date))
          .y(d => y(d.value))
      )
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 3.0);

    const circles = svg.selectAll("circle").data(data, d => d.date);
    circles
      .enter()
      .append("circle")
      .attr("fill", color)
      .attr("cy", () => height)
      .attr("cx", d => x(d.date))
      .merge(circles)
      .transition(t)
      .attr("cx", d => x(d.date))
      .attr("cy", d => y(d.value))
      .attr("r", () => 5);
    return () => {
      console.log("clear chart");
      line
        .exit()
        .transition(t)
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveMonotoneX)
            .x(d => x(d.date))
            .y(() => height)
        )
        .remove();
      circles
        .exit()
        .transition(t)
        .attr("cy", () => height)
        .remove();
      // svg.transition(t).remove();
    };
  };
}

export default function(nodeId) {
  const brect = d3
    .select(nodeId)
    .node()
    .getBoundingClientRect();
  const plotLine = createChart(nodeId, brect.width, 150);
  return function(state, data) {
    if (state.showDiff) {
      const groupped = formatData(data);
      const lineData1 = getLineData(groupped, ["new"]);
      const lineData2 = getLineData(groupped, ["in_progress"]);
      const lineData3 = getLineData(groupped, ["done"]);
      const clear1 = plotLine(lineData1);
      const clear2 = plotLine(lineData2);
      const clear3 = plotLine(lineData3);
      return () => {
        clear1();
        clear2();
        clear3();
      };
    } else {
      const groupped = formatData(data);
      const lineData = getLineData(groupped, ["new", "in_progress"]);
      return plotLine(lineData);
    }
  };
}
