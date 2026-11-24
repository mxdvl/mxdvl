# Postcode boundaries

Approximate UK postcode **sector** (`E1 6`) and **district** (`E1`) polygons, built only from open data: the ONS
National Statistics Postcode Lookup (NSPL) and census Output Area boundaries.

## How it works

Output Areas (OAs) are small (about 10–20 postcodes), clipped to the coastline, and follow roads, rivers and council
boundaries. Most OAs sit entirely inside one postcode sector, so they make good building blocks:

1. Each live postcode in the NSPL has a centroid and an OA.
2. An OA whose postcodes are all in one sector goes to that sector whole.
3. An OA split between sectors is divided by a Voronoi diagram of its postcode centroids, clipped to the OA.
4. OAs with no usable postcode join the neighbouring sector they share the longest edge with.
5. Pieces are merged into sectors and simplified together, so neighbours keep identical edges. Sectors are then merged
   into districts, so the two levels nest exactly.

All of it is SQL run by DuckDB (spatial extension) from Deno or Node, in three stages that can be used separately:
`loadInputs` (files → tables), `computeBoundaries` (tables → sectors, districts, OA lookup) and `writeOutputs`.

## Data

| What                                                | Where                        | Code column |
| --------------------------------------------------- | ---------------------------- | ----------- |
| NSPL (latest), CSV                                  | ONS Open Geography Portal    | —           |
| Output Areas (December 2021) Boundaries EW BGC (V2) | ONS Open Geography Portal    | `OA21CD`    |
| 2022 Census Output Area boundaries, clipped         | National Records of Scotland | `code`      |
| Data Zones 2021                                     | NISRA                        | `DZ2021_cd` |

Download the **Shapefile** for each and unzip it. Shapefiles from ONS and NRS are in British National Grid, which is
the default. Avoid the GeoJSON exports: they're large, slow to parse and in WGS84. Check a file's CRS with
`SELECT * FROM ST_Read_Meta('file.shp')`.

The script warns about postcodes whose OA code has no matching boundary. That shows whether the NSPL's `OA21CD` holds
the same vintage as your Scotland or NI boundary files.

## Run

```sh
# East London only (postcode area E)
deno task postcodes \
	--nspl data/NSPL_NOV_2025_UK.csv \
	--oa OA21CD=data/OA_2021_EW_BGC_V2.shp \
	--area E \
	--db out/work.duckdb

# Whole UK
deno task postcodes --nspl 'data/NSPL_*_UK.csv' \
	--oa OA21CD=data/OA_2021_EW_BGC_V2.shp \
	--oa code=data/OutputArea2022_MHW.shp \
	--oa DZ2021_cd@EPSG:29902=data/DZ2021.shp
```

Writes to `out/`:

- `sectors.geojson` and `districts.geojson` in WGS84, with `postcodes`, `area` and `district` properties
- `oa-lookup.csv`, which gives each OA's dominant sector and district and the share of its postcodes in each

Options: `--simplify <metres>` (default 10; 0 keeps full detail), `--large-users` (include large-user postcodes),
`--db <file>` (keep the intermediate tables to inspect), `--out <dir>`.

In an `--area` run, OAs that are only partly in the area still use all of their postcodes, so the area's outer edge
is the same as in a full run.

## How mixed are OAs?

```sh
deno task postcodes:report out/work.duckdb   # runs oa-purity.sql
```

For London and the South East, this gives the % of OAs that are entirely, ≥ 99 % and ≥ 90 % in one district or
sector. It reads the whole `postcodes` table, which every run keeps, so a `--area` run is enough.

## Tests

```sh
deno task postcodes:test
```

The tests build tiny made-up OAs and postcodes in an in-memory DuckDB, with no downloads apart from the spatial
extension. They check:

- whole and split OAs
- Voronoi gap filling
- empty OAs joining a neighbour
- area runs
- the OA lookup
- that sectors tile the OAs with no gaps or overlaps, and districts nest the sectors exactly
- that every postcode falls inside its own sector

### Checking against real postcode polygons

National Records of Scotland publishes **2022 Frozen Postcode boundaries**, real polygons drawn for the 2022 census. To
score the method, merge them into sectors and compare each with this tool's Scottish output using area overlap
(intersection over union). Treat the score as a best case: Scottish OAs were built from those polygons, and they're a
snapshot from April 2022.

## Expected cost

- Area E: seconds.
- Whole UK: about 1.8 M postcodes and about 230 k OAs. Expect minutes with BGC boundaries. 16 GB of RAM is plenty.

## Next: vector tiles

The output suits a single static PMTiles file:

- Run with `--simplify 0`, then let tippecanoe simplify per zoom level. Its `--detect-shared-borders` option keeps
  neighbouring polygons seam-free.
- Use districts at low zoom levels and sectors at high ones.
- Add a separate label point layer, built with `ST_PointOnSurface`.
- Keep only IDs in the tiles and colour sectors at runtime with MapLibre's `promoteId` and `setFeatureState`.

## Caveats

- Postcode areas don't really tile the land. Treat these as estimates for analysis and display, not legal
  boundaries.
- Converting from British National Grid to WGS84 uses PROJ's default transformation (no OSTN15 grid), which is
  accurate to within a few metres.
- Northern Irish (BT) postcodes in the NSPL have historically carried separate Land & Property Services licence
  terms. Check them before using the data commercially.
- Attribution: Contains OS data © Crown copyright and database right; Contains Royal Mail data © Royal Mail copyright
  and database right; Source: Office for National Statistics licensed under the Open Government Licence v3.0.
