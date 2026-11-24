# Postcode boundaries

Approximate postcode **sector** (`E1 6`) and **district** (`E1`) polygons for England and Wales, built only from open
data: the ONS National Statistics Postcode Lookup (NSPL) and census Output Area boundaries.

## How it works

Output Areas (OAs) are small (about 10–20 postcodes), clipped to the coastline, and follow roads, rivers and council
boundaries. Most OAs sit entirely inside one postcode sector, so they make good building blocks:

1. Each live postcode in the NSPL has a centroid and an OA.
2. An OA whose postcodes are all in one sector goes to that sector whole.
3. An OA split between sectors is divided by a Voronoi diagram of its postcode centroids, clipped to the OA.
4. OAs with no usable postcode join the neighbouring sector they share the longest edge with.
5. Pieces are merged into sectors, and sectors into districts, so the two levels nest exactly.

It's all SQL run by DuckDB (spatial extension) from Deno (or Node 24+, for `using`), in three stages: `loadInputs`,
`computeBoundaries` and `writeOutputs`.

## Data

From the ONS Open Geography Portal:

- **NSPL** (latest), CSV. Column names follow the 2025 renaming (`PCDS`, `EAST1M`, `OA21CD`…).
- **Output Areas (December 2021) Boundaries EW BGC (V2)**: download the Shapefile and unzip it.

## Run

```sh
deno task postcodes --nspl data/NSPL_NOV_2025_UK.csv --oa data/OA_2021_EW_BGC_V2.shp --area E
```

`--area` can be repeated; leave it out to build all of England and Wales. Other options: `--out <dir>`,
`--db <file>` (keep the intermediate tables to inspect), `--large-users`.

Writes to `out/`:

- `sectors.geojson` and `districts.geojson` in WGS84, at full detail
- `oa-lookup.csv`, which gives each OA's dominant sector and district and the share of its postcodes in each

In an `--area` run, OAs that are only partly in the area still use all of their postcodes, so the area's outer edge
is the same as in a full run.

## Tests

```sh
deno task postcodes:test
```

The tests use tiny made-up OAs and postcodes in an in-memory DuckDB. They check:

- whole and split OAs
- Voronoi gap filling
- empty OAs joining a neighbour
- area runs
- the OA lookup
- that sectors tile the OAs with no gaps or overlaps, and districts nest the sectors exactly
- that every postcode falls inside its own sector

## Left as an exercise

- **Scotland and Northern Ireland.** NRS publishes 2022 OAs (code column `code`). NISRA publishes Data Zones
  (`DZ2021_cd`), and NI postcodes are in Irish Grid (EPSG:29903) with their own licence terms. Both need extra
  boundary sources and some coordinate conversion.
- **Validation.** NRS's 2022 Frozen Postcode boundaries are real postcode polygons for Scotland. Merge them into
  sectors and compare with this method's output.
- **Vector tiles.** Feed the GeoJSON to tippecanoe with `--detect-shared-borders` to get a PMTiles file that's
  simplified per zoom level.

## Caveats

- Postcode areas don't really tile the land. Treat these as estimates, not legal boundaries.
- Converting from British National Grid to WGS84 uses PROJ's default transformation, which is accurate to within a
  few metres.
- Attribution: Contains OS data © Crown copyright and database right; Contains Royal Mail data © Royal Mail copyright
  and database right; Source: Office for National Statistics licensed under the Open Government Licence v3.0.
