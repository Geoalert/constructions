import { DEBUG } from "./constants";

export function loadRaster(id) {
  if (DEBUG) console.log("load", id);
  this.map.setLayoutProperty(id, "visibility", "visible");
}
export function unloadRaster(id) {
  if (DEBUG) console.log("unload", id);
  this.map.setLayoutProperty(id, "visibility", "none");
}

export function hideRaster(id) {
  if (DEBUG) console.log("hide", id);
  this.map.setPaintProperty(id, "raster-opacity", 0);
}
export function showRaster(id) {
  if (DEBUG) console.log("show", id);
  this.map.setPaintProperty(id, "raster-opacity", 1);
}
