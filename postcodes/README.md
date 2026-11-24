# Postcode boundaries

Approximate postcode **sector** (`E1 6`) and **district** (`E1`) boundaries for England and Wales as GeoJSON, built
only from open data: the ONS National Statistics Postcode Lookup (NSPL) and census Output Area boundaries.

> **Status: not yet run against real data, and the core hypothesis is untested.** Every `TODO(reality)` in the code
> is an assumption to check on the first run.

## The hypothesis

Output Areas (OAs) hold about 10–20 postcodes each and are built from whole postcodes. **If most OAs sit entirely
inside one postcode sector**, sector boundaries can be approximated by:

1. giving each OA to the sector most of its postcodes belong to, then
2. merging OAs into sectors, and sectors into districts.

OA boundaries are clipped to the coastline and follow roads, rivers and council boundaries, so the result would
inherit those edges.

The first run tests this. The summary table reports `split_between_sectors`, the number of OAs whose postcodes span
more than one sector, and `oa-lookup.csv` gives each OA's majority share. If many OAs are split, this approach needs
OA splitting, or rethinking.

Known gaps, on purpose:

- **A split OA goes whole to its majority sector.**
- **An OA with no postcodes belongs to no sector**, which leaves a hole.

## Data

From the ONS Open Geography Portal:

- **NSPL** (latest), CSV, with the column names introduced in 2025 (`PCDS`, `OA21CD`…).
- **Output Areas (December 2021) Boundaries EW BGC (V2)**: download the Shapefile and unzip it.

## Run

```sh
deno task postcodes --nspl data/NSPL_NOV_2025_UK.csv --oa data/OA_2021_EW_BGC_V2.shp --area E
```

`--area` can be repeated; leave it out to build all of England and Wales. Other options: `--out <dir>`, and
`--db <file>` to keep the tables for inspection.

Writes to `out/`:

- `sectors.geojson` and `districts.geojson` in WGS84
- `oa-lookup.csv`, which gives each OA's majority sector and district and the share of its postcodes in each

For TopoJSON, which GDAL can't write, use `npx topojson-server geo2topo sectors=out/sectors.geojson`.

## Tests

```sh
deno task postcodes:test
```

The tests run the real SQL on tiny made-up OAs and an NSPL-shaped CSV.

## If it has legs

- Split mixed OAs between their sectors, for example with a Voronoi diagram of postcode centroids clipped to each OA.
- Give OAs without postcodes to a neighbouring sector.
- Add Scotland (NRS 2022 OAs) and Northern Ireland (NISRA Data Zones).
- Build vector tiles (PMTiles via tippecanoe).

## Attribution

Contains OS data © Crown copyright and database right; Contains Royal Mail data © Royal Mail copyright and database
right; Source: Office for National Statistics licensed under the Open Government Licence v3.0.
