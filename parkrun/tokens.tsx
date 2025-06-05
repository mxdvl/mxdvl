import { qr } from "npm:headless-qr@1";

export function Square() {
	return (
		<path
			fill="none"
			stroke="green"
			transform="scale(0.5)"
			d={[
				"M0,0L2,2",
				"M0,2L2,0",
				"M0,0",
				"A1,1 0,0,0 2,0",
				"A1,1 0,0,0 2,2",
				"A1,1 0,0,0 0,2",
				"A1,1 0,0,0 0,0",
			].join(" ")}
		/>
	);
}

export function Token({ position, x = 0, y = 0 }: { position: number; x: number; y: number }) {
	const input = `P${String(position).padStart(3, "0")}`;
	const [first, second, third, fourth] = input;
	return (
		<g transform={`translate(${x} ${y})`}>
			<path
				stroke="red"
				d={[
					"M0,6",
					"A6,6 0 0 1 6,0",
					"H22",
					"A6,6 0 0 1 28,6",
					"V52",
					"A1,1 0 0 1 27,53",
					"H1",
					"A1,1 0 0 1 0,52",
					"Z",
				].join(" ")}
			/>
			<circle stroke="red" r={3} cx={6} cy={6} />
			<g stroke="blue">
				<Logo size={6} x={22} y={6} />
				<Letter char={first ?? "P"} x={3} y={15} />
				<Letter char={second ?? "0"} x={9} y={15} />
				<Letter char={third ?? "0"} x={15} y={15} />
				<Letter char={fourth ?? "0"} x={21} y={15} />
			</g>
			<QR input={input} x={4} y={28} />
			{/* <text y={55} fontSize={6}>{input}</text> */}
		</g>
	);
}

function QR({ input, x = 0, y = 0 }: { input: string; x?: number; y?: number }) {
	const positions = qr(input, { correction: "H" })
		.flatMap((row, x) => row.flatMap((col, y) => col ? [{ x, y }] : []));

	return (
		<g transform={`translate(${x - 0.5} ${y - 0.5})`}>
			{positions.map(({ x, y }) => (
				<use
					key={[x, y].join(",")}
					x={x}
					y={y}
					href="#square"
				/>
			))}
		</g>
	);
}

function Letter({ char, x, y }: { char: string; x: number; y: number }) {
	switch (char) {
		case "P":
			return (
				<path
					d={[
						`M ${x},${y + 8}`,
						"v -8",
						"h 2",
						corner(2, 2),
						"v 0.5",
						corner(-2, 2),
						"h -2",
					].join(" ")}
				/>
			);
		case "0":
			return (
				<path
					d={[
						`M${x},${y + 2}`,
						corner(2, -2),
						corner(2, 2),
						"v 4",
						corner(-2, 2),
						corner(-2, -2),
						"Z",
					].join(" ")}
				/>
			);
		case "1":
			return (
				<path
					d={[
						`M${x},${y + 1}`,
						"c 1,0 2,-1 2,-1",
						"v8",
						"m-2,0",
						"h4",
					].join(" ")}
				/>
			);
		case "2":
			return (
				<path
					d={[
						`M${x},${y + 2}`,
						"c 0,-1 .5,-2 2,-2",
						"s 2,1 2,2",
						"c 0,4 -4,1 -4,6",
						"h4",
						// "a2,2 0 0 0 -2,2",
						// "v2",
					].join(" ")}
				/>
			);
		case "3":
			return (
				<path
					d={[
						`M${x},${y + 2}`,
						"c 0,-1 .5,-2 2,-2",
						"s 2,1 2,2",
						"c 0,0 0,2 -2,2",
						// "h-1",
						// "m1,0",
						"c 2,0 2,1 2,2",
						"c 0,1 -.5,2 -2,2",
						"s -2,-1 -2,-2",
					].join(
						" ",
					)}
				/>
			);
		case "4":
			return (
				<path
					d={[
						`M${x + 1},${y}`,
						"c 0,2 -1,4.5 -1,4.5",
						"h 4",
						"m 0,-4.5",
						"v 8",
					].join(
						" ",
					)}
				/>
			);
		case "5":
			return (
				<path
					d={[
						`M${x + 4},${y}`,
						"h -4",
						"v 3.5",
						"h 1",
						corner(3, 2),
						"v .5",
						corner(-2, 2),
						corner(-2, -2),
					].join(
						" ",
					)}
				/>
			);
		case "6":
			return (
				<path
					d={[
						`M${x},${y + 5.2}`,
						corner(2, -1.7),
						corner(2, 2),
						"v .5",
						corner(-2, 2),
						corner(-2, -2),
						"v -4",
						corner(2, -2),
						corner(2, 2),
					].join(
						" ",
					)}
				/>
			);
		case "7":
			return (
				<path
					d={[
						`M${x},${y}`,
						"h4",
						"l-3,8",
					].join(
						" ",
					)}
				/>
			);
		case "8":
			return (
				<path
					d={[
						`M${x + 2},${y + 3.7}`,
						corner(-2, -1.7),
						corner(2, -2),
						corner(2, 2),
						corner(-2, 1.7),

						corner(2, 2),
						"v .3",
						corner(-2, 2),
						corner(-2, -2),
						"v -.3",
						corner(2, -2),
					].join(
						" ",
					)}
				/>
			);
		case "9":
			return (
				<path
					d={[
						`M${x + 4},${y + 2.3}`,
						corner(-2, 1.7),
						corner(-2, -2),
						corner(2, -2),
						corner(2, 2),
						"v 4",
						corner(-2, 2),
						corner(-2, -1.7),
					].join(
						" ",
					)}
				/>
			);
		default:
			return null;
	}
}

function Logo({ x, y, size }: { x: number; y: number; size: number }) {
	return (
		<g transform={`translate(${x} ${y})`}>
			<path
				d={[
					// readable
					`M0,${-0.1 * size}`,
					`v${0.4 * size}`,
					`m0,-${0.1 * size}`,
					`a${0.1 * size},${0.1 * size} 0 0 1 ${0.1 * size},-${0.1 * size}`,
					`m${-0.2 * size},0`,
					`a${size / 99},${size / 99} 0 0 1 0,${-0.25 * size}`,
					`a${size / 99},${size / 99} 0 0 1 ${0.2 * size},0`,
					`M0,${-0.5 * size}`,
					`a${size / 99},${size / 99} 0 0 1 0,${size}`,
					`a${size / 99},${size / 99} 0 0 1 0,${-size}`,
				].join(" ")}
			/>
		</g>
	);
}

function corner(dx: number, dy: number, direction: "cw" | "ccw" = "cw") {
	const y = 3 / 4;
	const x = 2 / 3;
	switch (direction) {
		case "cw": {
			return Math.sign(dx) === Math.sign(dy)
				? `c ${dx * x},0 ${dx},${dy * (1 - y)} ${dx},${dy}`
				: `c 0,${dy * y} ${dx * (1 - x)},${dy} ${dx},${dy}`;
		}
		case "ccw": {
			return `l${dx},${dy}`;
		}
	}
}
