/* global mapboxgl */
/* global d3 */
/* global noUiSlider */
import bbox from "@turf/bbox";
import "./styles.scss";

import createMap, {
  loadMapData,
  updateFeatures,
  updateRasterLayers
} from "./mapboxMap";
import { createSlider } from "./slider";
import { createCitiesSelect } from "./citiesSelect";
import store, { actions } from "./store";
import { NeighbourgLoader } from "./rasterManager";
import * as rasterActions from "./rasterActions";
import { debounce, formatSliderValue } from "./helpers";
import { LEGENDS, DEBUG } from "./constants";
import createLegend from "./legend";
import lineChart from "./lineChart";

const CITIES_URL =
  "https://minio.aeronetlab.space/public/constructions/cities.json";

const map = createMap();
const hideDiffRadio = document.getElementById("unset-done");
const showDiffRadio = document.getElementById("set-done");
const rasterManager = new NeighbourgLoader(map);
const legend = createLegend("swatches");

function main(cities) {
  const getByName = city => cities.find(c => c.name === city);

  let unLoadCurrentCity;
  const citiesSelect = createCitiesSelect("#city-select", cities);
  map.on("load", () => {
    const [{ features }] = cities; // get first city from array
    d3.json(features).then(geojson => {
      const [initialCity] = cities;
      unLoadCurrentCity = loadCity(initialCity, geojson);
    });
    citiesSelect.on("change", function() {
      const city = getByName(this.value);
      console.log("city", city);
      d3.json(city.features).then(geojson => {
        unLoadCurrentCity();
        unLoadCurrentCity = loadCity(city, geojson);
      });
    });
  });
}

function getLegendData(diff) {
  return diff ? LEGENDS.DIFF : LEGENDS.PLAIN;
}

let chart = lineChart("#chart");

function loadCity(cityData, geojson) {
  if (DEBUG) console.log("load", cityData.name);
  const { years, geometry, raster_template } = cityData; // extract parameters

  // Set initial state
  // Initial year
  const firstYear = years[0];
  store.dispatch(actions.setYear(firstYear));
  // Diff radio
  showDiffRadio.checked = false;
  hideDiffRadio.checked = false;
  const state = store.getState();
  const diffIsOn = state.showDiff;
  if (diffIsOn) showDiffRadio.checked = true;
  else hideDiffRadio.checked = true;

  // Update legend
  legend.update(getLegendData(diffIsOn));
  const bounds = bbox(geometry);

  // Update chart
  let clearChart;
  clearChart = chart.update(state, geojson.features);

  // create slider
  const slider = createSlider("#slider-snap", years);

  // store.dispatch(actions.setDiff(diffIsOn));

  if (DEBUG) console.log(store.getState());

  const unloadMapData = loadMapData(map, {
    bounds,
    rasterIds: years,
    rasterUrlTempalte: raster_template,
    featuresUrl: geojson
  });

  // updateFeatures(map, state);
  rasterManager.setItems(years);
  const bindedActions = rasterManager.bindLoaders(rasterActions);

  const updateLayers = year => {
    store.dispatch(actions.setYear(year));
    const state = store.getState();
    updateFeatures(map, state);
    updateRasterLayers(years, state, rasterManager, bindedActions);
  };
  slider.on("update", debounce(formatSliderValue(updateLayers), 110));

  const updateDiffState = checked => {
    legend.update(getLegendData(checked));
    store.dispatch(actions.setDiff(checked));
    const state = store.getState();
    updateFeatures(map, state);
  };
  // const showDiff = () => {
  //   updateDiffState(true);
  //   clearChart();
  //   clearChart = chart.update(store.getState(), geojson.features);
  // };
  // const hideDiff = () => {
  //   updateDiffState(false);
  //   clearChart();
  //   clearChart = chart.update(store.getState(), geojson.features);
  // };
  const toggleDiff = function() {
    store.dispatch(actions.toggleDiff());
    const state = store.getState();
    console.log("S", state);

    legend.update(getLegendData(state.showDiff));
    updateFeatures(map, state);
    clearChart();
    clearChart = chart.update(state, geojson.features);
  };
  showDiffRadio.addEventListener("change", toggleDiff);
  hideDiffRadio.addEventListener("change", toggleDiff);

  return () => {
    slider.destroy();
    unloadMapData();
    rasterManager.clearLoaded();
    legend.remove();
    showDiffRadio.removeEventListener("change", toggleDiff);
    hideDiffRadio.removeEventListener("change", toggleDiff);
    if (DEBUG) console.log("unload", cityData.name);
  };
}

d3.json(CITIES_URL).then(main);

// Collapsible mobile description
const info = document.getElementById("info-icon");
const desc = document.getElementById("map-desc");
const descHeight = desc.scrollHeight;
let descExpanded = desc.style.getPropertyValue("max-height") === descHeight;
const showDesc = () => {
  desc.style.setProperty("max-height", descHeight + "px");
  descExpanded = true;
};
const hideDesc = () => {
  desc.style.setProperty("max-height", 0);
  descExpanded = false;
};
const toggleDesc = () => (descExpanded ? hideDesc() : showDesc());
info.addEventListener("touchend", toggleDesc);

const chartContainer = d3.select("#chart").node();
const chartHeight = 150;
let chartExpanded =
  chartContainer.style.getPropertyValue("max-height") === chartHeight;
const showChart = () => {
  chartContainer.style.setProperty("max-height", chartHeight + "px");
  chartExpanded = true;
};
const hideChart = () => {
  chartContainer.style.setProperty("max-height", "5px");
  chartExpanded = false;
};
d3.select(".chart-container .toggle-chart").on("click", () => {
  if (!chartExpanded) showChart();
  else if (chartExpanded) hideChart();
});

const resizeObserver = new ResizeObserver(() => {
  if (window.innerWidth > 700) {
    if (!descExpanded) showDesc();
    if (!chartExpanded) showChart();
  } else {
    if (descExpanded) hideDesc();
    if (chartExpanded) hideChart();
  }
});
resizeObserver.observe(document.body);
