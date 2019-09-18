/* global mapboxgl */
/* global d3 */
/* global noUiSlider */
import "regenerator-runtime/runtime";
import bbox from "@turf/bbox";
import "./styles.scss";

import createMap from "./mapboxMap";
import { createSlider } from "./slider";
import { createCitiesSelect } from "./citiesSelect";

const DEBUG = process.env.NODE_ENV !== "production";

/**
 * load cities
 * cities for each:
 *  get params:
 *    years -> firstYear
 *    geometry -> bbox
 *    features -> plotting data
 *  create slider
 *  build select
 *  load layers
 *  bind events
 */

const CITIES_URL =
  "https://minio.aeronetlab.space/public/constructions/cities.json";

const map = createMap();

const appState = {
  state: {
    showDiff: false,
    currentYear: null
  },
  setState(state) {
    const nextState = Object.assign({}, this.state, state);
    this.state = nextState;
  }
};

async function main() {
  const cities = await d3.json(CITIES_URL);
  const load = city => loadCity(cities.find(c => c.name === city));

  let unLoadCurrentCity;
  const citiesSelect = createCitiesSelect(cities);

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
  console.log(cityData);
  const { years, geometry } = cityData; // extract parameters
  const bounds = bbox(geometry);
  const slider = createSlider("slider-snap", years);
  map.fitBounds(bounds);

  return () => {
    slider.destroy();
    console.log("unload", cityData.name);
  };
}

main();

function getRasterLayerUrl(template, year) {
  return template.replace(/.+(\{year\}).+/, year);
}

// const INITIAL_YEAR = "2010";

// var snapSlider = document.getElementById("slider-snap");
// noUiSlider.create(snapSlider, {
//   range: {
//     min: 2010,
//     "25%": 2014,
//     "40%": 2015,
//     "55%": 2016,
//     "70%": 2017,
//     "85%": 2018,
//     max: 2019
//   },
//   start: [INITIAL_YEAR],
//   snap: true,
//   connect: true,
//   pips: {
//     mode: "steps",
//     stepped: true,
//     density: -1
//   }
// });

// function readControls() {
//   var year = formatYear(snapSlider.noUiSlider.get());
//   var showDiff = document.getElementById("set-done").checked;
//   return { year, showDiff };
// }

// function loadRaster(year) {
//   if (DEBUG) console.log("load", year);
//   map.setLayoutProperty(year, "visibility", "visible");
// }
// function unLoadRaster(year) {
//   if (DEBUG) console.log("unload", year);
//   map.setLayoutProperty(year, "visibility", "none");
// }

// function hideRaster(year) {
//   if (DEBUG) console.log("hide", year);
//   map.setPaintProperty(year, "raster-opacity", 0);
// }
// function showRaster(year) {
//   if (DEBUG) console.log("show", year);
//   map.setPaintProperty(year, "raster-opacity", 1);
// }

// function hideAllRasters(exclude) {
//   YEARS.filter(year => year !== exclude).map(hideRaster);
// }

// function filterBy() {
//   var controls = readControls();
//   var filters = ["all", ["==", "year", controls.year]];
//   if (!controls.showDiff) {
//     filters = filters.concat([["!=", "type", "done"]]);
//     map.setPaintProperty("constructions-fills", "fill-color", FILL_COLOR.PLAIN);
//     buildLegend(LEGENDS.PLAIN);
//   } else {
//     map.setPaintProperty("constructions-fills", "fill-color", FILL_COLOR.DIFF);
//     buildLegend(LEGENDS.DIFF);
//   }
//   map.setFilter("constructions-fills", filters);
// }

// function formatYear(y) {
//   return parseInt(y, 10).toString();
// }

// function addRaster(year) {
//   var sourceId = `raster-${year}`;
//   var layerId = `${year}`;
//   var tiles = `https://rasters.aeronetlab.space/api/v0/cogs/tiles/{z}/{x}/{y}.png?uri=s3://demos/constructions/chelyabinsk/${year}.tif`;
//   map.addSource(sourceId, {
//     type: "raster",
//     tiles: [tiles],
//     tileSize: 256,
//     attribution: "&copy; MAXAR",
//     bounds: bounds
//   });
//   map.addLayer({
//     id: layerId,
//     type: "raster",
//     source: sourceId,
//     paint: {
//       "raster-opacity": 0
//     },
//     layout: {
//       visibility: "none"
//     }
//   });
// }

// var swatches = document.getElementById("swatches");

// function buildLegend(legend) {
//   swatches.innerHTML = "";
//   legend.colors.forEach((color, index) => {
//     var swatchContainer = document.createElement("div");
//     var swatch = document.createElement("div");
//     var swatchDesc = document.createElement("div");
//     swatchDesc.innerHTML = legend.names[index];
//     swatch.className = "swatch-color";
//     swatch.style.backgroundColor = color;
//     swatchContainer.appendChild(swatch);
//     swatchContainer.appendChild(swatchDesc);
//     swatches.appendChild(swatchContainer);
//   });
// }

// function doWithNeighbourg(fn, condition = () => true) {
//   return function(n, padding) {
//     var index = YEARS.indexOf(n) + padding;
//     if (YEARS[index] !== undefined) {
//       var year = YEARS[index];
//       if (condition(year)) fn(year);
//     }
//   };
// }

// var loadedYears = new Set();

// var _loadRaster = year => {
//   loadedYears.add(year);
//   loadRaster(year);
// };

// var loadNeighbourg = doWithNeighbourg(_loadRaster);
// var unloadNeighbourg = doWithNeighbourg(
//   unLoadRaster,
//   year => !loadedYears.has(year)
// );

// function updateRasterLayers() {
//   var controls = readControls();
//   var year = controls.year;
//   if (DEBUG) console.log("------->", year);
//   _loadRaster(year);
//   showRaster(year);
//   delay(200).then(() => {
//     hideAllRasters(year);
//     loadNeighbourg(year, 1);
//     loadNeighbourg(year, -1);
//     unloadNeighbourg(year, -2);
//     unloadNeighbourg(year, 2);
//     if (DEBUG) console.log("-------<", year);
//   });
//   filterBy();
// }

// map.on("load", function() {
//   map.fitBounds(bounds);

//   YEARS.map(addRaster);

//   map.addSource("constructions", {
//     type: "geojson",
//     data: geojson
//   });

//   map.addLayer({
//     id: "constructions-fills",
//     type: "fill",
//     source: "constructions",
//     paint: {
//       "fill-opacity": 0.5,
//       "fill-color": FILL_COLOR.PLAIN
//     }
//   });

//   filterBy();

//   document.getElementById("set-done").addEventListener("change", filterBy);
//   document.getElementById("unset-done").addEventListener("change", filterBy);
//   snapSlider.noUiSlider.on("update", debounce(updateRasterLayers, 210));
// });

// function delay(ms) {
//   return new Promise(resolve => {
//     setTimeout(resolve, ms);
//   });
// }

// function debounce(f, t) {
//   return function(args) {
//     let previousCall = this.lastCall;
//     this.lastCall = Date.now();
//     if (previousCall && this.lastCall - previousCall <= t) {
//       clearTimeout(this.lastCallTimer);
//     }
//     this.lastCallTimer = setTimeout(() => f(args), t);
//   };
// }
