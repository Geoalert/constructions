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

function getLineData(id, areas, types, color) {
  const data = [];
  for (let date in areas) {
    const value = sumByKeys(areas[date], types);
    data.push({ date, value });
  }
  return { id, data, color };
}

function formatData(rawData) {
  return d3
    .nest()
    .key(f => f.properties.year)
    .key(f => f.properties.type)
    .rollup(f => getArea(f))
    .object(rawData);
}

function getMargins(width) {
  return width > 700 ? 46 : 36;
}

function createChart(nodeId, chartWidth, chartHeight, showX = false) {
  const sideMargin = getMargins(chartWidth);
  console.log("margin", sideMargin);
  let margin = {
      left: sideMargin - 12,
      right: sideMargin,
      top: 12,
      bottom: 10
    },
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
  const x = d3.scaleLinear().range([10, width]);
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
  function getmin(data, by) {
    return d3.min(data, d => d3.min(d, by));
  }
  function getmax(data, by) {
    return d3.max(data, d => d3.max(d, by));
  }

  // [
  //   { lineData: { date, value }, color }
  // ]

  return function updateLine(lines) {
    const t = d3
      .transition()
      .delay(100)
      .duration(750);
    const tEx = d3.transition().duration(750);
    const lineDatas = lines.map(d => d.data);
    const dateTicks = lineDatas[0].map(d => d.date);

    x.domain([0, dateTicks.length - 1]);
    if (showX) {
      // Create the X axis:
      xAxis.tickValues(dateTicks);
      svg
        .selectAll(".myXaxis")
        .transition(t)
        .call(xAxis);
    }

    // create the Y axis
    y.domain([
      getmin(lineDatas, d => d.value),
      getmax(lineDatas, d => d.value)
    ]);

    const getX = date => x(dateTicks.indexOf(date));
    const flatLine = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x(d => getX(d.date))
      .y(() => height);

    const graphLine = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x(d => getX(d.date))
      .y(d => y(d.value));

    svg
      .selectAll(".myYaxis")
      .transition(t)
      .call(yAxis);

    svg
      .append("text")
      .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 2)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Area km²");
    // Create a update selection: bind to the new data
    const removeCallbacks = lines.map(line => {
      const l = svg
        .selectAll(`.${line.id}-line`)
        .data([line.data], d => `${line.id}-${d.date}-line`)
        .join(
          enter =>
            enter
              .append("path")
              .attr("class", `${line.id}-line`)
              .attr("fill", "none")
              .attr("stroke-width", 3.0)
              .attr("stroke", line.color)
              .attr("d", flatLine)
              .call(enter => enter.transition(t).attr("d", graphLine)),
          update =>
            update.call(update => update.transition(t).attr("d", graphLine)),
          exit => exit.call(exit => exit.transition(t).attr("d", flatLine))
        );

      const initialCircle = enter =>
        enter
          .append("circle")
          .attr("class", `${line.id}-circle`)
          .attr("fill", line.color)
          .attr("cy", () => height)
          .attr("cx", d => getX(d.date))
          .attr("r", () => 0);
      const updateCircle = enter =>
        enter
          .transition(t)
          .attr("fill", line.color)
          .attr("cx", d => getX(d.date))
          .attr("cy", d => y(d.value))
          .attr("r", () => 5);
      const c = svg
        .selectAll(`.${line.id}-circle`)
        .data(line.data, (_, i) => `${line.id}-${i}-point`)
        .join(
          enter => initialCircle(enter).call(updateCircle),
          update => update.attr("fill", line.color).call(updateCircle),
          exit =>
            exit.call(exit =>
              exit
                .attr("cy", () => height)
                // .attr("cx", d => getX(d.date))
                .attr("r", () => 0)
            )
        );

      return () => {
        l.transition(tEx)
          .attr("d", flatLine)
          .remove();
        c.transition(tEx)
          // .attr("cx", d => getX(d.date))
          .attr("cy", () => height)
          .attr("r", () => 0)
          .remove();
      };
    });

    return () => removeCallbacks.forEach(c => c());
  };
}

const colorsScale = d3
  .scaleOrdinal()
  .domain(["new", "in_progress", "done"])
  .range(["#A82A2A", "#FFB366", "#15B371"]);

export default function(nodeId) {
  const chart = d3.select(nodeId);
  const brect = chart.node().getBoundingClientRect();
  const plotLines = createChart(nodeId, brect.width, 150);
  return {
    update: (state, data) => {
      if (state.showDiff) {
        const groupped = formatData(data);
        const line1 = getLineData("new", groupped, ["new"], colorsScale("new"));
        const line2 = getLineData(
          "in_progress",
          groupped,
          ["in_progress"],
          colorsScale("in_progress")
        );
        const line3 = getLineData(
          "done",
          groupped,
          ["done"],
          colorsScale("done")
        );
        return plotLines([line1, line2, line3]);
      } else {
        const groupped = formatData(data);
        const line1 = getLineData(
          "constructions",
          groupped,
          ["new", "in_progress"],
          colorsScale("new")
        );
        console.log(line1);
        return plotLines([line1]);
      }
    }
  };
}

//
