const shadows = [];

const size = 3600;

// <path d="M 12 -10 Q 12 -12 12 0 T 12 60 T 12 90 T 12 120 T 12 180 " />
// <path d="M 42 -10 Q 42 -30 42 0 T 43 60 T 41 90 T 43 120 T 42 180 " />
// <path d="M 72 -10 Q 72 -12 72 0 T 72 60 T 72 90 T 72 120 T 72 180 " />
// <path d="M 99 -10 Q 99 -12 98 0 T 97 60 T 98 90 T 97 120 T 99 180 " />
const horizontal = (
	<path
		transform="translate(900,1200)"
		fill="none"
		stroke-width={12}
		d="M -60 0 Q -30 0 0 0 T 60 0.5 T 120 1 T 180 -0.5 T 240 1 T 300 0.5 T 360 0 T 420 6"
	/>
);

const horizontals = (length: number) =>
	Array.from(
		{ length },
		(_, i) => (
			<path
				fill="none"
				stroke-width={9}
				d={[
					`M12,${i * 36 + 12}`,
					"q",
					...Array.from({ length: size / 120 }, () => [
						`60,${Math.random() * 8 - 4} 120,0`,
					]),
				].join(" ")}
			/>
		),
	);

const verticals = (length: number) =>
	Array.from(
		{ length },
		(_, i) => (
			<path
				fill="none"
				stroke-width={9}
				d={[
					`M${i * 24 + 12},12`,
					"q",
					...Array.from({ length: size / 120 }, () => [
						`${Math.random() * 12 - 6},30 0,120`,
					]),
				].join(" ")}
			/>
		),
	);

export const boss = () => (
	<svg
		viewBox="0 0 3600 3600"
		version="1.1"
		fill-rule="evenodd"
		clip-rule="evenodd"
		stroke="rgb(9,24,48)"
	>
		<g
			id="vertical"
			clip-path={`path('${
				[
					"M2262.2,2039.76C2230.21,1968.75 2133.82,1782.24 2045.21,1670.19C1953.31,1553.99 1817.99,1446.76 1710.83,1342.55C1608.38,1242.92 1511.85,1120.24 1402.24,1044.93C1279.78,1080.84 1106.63,1144.94 1055.95,1233.18C1005.26,1321.42 1118.55,1466.81 1098.14,1574.37C1077.72,1681.92 944.36,1809.71 933.487,1878.51C925.825,1926.99 991.11,1961.39 1032.9,1987.14C1094.46,2025.07 1211.23,2070.31 1302.82,2106.05C1405.92,2146.27 1557.25,2214.33 1651.46,2228.47C1723.92,2239.35 1800.67,2209.18 1868.06,2190.87C1932.75,2173.29 1993.15,2142.61 2055.75,2118.61C2121.44,2093.42 2170.44,2087.97 2262.2,2039.76Z",
					"M1947.4,2256.1C1923.51,2413.18 1877.74,2531.14 1844.86,2636.59C1764.13,2594.57 1706.09,2497.37 1723.18,2433.95C1740.27,2370.54 1810.88,2264.88 1947.4,2256.1Z",
					"M1862.2,3123.74C1738.96,3147.41 1574.89,3248.84 1310.83,3070.27C1046.77,2891.69 1031.53,2871.79 1011.61,2701.01C991.69,2530.23 996.183,2416.71 975.87,2206.38C955.558,1996.05 930.948,2008.37 936.417,1927.57C941.886,1846.77 978.8,1751.24 989.151,1684.29C999.503,1617.34 878.214,1650.83 751.847,1666.4C625.479,1681.97 395.987,1728.96 311.417,1922.81C226.847,2116.65 261.612,2118.27 329.386,2214.21C397.159,2310.15 397.55,2345.93 608.292,2437.47C766.69,2673.06 896.964,2838.98 1027.43,2975.44C1157.9,3111.91 1280.17,3195.97 1453.02,3202.34C1625.87,3208.7 1743.64,3204.8 1862.2,3123.74Z",
				].join("")
			}')`}
		>
			{/* <rect width={size} height={size} fill="rgba(200,50,30,0.2)"></rect> */}
			{verticals(size / 36)}
		</g>
		<g
			id="horizontal"
			clip-rule="nonzero"
			clip-path={[
				"path('",
				"M2449.14,1252.72c9.66,-25.97,18.75,-39.64,35.31,-21.04c16.56,18.6,42.27,105.41,46.33,165.67c4.06,60.26,10.47,216.83,3.28,247.58c-7.19,30.76,-32.34,69.68,-66.02,82.33c-33.67,12.64,-66.25,26.96,-95.39,25.29c-29.14,-1.66,-67.5,9.86,-80.54,-33.35c-8.21,54.73,-57.46,69.48,-78.24,74.37c-20.79,4.88,-77.97,6.89,-112.74,-22.9c-34.76,-29.79,-40.78,-33.49,-47.03,-70.12c-6.25,-36.62,-13.36,-112.72,-10.31,-154.03c3.04,-41.31,3.51,-141.07,14.14,-163.97c10.62,-22.9,25.39,-16.5,46.4,-8.29c21.02,8.2,14.77,18.36,34.61,30.81c19.85,12.44,45.74,8.58,83.52,-1.62c37.77,-10.2,60.19,-19.92,103.79,-39.69c43.59,-19.78,105.08,-55.51,116.79,-64.36c11.72,-8.84,-1.09,-27.34,6.1,-46.68zm-110.39,258.79l0,0c-8.05,29.59,-8.85,55.54,1.44,84.08c10.98,30.43,22.78,31.79,57.46,32.4c36.18,0.62,42.43,-15.97,58.28,-33.84c12.15,-13.69,12.43,-36.82,12.43,-61.72c0,-24.89,-5.08,-32.67,-10.32,-54.44c-5.23,-21.77,-23.75,-12.35,-54.14,-0.2c-30.39,12.16,-37.36,16.72,-65.15,33.72m-65.71,9.75l0,0c-18.09,-5.71,-11.02,-10.57,-34.22,-4.86c-23.2,5.72,-23.56,12.21,-55.12,25.1c-31.56,12.89,-30.7,9.2,-70.98,44.6c-6.48,56.99,3.21,62.61,31.25,85c28.05,22.38,55.75,6.1,78.17,-0.03c22.42,-6.13,30.51,-23.9,40.58,-52.27c10.08,-28.36,5.75,-68.39,10.32,-97.54",
				"M1911.01,2424.42c35.47,20.65,71.1,28.62,93.08,56.53c-40.06,35.84,-81.93,50.95,-108.49,88.68c-26.57,37.73,-21.93,65.05,29.37,82.49c51.3,17.45,83.1,-37.18,113.62,-63.12c30.52,-25.95,66.88,-73.91,113.39,-101.58c46.51,-27.67,142.13,-116.41,220.83,-114.88c78.7,1.54,-56.72,206.7,-63.65,243.12c-51.25,17.97,-79.58,23.57,-124.16,36.95c32.13,-48.89,46.2,-49.12,76.98,-75c30.78,-25.88,65.67,-70.85,59.32,-92.73c-6.35,-21.87,-51.09,-13.53,-78.18,23.89c-27.08,37.43,-115.05,136.01,-149.53,182.86c-34.48,46.85,-46.8,68.27,-126.85,72.3c-80.05,4.04,-140.1,-26.11,-169.27,-69.3c-29.16,-43.2,-51.77,-86.41,-28.44,-129.72c5.53,-69.03,45.32,-162.9,95.89,-199.43c18.49,28.22,26.62,35.05,46.09,58.94z",
				"M2192.54,1895.64c49.19,-13.93,217.32,-28.21,248.83,5.15c31.51,33.37,46.61,74.07,33.59,135.01c-13.02,60.94,-27.55,143.75,-100.1,212.21c-72.55,68.45,-74.17,76.31,-117.08,88.8c-42.92,12.5,-99.77,31.67,-138.83,27.64c-39.06,-4.04,-79.64,-10.13,-106.46,-57.49c-26.82,-47.37,-52.81,-86.45,-48.75,-147.07c-30.21,-66.28,-41.3,-142.63,-13.12,-179.64c28.17,-37.01,38.17,-60.81,96.4,-65.63c58.23,-4.81,103.26,2.96,145.52,-18.98zm-112.6,217.37l0,0c-7.09,166.46,72.18,109.28,119.87,114.81c47.68,5.53,104.48,-54.23,128.54,-83.39c24.06,-29.17,67.97,-67.87,39.32,-109.85c-28.64,-41.97,-45.68,-31.48,-125.91,-32.82c-63.05,26.74,-134.43,-14.06,-164.84,14.21c-30.42,28.27,-22.14,53.52,3.02,97.04z",
				"M1710.54,2724.22c56.15,22.77,98.13,47.93,135.32,78.07c-50.42,7.65,-112.19,16.47,-97.5,53.61c14.68,37.15,57.18,47.54,131.66,36.3c74.48,-11.23,98.1,-31.42,137.79,-62.18c39.69,-30.76,60.99,-48.78,106.98,-87.89c45.99,-39.11,59.43,-59.68,87.92,-39.27c28.49,20.41,4.79,89.83,-9.07,120.56c-13.85,30.73,-14.11,35.68,-29.37,57.32c-52.61,22.82,-59.64,25.63,-103.86,36.66c59.43,-55.38,76.2,-59.38,92.09,-88.87c15.88,-29.49,24.06,-38.28,12.6,-53.91c-11.46,-15.62,-38.96,31.54,-65.47,44.4c-26.51,12.86,-90.91,66.71,-134.5,89.78c-43.6,23.08,-103.28,73.96,-170.42,67.87c-67.13,-6.08,-123.49,-20.95,-152.76,-66.95c-29.27,-46,11.51,-143.71,58.59,-185.5z",
				"M1052.85,1256.91c38.18,-17.58,24.76,-11.66,37.46,-25.43c-1.1,49.12,5.09,112.66,39.47,150.68c34.37,38.01,58.8,43.12,89.9,38.07c31.09,-5.04,34.89,-11.85,48.54,-53.51c13.64,-41.65,19.01,-143.51,28.85,-186.77c-38.75,-24.77,-44.37,-20.4,-77.39,-64.09c-5.26,-65.53,5.05,-59.49,-29.64,-171.584c-26.25,32.603,-44.32,60.724,-62.97,96.924c-0.31,29.98,-11.3,48.8,-7.97,74.66c-23.8,16.2,-28.79,19.61,-28.79,19.61c0,0,-18.19,19.26,-23.5,44.48c-5.31,25.23,-9.84,50.88,-13.96,76.96zm93.02,-62.35c28.34,26.31,42.71,46.89,71.67,56.65c1.3,55.5,-7.71,82.85,-48.91,54.08c-23.54,-16.45,-33.43,-36.46,-34.37,-53.16c-1.48,-26.36,3.49,-37.98,11.61,-57.57z",
				"M986.607,1700.97c45.463,35.19,97.353,60.61,132.613,37.05c35.25,-23.57,26.24,-74.3,-25.59,-102.77c-51.82,-28.48,-50.52,-20.9,-90.78,-52.96c6.3,-54.82,18.39,-117.13,29.12,-161.82c31.72,50.55,59.32,80.57,104.68,112.86c45.37,32.29,87.24,102.71,86.98,167.64c-0.26,64.93,-27.39,148.35,-114.68,170.04c-87.3,21.68,-117.92,10.64,-160.212,-22.11c10.99,-66.96,20.268,-97.77,37.869,-147.93z",
				"M1008.67,2618.3c38.36,20.07,38.59,40.52,67.73,7.96c29.14,-32.56,81.49,-125.98,55.86,-192c-25.62,-66.01,-92.73,-31.98,-126.72,-14.06c0,0,1.18,80.77,1.18,80.77c31.79,-31.3,49.06,-14.54,39.21,29.01c-9.84,43.54,1.25,34.47,-32.89,43.5l-4.37,44.82z",
				"m-22.063,-382.74c33.943,-12.44,62.223,20.85,88.783,1c26.56,-19.85,77.19,-86.4,43.83,-130.2c-33.36,-43.8,-86.96,25.14,-103.44,47.46c-16.486,22.32,-18.778,21.05,-36.939,30.25c-9.152,-44.39,-26.025,-148.93,-26.025,-148.93c55.104,-24.31,119.684,-74.83,175.124,-51.95c55.43,22.88,84.61,62.82,74.17,117.58c-10.44,54.76,-18.64,144.33,-68.4,197.35c-49.77,53.03,-44.9,46.38,-74.51,63.04c-49.42,-37.15,-45,-33.77,-69.593,-51.66c-2.186,-29.46,-3.198,-47.72,-3,-73.94z",
				"M1695.17,1569.6c19.14,73.54,29.92,77.29,15.08,128.27c-14.85,50.98,-98.05,405.41,-161.33,503.35c-39.3,140.67,-137.8,422.18,-191.63,615.64c55.94,15.18,69.77,51.26,127.5,54.53c51.96,-174.07,165,-556.37,207.58,-637.47c75.39,-120.7,88.99,-175.29,111.88,-256.69c22.89,-81.4,41.73,-293.27,23.29,-372.52c-57.65,-13.82,-89.2,-13.67,-132.37,-35.11z",
				"M1454,539c-90.96,59.601,-137.78,194.78,-95.32,285.783c46.58,99.841,141.95,280.254,374.82,313.264c216.54,30.69,555.12,15.52,652.11,-149.33c127.24,-216.269,212.49,-314.35,-378.14,-548.956c-180.9,-71.855,-399.53,-1.618,-553.47,99.239z",
				"')",
			].join("")}
		>
			{/* <rect width={size} height={size} fill="rgba(20,250,30,0.2)"></rect> */}
			{horizontals(size / 36)}
		</g>
		<g id="Can" fill="none" stroke-width="16px" stroke="rgb(9,24,48)">
			<path d="M1960.29,848.677C1922.21,894.341 1897.4,913.736 1913.03,953.286" />
			<path d="M2364.98,887.134C2345.45,963.54 2310.88,983.325 2224.35,1006.76C2137.83,1030.2 2103.85,1029.09 2047.6,1015.79" />
			<path d="M2014.39,825.357C2123.96,799.478 2177.87,780.923 2261.07,773.97C2344.28,767.017 2331.19,797.798 2354.63,844.536" />
			<path d="M1020.62,2670.78C1062.11,2737.09 1148.05,2820.68 1201.25,2845.73C1254.45,2870.78 1349.53,2964.57 1499.69,2973.07C1649.84,2981.57 1726.91,3021.91 1798.91,3010.68C1870.9,2999.44 1960.35,3012.48 2036.29,2984.36C2112.23,2956.23 2193.79,2915.07 2229.02,2887.63" />
			<path d="M1024.77,2738.02C1053.83,2774.1 1088.36,2812.73 1134.61,2846.42C1180.86,2880.11 1240.55,2918.89 1304.14,2950.86C1367.74,2982.84 1458.2,2999.59 1524.92,3031.47C1591.64,3063.36 1625.08,3083.09 1684.3,3080.4C1743.52,3077.72 1785.98,3085.76 1864.57,3078.39C1943.16,3071.03 1991.99,3031.04 2091.6,3005.99C2191.21,2980.93 2106.45,3000.66 2134.41,2986.75" />
			<path d="M2483.46,968.371C2500.18,986.871 2493.53,974.082 2512.58,988.439C2522.63,1021.01 2542.8,1097.11 2554.34,1152.27C2570.96,1231.82 2587.15,1375.79 2612.34,1465.75C2637.54,1555.71 2660.98,1772.19 2672.89,1888.17C2595.74,2029.89 2522.21,2249.15 2454.43,2403.19C2386.66,2557.23 2268.1,2786.98 2236.07,2881.22C2187.83,2968.85 2131.58,2990.57 2084.12,3018.66C2002.87,3091.66 1756.58,3205.18 1560.49,3151.96C1364.39,3098.74 1234.9,3067.51 1136.85,2955.32C1038.81,2843.13 1037.44,2827.76 1023.96,2724.48C1010.49,2621.2 1012.25,2665.63 1012.25,2665.63C1012.25,2665.63 1010.1,2550.9 995.253,2355.34C980.409,2159.77 965.761,2107.64 930.995,1946.76C962.05,1717.88 983.534,1733.56 1000.14,1601.72C1016.74,1469.89 1046.62,1362.58 1061.27,1192.91C1136.27,997.486 1103.65,1080.98 1181.97,948.657C1260.29,816.333 1244.08,859.771 1323.57,731.118" />
			<path d="M1377.87,601.489C1458.77,495.598 1601.31,438.169 1787.44,424.243C1973.57,410.318 2143.3,461.821 2270.06,541.294C2396.82,620.767 2467.23,651.763 2491.54,746.743C2515.86,841.724 2443.1,947.564 2348.57,1022.27C2254.04,1096.98 2147.99,1170.71 1954.04,1152.27C1760.1,1133.83 1756,1174.95 1568.3,1073.52C1380.6,972.095 1441.35,966.587 1384.9,855.63C1328.46,744.673 1338.42,653.13 1377.87,601.489Z" />
			<path d="M1507.17,1002C1434.9,831.353 1441.15,838.677 1482.95,746.997C1524.75,655.318 1593.89,629.712 1695.45,593.931C1797.01,558.15 1894.28,559.263 2015.96,579.4C2137.64,599.536 2191.54,637.505 2279.04,671.685C2366.54,705.864 2385.29,732.212 2417.52,780.806C2449.74,829.4 2450.92,812.075 2444.47,881.646" />
			<path d="M2166.81,966.593C2187.12,965.291 2197.48,963.213 2215.45,965.229" />
			<path d="M2264.72,833.26C2308.42,843.906 2323.37,870.463 2307.85,896.802C2292.33,923.14 2273.84,937.953 2235.87,945.958C2243.47,897.75 2249.1,870.369 2264.72,833.26Z" />
			<path d="M2177.33,821.578C2222.17,809.27 2228.89,807.869 2246.39,801.359" />
			<path d="M2133.93,1067.68C2034.71,1075.01 2045.64,1088.89 1971.42,1050.94C1897.21,1012.99 1859.32,1002 1728.65,957.564C1597.99,913.13 1588.03,933.286 1533.73,871.997" />
			<path d="M1682.75,672.779C1764.98,680.22 1721.62,691.685 1811.85,701.821C1902.09,711.958 1920.45,702.818 1989.59,733.325C2058.73,763.833 2079.43,752.251 2140.37,767.993" />
			<path d="M2007.56,898.736C2091.93,859.79 2162.83,832.31 2164,900.923C2165.18,969.536 2019.08,998.931 1975.53,999.673C1980.67,959.301 1975.58,936.837 2007.56,898.736Z" />
			<path d="M1334.11,772.09C1337.54,840.254 1405.82,1006.48 1482.54,1062.33C1559.26,1118.18 1706.45,1181.71 1802.78,1200.86C1899.11,1220 2031.02,1257.11 2128.87,1228.35C2226.72,1199.58 2274.93,1158.62 2325.71,1118.43C2376.49,1078.25 2428.36,1012.95 2456.02,978.824C2483.68,944.699 2481.41,933.278 2500.94,871.168" />
		</g>
		<g id="Boss" stroke="rgb(9,24,48)" stroke-width="12px" fill="rgba(0,0,0,0.0625)">
			<path d="M2449.14,1252.72C2458.8,1226.75 2467.89,1213.08 2484.45,1231.68C2501.01,1250.28 2526.72,1337.09 2530.78,1397.35C2534.84,1457.61 2541.25,1614.18 2534.06,1644.93C2526.87,1675.69 2501.72,1714.61 2468.04,1727.26C2434.37,1739.9 2401.79,1754.22 2372.65,1752.55C2343.51,1750.89 2305.15,1762.41 2292.11,1719.2C2283.9,1773.93 2234.65,1788.68 2213.87,1793.57C2193.08,1798.45 2135.9,1800.46 2101.13,1770.67C2066.37,1740.88 2060.35,1737.18 2054.1,1700.55C2047.85,1663.93 2040.74,1587.83 2043.79,1546.52C2046.83,1505.21 2047.3,1405.45 2057.93,1382.55C2068.55,1359.65 2083.32,1366.05 2104.33,1374.26C2125.35,1382.46 2119.1,1392.62 2138.94,1405.07C2158.79,1417.51 2184.68,1413.65 2222.46,1403.45C2260.23,1393.25 2282.65,1383.53 2326.25,1363.76C2369.84,1343.98 2431.33,1308.25 2443.04,1299.4C2454.76,1290.56 2441.95,1272.06 2449.14,1252.72ZM2273.04,1521.26C2268.47,1550.41 2272.8,1590.44 2262.72,1618.8C2252.65,1647.17 2244.56,1664.94 2222.14,1671.07C2199.72,1677.2 2172.02,1693.48 2143.97,1671.1C2115.93,1648.71 2106.24,1643.09 2112.72,1586.1C2153,1550.7 2152.14,1554.39 2183.7,1541.5C2215.26,1528.61 2215.62,1522.12 2238.82,1516.4C2262.02,1510.69 2254.95,1515.55 2273.04,1521.26ZM2338.75,1511.51C2366.54,1494.51 2373.51,1489.95 2403.9,1477.79C2434.29,1465.64 2452.81,1456.22 2458.04,1477.99C2463.28,1499.76 2468.36,1507.54 2468.36,1532.43C2468.36,1557.33 2468.08,1580.46 2455.93,1594.15C2440.08,1612.02 2433.83,1628.61 2397.65,1627.99C2362.97,1627.38 2351.17,1626.02 2340.19,1595.59C2329.9,1567.05 2330.7,1541.1 2338.75,1511.51Z" />
			<path d="M1911.01,2424.42C1946.48,2445.07 1982.11,2453.04 2004.09,2480.95C1964.03,2516.79 1922.16,2531.9 1895.6,2569.63C1869.03,2607.36 1873.67,2634.68 1924.97,2652.12C1976.27,2669.57 2008.07,2614.94 2038.59,2589C2069.11,2563.05 2105.47,2515.09 2151.98,2487.42C2198.49,2459.75 2294.11,2371.01 2372.81,2372.54C2451.51,2374.08 2316.09,2579.24 2309.16,2615.66C2257.91,2633.63 2229.58,2639.23 2185,2652.61C2217.13,2603.72 2231.2,2603.49 2261.98,2577.61C2292.76,2551.73 2327.65,2506.76 2321.3,2484.88C2314.95,2463.01 2270.21,2471.35 2243.12,2508.77C2216.04,2546.2 2128.07,2644.78 2093.59,2691.63C2059.11,2738.48 2046.79,2759.9 1966.74,2763.93C1886.69,2767.97 1826.64,2737.82 1797.47,2694.63C1768.31,2651.43 1745.7,2608.22 1769.03,2564.91C1774.56,2495.88 1814.35,2402.01 1864.92,2365.48C1883.41,2393.7 1891.54,2400.53 1911.01,2424.42Z" />
			<path d="M2192.54,1895.64C2241.73,1881.71 2409.86,1867.43 2441.37,1900.79C2472.88,1934.16 2487.98,1974.86 2474.96,2035.8C2461.94,2096.74 2447.41,2179.55 2374.86,2248.01C2302.31,2316.46 2300.69,2324.32 2257.78,2336.81C2214.86,2349.31 2158.01,2368.48 2118.95,2364.45C2079.89,2360.41 2039.31,2354.32 2012.49,2306.96C1985.67,2259.59 1959.68,2220.51 1963.74,2159.89C1933.53,2093.61 1922.44,2017.26 1950.62,1980.25C1978.79,1943.24 1988.79,1919.44 2047.02,1914.62C2105.25,1909.81 2150.28,1917.58 2192.54,1895.64ZM2079.94,2113.01C2054.78,2069.49 2046.5,2044.24 2076.92,2015.97C2107.33,1987.7 2178.71,2028.5 2241.76,2001.76C2321.99,2003.1 2339.03,1992.61 2367.67,2034.58C2396.32,2076.56 2352.41,2115.26 2328.35,2144.43C2304.29,2173.59 2247.49,2233.35 2199.81,2227.82C2152.12,2222.29 2072.85,2279.47 2079.94,2113.01Z" />
			<path d="M1710.54,2724.22C1766.69,2746.99 1808.67,2772.15 1845.86,2802.29C1795.44,2809.94 1733.67,2818.76 1748.36,2855.9C1763.04,2893.05 1805.54,2903.44 1880.02,2892.2C1954.5,2880.97 1978.12,2860.78 2017.81,2830.02C2057.5,2799.26 2078.8,2781.24 2124.79,2742.13C2170.78,2703.02 2184.22,2682.45 2212.71,2702.86C2241.2,2723.27 2217.5,2792.69 2203.64,2823.42C2189.79,2854.15 2189.53,2859.1 2174.27,2880.74C2121.66,2903.56 2114.63,2906.37 2070.41,2917.4C2129.84,2862.02 2146.61,2858.02 2162.5,2828.53C2178.38,2799.04 2186.56,2790.25 2175.1,2774.62C2163.64,2759 2136.14,2806.16 2109.63,2819.02C2083.12,2831.88 2018.72,2885.73 1975.13,2908.8C1931.53,2931.88 1871.85,2982.76 1804.71,2976.67C1737.58,2970.59 1681.22,2955.72 1651.95,2909.72C1622.68,2863.72 1663.46,2766.01 1710.54,2724.22Z" />
			<path d="M1008.67,2618.3C1047.03,2638.37 1047.26,2658.82 1076.4,2626.26C1105.54,2593.7 1157.89,2500.28 1132.26,2434.26C1106.64,2368.25 1039.53,2402.28 1005.54,2420.2C1005.54,2420.2 1006.72,2500.97 1006.72,2500.97C1038.51,2469.67 1055.78,2486.43 1045.93,2529.98C1036.09,2573.52 1047.18,2564.45 1013.04,2573.48L1008.67,2618.3Z" />
			<path d="M986.607,2235.56C1020.55,2223.12 1048.83,2256.41 1075.39,2236.56C1101.95,2216.71 1152.58,2150.16 1119.22,2106.36C1085.86,2062.56 1032.26,2131.5 1015.78,2153.82C999.294,2176.14 997.002,2174.87 978.841,2184.07C969.689,2139.68 952.816,2035.14 952.816,2035.14C1007.92,2010.83 1072.5,1960.31 1127.94,1983.19C1183.37,2006.07 1212.55,2046.01 1202.11,2100.77C1191.67,2155.53 1183.47,2245.1 1133.71,2298.12C1083.94,2351.15 1088.81,2344.5 1059.2,2361.16C1009.78,2324.01 1014.2,2327.39 989.607,2309.5C987.421,2280.04 986.409,2261.78 986.607,2235.56Z" />
			<path d="M986.607,1700.97C1032.07,1736.16 1083.96,1761.58 1119.22,1738.02C1154.47,1714.45 1145.46,1663.72 1093.63,1635.25C1041.81,1606.77 1043.11,1614.35 1002.85,1582.29C1009.15,1527.47 1021.24,1465.16 1031.97,1420.47C1063.69,1471.02 1091.29,1501.04 1136.65,1533.33C1182.02,1565.62 1223.89,1636.04 1223.63,1700.97C1223.37,1765.9 1196.24,1849.32 1108.95,1871.01C1021.65,1892.69 991.03,1881.65 948.738,1848.9C959.728,1781.94 969.006,1751.13 986.607,1700.97Z" />
			<path d="M1695.17,1569.6C1714.31,1643.14 1725.09,1646.89 1710.25,1697.87C1695.4,1748.85 1612.2,2103.28 1548.92,2201.22C1509.62,2341.89 1411.12,2623.4 1357.29,2816.86C1413.23,2832.04 1427.06,2868.12 1484.79,2871.39C1536.75,2697.32 1649.79,2315.02 1692.37,2233.92C1767.76,2113.22 1781.36,2058.63 1804.25,1977.23C1827.14,1895.83 1845.98,1683.96 1827.54,1604.71C1769.89,1590.89 1738.34,1591.04 1695.17,1569.6Z" />
			<path d="M1052.85,1256.91C1091.03,1239.33 1077.61,1245.25 1090.31,1231.48C1089.21,1280.6 1095.4,1344.14 1129.78,1382.16C1164.15,1420.17 1188.58,1425.28 1219.68,1420.23C1250.77,1415.19 1254.57,1408.38 1268.22,1366.72C1281.86,1325.07 1287.23,1223.21 1297.07,1179.95C1258.32,1155.18 1252.7,1159.55 1219.68,1115.86C1214.42,1050.33 1224.73,1056.37 1190.04,944.276C1163.79,976.879 1145.72,1005 1127.07,1041.2C1126.76,1071.18 1115.77,1090 1119.1,1115.86C1095.3,1132.06 1090.31,1135.47 1090.31,1135.47C1090.31,1135.47 1072.12,1154.73 1066.81,1179.95C1061.5,1205.18 1056.97,1230.83 1052.85,1256.91ZM1145.87,1194.56C1174.21,1220.87 1188.58,1241.45 1217.54,1251.21C1218.84,1306.71 1209.83,1334.06 1168.63,1305.29C1145.09,1288.84 1135.2,1268.83 1134.26,1252.13C1132.78,1225.77 1137.75,1214.15 1145.87,1194.56Z" />
		</g>
		<g id="Marks" stroke-width="12" stroke="rgb(9,24,48)" fill="none">
			<path d="M1192.25,2636.72C1211.54,2652.5 1213.26,2653.23 1236.62,2658.94C1253.65,2642.49 1257.01,2639.65 1257.01,2639.65" />
			<path d="M1178.18,2677.69C1189.82,2688.82 1176.54,2686.93 1199.75,2693.47" />
			<path d="M1179.59,2725.45C1146.46,2699.96 1126.46,2669.11 1141.93,2624.86C1157.4,2580.62 1181.07,2588.09 1205.92,2584.53C1230.76,2580.97 1208.96,2568.47 1212.32,2559.63C1215.68,2550.78 1261.93,2585.89 1261.93,2585.89L1213.11,2606.25L1205.92,2584.53" />
			<path d="M1291.39,2625.06C1300.29,2657.97 1304.9,2737.9 1249.9,2747.76C1194.9,2757.62 1242.4,2749.66 1245.84,2723.25C1212.32,2727.45 1199.59,2732.08 1186.7,2753.13C1205.68,2770.18 1216,2768.9 1229.82,2773.59C1237.01,2752.21 1228.34,2749.91 1228.34,2749.91" />
			<path d="M1321.65,2571.24C1331.81,2523.87 1337.36,2515.18 1351.26,2483.74" />
			<path d="M1293.61,2456.11C1308.21,2401.03 1297.82,2397.66 1327.59,2387.89C1357.36,2378.13 1396.5,2400.93 1432.28,2426.71" />
			<path d="M1395.32,2478.03C1389.78,2444.93 1376.73,2424.36 1384.54,2398.39" />
			<path d="M1387.75,2374.12C1384.15,2396.82 1401.89,2340.47 1416.18,2309.32" />
			<path d="M1398.68,2152.96C1393.29,2181.67 1383.68,2220.6 1374.54,2246.04" />
			<path d="M1352.2,2250.73C1385.48,2256.98 1420.87,2256.16 1447.28,2277.15C1448.68,2229.59 1453.61,2211.01 1465.64,2189.77" />
			<path d="M1374.86,2133.57C1392.2,2104.18 1398.21,2113.5 1429.7,2116.43C1461.18,2119.36 1495.79,2131.96 1512.59,2149.68C1501.34,2167.65 1502.75,2156.59 1498.14,2191.11" />
			<path d="M1439.23,2106.57C1421.57,2065.7 1432.67,2063.89 1434.07,2031.76C1470.09,2044.7 1514.15,2058.77 1549.86,2057.89" />
			<path d="M1468.29,1927.32C1467.28,1939.57 1466.03,1941.78 1472.43,1953C1503.29,1959.21 1552.59,1974.05 1575.64,1973.07" />
			<path d="M1528.68,1919.41C1530.72,1953.59 1527.75,1961.49 1539.62,1978.54C1533.06,2005.54 1535.72,2015.94 1528.37,2037.57" />
			<path d="M1577.04,1909.45C1563.84,1926.44 1561.81,1932.54 1557.04,1954.86" />
			<path d="M1517.51,1814.14C1508.29,1832.64 1499.7,1863.55 1494.54,1888.6" />
			<path d="M1543.92,1846.17C1536.97,1862.57 1535.32,1865.17 1530.48,1887.72" />
			<path d="M1508.06,1848.95C1529.15,1860.97 1506.34,1844.85 1537.04,1867.89" />
			<path d="M1551.97,1752.18C1566.42,1781.76 1570.64,1820.38 1604.62,1830.83C1620.87,1810.57 1618.84,1778.25 1636.5,1749.68" />
			<path d="M1582.43,1576.3C1595.48,1607.21 1607.12,1650.77 1662.04,1662.78" />
			<path d="M1654.54,1593.79C1638.92,1615.56 1627.51,1649.25 1624.7,1701.11C1585.4,1688.22 1577.43,1682.4 1560.56,1659.16" />
			<path d="M1562.86,1357.21C1560.34,1401.88 1596.53,1437.53 1629.34,1478.93C1662.15,1520.34 1668.87,1543.42 1729.34,1569.86C1789.81,1596.29 1826.14,1608.84 1877.15,1605.57C1928.17,1602.29 1942.93,1578.97 1963.09,1551.54C1983.25,1524.1 2006.68,1457.11 2003.32,1416.92C1999.97,1376.73 1963.79,1329.08 1913.32,1307.25C1862.86,1285.43 1803.4,1287.38 1761.37,1270.19C1719.34,1253 1662.78,1266.57 1619.57,1279.86C1576.37,1293.14 1564.5,1328.11 1562.86,1357.21Z" />
			<path d="M1650.82,1361.94C1644.67,1392.33 1668.95,1433.72 1695.82,1461.94C1722.7,1490.16 1722.31,1501.11 1771.22,1510.57C1820.12,1520.04 1834.03,1538.11 1866.68,1538.99C1899.34,1539.87 1904.03,1536.11 1920.51,1501.49C1937,1466.87 1961.84,1442.36 1936.06,1416.53C1910.28,1390.7 1862.93,1373.17 1833.4,1352.22C1803.87,1331.28 1770.51,1317.45 1738.87,1313.64C1707.23,1309.84 1658.79,1322.59 1650.82,1361.94Z" />
			<path d="M1768.17,1383.43C1774.79,1359.33 1787.15,1348.21 1796.76,1366.72C1806.37,1385.23 1802.93,1381.32 1791.68,1385.67C1780.43,1390.01 1788.01,1392.21 1768.17,1383.43Z" />
			<path d="M1709.42,1391.14C1724.19,1378.56 1740.36,1381.51 1752.31,1397.24C1764.26,1412.96 1775.59,1429.57 1780.67,1454.76C1762.62,1472.1 1769.03,1464.57 1744.89,1448.8C1720.75,1433.04 1726.68,1418.96 1709.42,1391.14Z" />
			<path d="M1801.14,1432.15C1825.97,1430.89 1832.54,1463.45 1850.59,1436.3C1868.64,1409.15 1854.81,1402.32 1872.47,1411.25C1890.12,1420.19 1869.18,1424.48 1896.37,1429.71C1885.75,1455.44 1890.51,1481.22 1867.7,1483.76C1844.89,1486.3 1805.43,1476.39 1801.14,1432.15Z" />
		</g>
	</svg>
);