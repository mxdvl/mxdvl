import { qr } from "npm:headless-qr@1";
import { JSX } from "npm:preact/jsx-runtime";

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

export function Lines() {
	return (
		<path
			fill="none"
			stroke="green"
			transform="scale(0.25)"
			d={[
				"M0,1H4",
				"M0,3H4",
				"M1,0V4",
				"M3,0V4",
			].join(" ")}
		/>
	);
}

export function Spiral() {
	return (
		<path
			fill="none"
			stroke="green"
			transform="scale(0.125)"
			d={[
				"M7,8",
				"H0",
				"V1",
				"H7",
				"V7",
				"H1",
				"V2",
				"H6",
				"V6",
				"H2",
				"V3",
				"H5",
				"V5",
				"H3",
				"V4",
				"H4",
			].join(" ")}
		/>
	);
}

export function Cross() {
	return (
		<path
			fill="none"
			stroke="green"
			transform="scale(0.333333)"
			d={[
				"M1,0",
				"A2,2 0,0,0 3,2",
				"A1,1 0,0,0 2,3",
				"A2,2 0,0,0 0,1",
				"A1,1 0,0,0 1,0",
				"M2,0",
				"A1,1 0,0,0 3,1",
				"A2,2 0,0,0 1,3",
				"A1,1 0,0,0 0,2",
				"A2,2 0,0,0 2,0",
			].join(" ")}
		/>
	);
}

export function TripleCross() {
	return (
		<path
			fill="none"
			stroke="green"
			transform="scale(0.25)"
			d={[
				"M1,0",
				"A3,3 0,0,0 4,3",
				"A1,1 0,0,0 3,4",
				"A3,3 0,0,0 0,1",
				"A1,1 0,0,0 1,0",
				"M3,0",
				"A1,1 0,0,0 4,1",
				"A3,3 0,0,0 1,4",
				"A1,1 0,0,0 0,3",
				"A3,3 0,0,0 3,0",
				"M2,0",
				"A2,2 0,0,0 4,2",
				"A2,2 0,0,0 2,4",
				"A2,2 0,0,0 0,2",
				"A2,2 0,0,0 2,0",
			].join(" ")}
		/>
	);
}

export function Pattern() {
	return (
		<path
			fill="none"
			stroke="green"
			transform="scale(0.125)"
			stroke-width={0.75}
			d={[
				"M0,4",
				"H2V5H1V8",
				"H2V6H3V5H3V4",
				"H3V3H1V1H2V2H4V3",
				"H8V2H6V2H5V1H3",
				"L3,0",
				"M6,1H7V2",
				"M8,2V1",
				"M3,8",
				"V7H4V8H5V6H4",
				"V5H4V4H5V5",
				"H6V7H6V8H8",
				"V7H7V6H8V5H7V4",
				"L8,4",
				"M5,4H6",
			].join(" ")}
		/>
	);
}

export function Token({
	position,
	x = 0,
	y = 0,
	children,
}: {
	position: number;
	x: number;
	y: number;
	children: JSX.Element;
}) {
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
			<QR input={input} x={4} y={28}>
				{children}
			</QR>
			{/* <text y={55} fontSize={6}>{input}</text> */}
		</g>
	);
}

export function QR({
	input,
	x = 0,
	y = 0,
	children,
}: {
	input: string;
	x?: number;
	y?: number;
	children: JSX.Element;
}) {
	const positions = qr(input, { correction: "H" }).flatMap((row, x) =>
		row.flatMap((col, y) => (col ? [{ x, y }] : []))
	);

	return (
		<g transform={`translate(${x - 0.5} ${y - 0.5})`}>
			{positions.map(({ x, y }) => (
				<g key={[x, y].join(",")} transform={`translate(${x} ${y})`}>
					{children}
				</g>
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
					].join(" ")}
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
					].join(" ")}
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
					].join(" ")}
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
					].join(" ")}
				/>
			);
		case "7":
			return (
				<path
					d={[
						`M${x},${y}`,
						"h4",
						"l-3,8",
					].join(" ")}
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
					].join(" ")}
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
					].join(" ")}
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
					`a${size / 8},${size / 8} 0 0 1 0,${-size / 4}`,
					`a${size / 10},${size / 10} 0 0 1 ${size / 5},0`,
					`M0,${-0.5 * size}`,
					`a${size / 2},${size / 2} 0 0 1 0,${size}`,
					`a${size / 2},${size / 2} 0 0 1 0,${-size}`,
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
