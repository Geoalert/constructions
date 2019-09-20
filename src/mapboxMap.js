import { DEBUG, FILL_COLOR } from "./constants";
import { getRasterLayerUrl, delay } from "./helpers";

export default () =>
  new mapboxgl.Map({
    container: "map",
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
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | &copy; <a href="https://geoalert.io" target="_blank" rel="noopener noreferrer">Geoalert</a>',
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
    zoom: 10
  });

function hideAllRasters(ids, exclude, hidefn) {
  const toHide = ids.filter(id => id !== exclude);
  toHide.map(hidefn);
}

function addRaster(map, { id, tilesUrl, bounds }) {
  const sourceId = `raster-${id}`;
  const layerId = `${id}`;
  const tiles = tilesUrl;
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
  return () => {
    map.removeLayer(layerId);
    map.removeSource(sourceId);
  };
}

function loadFeatures(map, { featuresUrl }) {
  const sourceId = "constructions";
  const layerId = "constructions-fills";
  map.addSource(sourceId, {
    type: "geojson",
    data: featuresUrl
  });
  map.addLayer({
    id: layerId,
    type: "fill",
    source: "constructions",
    paint: {
      "fill-opacity": 0.5,
      "fill-color": FILL_COLOR.PLAIN
    }
  });
  return () => {
    map.removeLayer(layerId);
    map.removeSource(sourceId);
  };
}

export function loadMapData(
  map,
  { bounds, rasterIds, rasterUrlTempalte, featuresUrl }
) {
  map.fitBounds(bounds);

  const removeRaterLayers = rasterIds.map(id => {
    const tilesUrl = getRasterLayerUrl(rasterUrlTempalte, id);
    const options = { id, tilesUrl, bounds };
    // console.log(options);
    return addRaster(map, options);
  });
  const removeFeatures = loadFeatures(map, { featuresUrl });

  return () => {
    removeFeatures();
    removeRaterLayers.forEach(clearLayer => clearLayer());
  };
}

export function getFilters(state) {
  let filters = ["all", ["==", "year", state.year]];
  if (!state.showDiff) filters.push(["!=", "type", "done"]);
  return filters;
}

export function getPaintProperties(state) {
  let properties = ["fill-color", FILL_COLOR.DIFF];
  if (!state.showDiff) properties = ["fill-color", FILL_COLOR.PLAIN];
  return properties;
}

export function updateFeatures(map, state) {
  const filters = getFilters(state);
  const paintProps = getPaintProperties(state);
  map.setFilter("constructions-fills", filters);
  map.setPaintProperty("constructions-fills", ...paintProps);
}

export function updateRasterLayers(years, state, manager, actions) {
  const year = state.year;
  if (DEBUG) console.log("------->", year);
  manager.updateSet(actions.loadRaster)(year);
  actions.showRaster(year);
  delay(100).then(() => {
    hideAllRasters(years, year, actions.hideRaster);
    manager.loadNeighbourg(actions.loadRaster)(year, 1);
    manager.loadNeighbourg(actions.loadRaster)(year, -1);
    manager.unloadNeighbourg(actions.unloadRaster)(year, -2);
    manager.unloadNeighbourg(actions.unloadRaster)(year, 2);
    if (DEBUG) console.log("-------<", year);
  });
}

// export const layersUpdater = {
//   loadedYears: new Set(),
//   updateSet: fn => year => {
//     this.loadedYears.add(year);
//     fn(year);
//   },
//   init(map, years) {
//     this.map = map;
//     this.doWithNeighbourg = neighbourgUpdater(years);
//   },
//   loadNeighbourg: () => this.doWithNeighbourg(this.updateSet(loadRaster)),
//   unloadNeighbourg: () =>
//     doWithNeighbourg(unloadRaster, year => !loadedYears.has(year))
// };

// let loadedYears = new Set();
// const updateSet = fn => year => {
//   loadedYears.add(year);
//   fn(year);
// };
// const doWithNeighbourg = neighbourgUpdater(years);
// const loadNeighbourg = doWithNeighbourg(updateSet(loadRaster));
// const unloadNeighbourg = doWithNeighbourg(
//   unloadRaster,
//   year => !loadedYears.has(year)
// );
