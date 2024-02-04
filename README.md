
## election-charts

View it live at https://littleapp.io/election-charts. This project is a React app that uses D3.js for interactive visualizations and webpack for bundling.

## Development

Prerequisites: You'll need Node.js, NPM, Python3

For creating GeoJSON files: `npm install -g shapefile`

### Preprocess some data

To get GeoJSON files for the county and state shapefiles, from the `data` directory:

`shp2json counties_20m_shapefile/cb_2020_us_county_20m.shp -o counties_20m.json`
`shp2json states_20m_shapefile/cb_2020_us_state_20m.shp -o states_20m.json`

Move the output files to your `src` folder.

To convert the election results CSV into JSON, from the `data` directory:

`python3 process.py`

Move the resulting `election_results.json` to your `src` directory.

### Install dependencies

`npm install`

### Run a dev server

`npm start`

### Build a bundled version for the web

`npm run build`

This will create a `dist` folder. Serve it from any static web server. I've deployed it via Amazon S3.

## Sources

### Election results: 

MIT Election Data and Science Lab, 2018, "County Presidential Election Returns 2000-2020", https://doi.org/10.7910/DVN/VOQCHQ, Harvard Dataverse, V12, UNF:6:KNR0/XNVzJC+RnAqIx5Z1Q== [fileUNF]

### Cartographic Boundary Files:

https://www.census.gov/geographies/mapping-files/time-series/geo/cartographic-boundary.2020.html
