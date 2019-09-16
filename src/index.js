/* global mapboxgl */
/* global d3 */
/* global noUiSlider */
import "./styles.scss";
import bounds from "./bounds";
import geojson from "./data.geojson";

const INITIAL_YEAR = "2010";
const DEBUG = process.env.NODE_ENV !== "production";

var snapSlider = document.getElementById("slider-snap");
noUiSlider.create(snapSlider, {
  range: {
    min: 2010,
    "25%": 2014,
    "40%": 2015,
    "55%": 2016,
    "70%": 2017,
    "85%": 2018,
    max: 2019
  },
  start: [INITIAL_YEAR],
  snap: true,
  connect: true,
  pips: {
    mode: "steps",
    stepped: true,
    density: -1
  }
});

var map = new mapboxgl.Map({
  container: "map",
  attributionControl: false,
  style: {
    version: 8,
    sources: {
      osm: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
          // "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          // "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          // "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ],
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        tileSize: 256
      }
    },
    layers: [
      {
        id: "osm",
        source: "osm",
        type: "raster"
      }
    ]
  },
  center: [61.2756148940565, 55.142590470969964],
  zoom: 12
});

map.addControl(new mapboxgl.AttributionControl(), "top-right");

var YEARS = ["2010", "2014", "2015", "2016", "2017", "2018", "2019"].reverse();

var LEGENDS = {
  DIFF: {
    colors: ["#A82A2A", "#FFB366", "#15B371"],
    names: ["Новые", "В процессе", "Завершен"]
  },
  PLAIN: {
    colors: ["#A82A2A"],
    names: ["Стройплощадки"]
  }
};

var FILL_COLOR = {
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

function readControls() {
  var year = formatYear(snapSlider.noUiSlider.get());
  var showDiff = document.getElementById("set-done").checked;
  return { year, showDiff };
}

function loadRaster(year) {
  if (DEBUG) console.log("load", year);
  map.setLayoutProperty(year, "visibility", "visible");
}
function unLoadRaster(year) {
  if (DEBUG) console.log("unload", year);
  map.setLayoutProperty(year, "visibility", "none");
}

function hideRaster(year) {
  if (DEBUG) console.log("hide", year);
  map.setPaintProperty(year, "raster-opacity", 0);
}
function showRaster(year) {
  if (DEBUG) console.log("show", year);
  map.setPaintProperty(year, "raster-opacity", 1);
}

function hideAllRasters(exclude) {
  YEARS.filter(year => year !== exclude).map(hideRaster);
}

function filterBy() {
  var controls = readControls();
  var filters = ["all", ["==", "year", controls.year]];
  if (!controls.showDiff) {
    filters = filters.concat([["!=", "type", "done"]]);
    map.setPaintProperty("constructions-fills", "fill-color", FILL_COLOR.PLAIN);
    buildLegend(LEGENDS.PLAIN);
  } else {
    map.setPaintProperty("constructions-fills", "fill-color", FILL_COLOR.DIFF);
    buildLegend(LEGENDS.DIFF);
  }
  map.setFilter("constructions-fills", filters);
}

function formatYear(y) {
  return parseInt(y, 10).toString();
}

function addRaster(year) {
  var sourceId = `raster-${year}`;
  var layerId = `${year}`;
  var tiles = `https://rasters.aeronetlab.space/api/v0/cogs/tiles/{z}/{x}/{y}.png?uri=s3://demos/constructions/chelyabinsk/${year}.tif`;
  map.addSource(sourceId, {
    type: "raster",
    tiles: [tiles],
    tileSize: 256,
    attribution: "&copy; MAXAR",
    bounds: bounds
  });
  map.addLayer({
    id: layerId,
    type: "raster",
    source: sourceId,
    paint: {
      "raster-opacity": 0
    },
    layout: {
      visibility: "none"
    }
  });
}

var swatches = document.getElementById("swatches");

function buildLegend(legend) {
  swatches.innerHTML = "";
  legend.colors.forEach((color, index) => {
    var swatchContainer = document.createElement("div");
    var swatch = document.createElement("div");
    var swatchDesc = document.createElement("div");
    swatchDesc.innerHTML = legend.names[index];
    swatch.className = "swatch-color";
    swatch.style.backgroundColor = color;
    swatchContainer.appendChild(swatch);
    swatchContainer.appendChild(swatchDesc);
    swatches.appendChild(swatchContainer);
  });
}

function doWithNeighbourg(fn, condition = () => true) {
  return function(n, padding) {
    var index = YEARS.indexOf(n) + padding;
    if (YEARS[index] !== undefined) {
      var year = YEARS[index];
      if (condition(year)) fn(year);
    }
  };
}

var loadedYears = new Set();

var _loadRaster = year => {
  loadedYears.add(year);
  loadRaster(year);
};

var loadNeighbourg = doWithNeighbourg(_loadRaster);
var unloadNeighbourg = doWithNeighbourg(
  unLoadRaster,
  year => !loadedYears.has(year)
);

function updateRasterLayers() {
  var controls = readControls();
  var year = controls.year;
  if (DEBUG) console.log("------->", year);
  _loadRaster(year);
  showRaster(year);
  delay(200).then(() => {
    hideAllRasters(year);
    loadNeighbourg(year, 1);
    loadNeighbourg(year, -1);
    unloadNeighbourg(year, -2);
    unloadNeighbourg(year, 2);
    if (DEBUG) console.log("-------<", year);
  });
  filterBy();
}

map.on("load", function() {
  map.fitBounds(bounds);

  YEARS.map(addRaster);

  map.addSource("constructions", {
    type: "geojson",
    data: geojson
  });

  map.addLayer({
    id: "constructions-fills",
    type: "fill",
    source: "constructions",
    paint: {
      "fill-opacity": 0.5,
      "fill-color": FILL_COLOR.PLAIN
    }
  });

  filterBy();

  document.getElementById("set-done").addEventListener("change", filterBy);
  document.getElementById("unset-done").addEventListener("change", filterBy);
  snapSlider.noUiSlider.on("update", debounce(updateRasterLayers, 210));
});

function delay(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function debounce(f, t) {
  return function(args) {
    let previousCall = this.lastCall;
    this.lastCall = Date.now();
    if (previousCall && this.lastCall - previousCall <= t) {
      clearTimeout(this.lastCallTimer);
    }
    this.lastCallTimer = setTimeout(() => f(args), t);
  };
}
