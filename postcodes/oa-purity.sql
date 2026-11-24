-- How often does a single postcode district (or sector) cover ≥ 90 %, ≥ 99 %
-- or all of an Output Area’s postcodes? London and the South East.
--
-- Needs the `postcodes` table, so build with --db first. Counts live,
-- small-user postcodes with a good grid reference (the pipeline’s filters).
-- OAs hold ~10–20 postcodes, so ≥ 99 % is in practice the same as 100 %.

WITH regional AS (
	SELECT * FROM postcodes
	WHERE region IN ('E12000007', 'E12000008') -- London, South East
),
counts AS (
	SELECT 'district' AS level, region, oa, district AS unit, count(*) AS n FROM regional GROUP BY ALL
	UNION ALL
	SELECT 'sector' AS level, region, oa, sector AS unit, count(*) AS n FROM regional GROUP BY ALL
),
per_oa AS (
	SELECT level, any_value(region) AS region, oa, max(n) / sum(n) AS top_share, sum(n) AS postcodes
	FROM counts
	GROUP BY level, oa
)
SELECT
	level,
	CASE region WHEN 'E12000007' THEN 'London' ELSE 'South East' END AS region,
	count(*) AS output_areas,
	round(100 * avg((top_share = 1)::INTEGER), 1) AS pct_all,
	round(100 * avg((top_share >= 0.99)::INTEGER), 1) AS pct_99,
	round(100 * avg((top_share >= 0.90)::INTEGER), 1) AS pct_90,
	round(100 * avg((top_share < 0.5)::INTEGER), 1) AS pct_no_majority,
	median(postcodes) AS median_postcodes
FROM per_oa
GROUP BY ALL
ORDER BY level, region;
