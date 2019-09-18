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
    zoom: 10
  });
