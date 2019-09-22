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
import { LEGENDS } from "./constants";

const CITIES_URL =
  "https://minio.aeronetlab.space/public/constructions/cities.json";

const map = createMap();
const hideDiffOption = document.getElementById("unset-done");
const showDiffOption = document.getElementById("set-done");
const rasterManager = new NeighbourgLoader(map);

function main(cities) {
  const load = city => loadCity(cities.find(c => c.name === city));

  let unLoadCurrentCity;
  const citiesSelect = createCitiesSelect("#city-select", cities);
  map.on("load", () => {
    const initialCity = cities[0].name;
    unLoadCurrentCity = load(initialCity);
  });
  citiesSelect.on("change", function() {
    unLoadCurrentCity();
    const city = this.value;
    unLoadCurrentCity = load(city);
  });
}

function loadCity(cityData) {
  console.log("load", cityData.name);
  const { years, geometry, features, raster_template } = cityData; // extract parameters
  const bounds = bbox(geometry);
  const slider = createSlider("#slider-snap", years);

  const firstYear = years[0];
  const showDiff = !!showDiffOption.checked;
  store.dispatch(actions.setDiff(showDiff));
  store.dispatch(actions.setYear(firstYear));
  buildLegend(showDiff);
  console.log(store.getState());

  const unloadMapData = loadMapData(map, {
    bounds,
    rasterIds: years,
    rasterUrlTempalte: raster_template,
    featuresUrl: features
  });
  const state = store.getState();

  updateFeatures(map, state);
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
    buildLegend(checked);
    store.dispatch(actions.setDiff(checked));
    const state = store.getState();
    updateFeatures(map, state);
  };
  showDiffOption.addEventListener("change", () => updateDiffState(true));
  hideDiffOption.addEventListener("change", () => updateDiffState(false));

  return () => {
    slider.destroy();
    unloadMapData();
    rasterManager.clearLoaded();
    // store.reset();
    console.log("unload", cityData.name);
  };
}

d3.json(CITIES_URL).then(main);

function buildLegend(withDiff) {
  let legend = withDiff ? LEGENDS.DIFF : LEGENDS.PLAIN;
  swatches.innerHTML = "";
  legend.forEach(({ name, color }, index) => {
    var swatchContainer = document.createElement("div");
    var swatch = document.createElement("div");
    var swatchDesc = document.createElement("div");
    swatchDesc.innerHTML = name;
    swatch.className = "swatch-color";
    swatch.style.backgroundColor = color;
    swatchContainer.appendChild(swatch);
    swatchContainer.appendChild(swatchDesc);
    swatches.appendChild(swatchContainer);
  });
}

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
