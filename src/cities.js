export const cities = [
  {
    name: "chelyabinsk",
    description: "Челябинск",
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [61.23882293701172, 55.13826611409422],
          [61.360359191894524, 55.13826611409422],
          [61.360359191894524, 55.223344564576664],
          [61.23882293701172, 55.223344564576664],
          [61.23882293701172, 55.13826611409422],
        ],
      ],
    },
    years: ["2010", "2014", "2015", "2016", "2017", "2018", "2019"],
    raster_template:
      "https://staging.aeronetlab.space/rasters/api/v0/cogs/tiles/{z}/{x}/{y}.png?uri=s3://demos/constructions/chelyabinsk/{year}.tif",
    features:
      "https://minio.aeronetlab.space/public/constructions/chelyabinsk/data.geojson",
  },
];
