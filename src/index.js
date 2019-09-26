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
  const load = (city, data) =>
    loadCity(cities.find(c => c.name === city), data);

  let unLoadCurrentCity;
  const citiesSelect = createCitiesSelect("#city-select", cities);
  map.on("load", () => {
    const [{ features: featuresPath }] = cities;
    d3.json(featuresPath).then(({ features: geojson }) => {
      const [{ name: initialCityName }] = cities;
      unLoadCurrentCity = load(initialCityName, geojson);
      citiesSelect.on("change", function() {
        unLoadCurrentCity();
        const city = this.value;
        unLoadCurrentCity = load(city, geojson);
      });
    });
  });
}

function getLegendData(diff) {
  return diff ? LEGENDS.DIFF : LEGENDS.PLAIN;
}

function loadCity(cityData, geojson) {
  if (DEBUG) console.log("load", cityData.name);
  const { years, geometry, features, raster_template } = cityData; // extract parameters

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

  const updateChart = lineChart("#chart");

  // Update legend
  legend.update(getLegendData(diffIsOn));
  const bounds = bbox(geometry);

  // Update chart
  let clearChart;
  clearChart = updateChart(state, geojson);

  // create slider
  const slider = createSlider("#slider-snap", years);

  // store.dispatch(actions.setDiff(diffIsOn));

  if (DEBUG) console.log(store.getState());

  const unloadMapData = loadMapData(map, {
    bounds,
    rasterIds: years,
    rasterUrlTempalte: raster_template,
    featuresUrl: features
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
  const showDiff = () => {
    updateDiffState(true);
    clearChart();
    clearChart = updateChart(store.getState(), geojson);
  };
  const hideDiff = () => updateDiffState(false);
  showDiffRadio.addEventListener("change", showDiff);
  hideDiffRadio.addEventListener("change", hideDiff);

  return () => {
    slider.destroy();
    unloadMapData();
    rasterManager.clearLoaded();
    legend.remove();
    showDiffRadio.removeEventListener("change", showDiff);
    hideDiffRadio.removeEventListener("change", hideDiff);
    if (DEBUG) console.log("unload", cityData.name);
  };
}

d3.json(CITIES_URL).then(main);

const info = document.getElementById("info-icon");
const desc = document.getElementById("map-desc");
const descHeight = desc.scrollHeight;
let descExpanded = desc.style.getPropertyValue("max-height") === descHeight;
const expandDesc = () => {
  desc.style.setProperty("max-height", descHeight + "px");
  descExpanded = true;
};
const hideDesc = () => {
  desc.style.setProperty("max-height", 0);
  descExpanded = false;
};
const toggleDesc = () => (descExpanded ? hideDesc() : expandDesc());
info.addEventListener("touchend", toggleDesc);

const resizeObserver = new ResizeObserver(() => {
  if (window.innerWidth > 700) expandDesc();
  else hideDesc();
});
resizeObserver.observe(document.body);
