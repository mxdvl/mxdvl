const { sin, cos, PI } = Math;

const tau = 2 * PI;

const dotted_arc = (radius: number, count: number) =>
	Array.from(
		{ length: count + 1 },
		(_, i) =>
			[
				sin((tau * i) / count / 2) * radius,
				cos((tau * i) / count / 2) * radius,
			] as const
	);

const arc_dots = (count: number) =>
	Array.from(
		{ length: count + 1 },
		(_, i) =>
			[sin((tau * i) / count / 2), cos((tau * i) / count / 2)] as const
	);

export const Royal_Opera_House = (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="-120 -120 240 240"
		width="600"
		height="600"
	>
		<g stroke="black" stroke-width="0.25" fill="none">
			<path
				d="M-20,0 A10,10 1 1 1 20,0 Z
    M0,0 V-20
    M0,0 L34,-34
    M0,0 L-34,-34
    "
			></path>

			{dotted_arc(24, 24).map(([cx, cy]) => (
				<circle
					cx={cx}
					cy={cy}
					fill="black"
					stroke="none"
					r="0.5"
					transform="rotate(-90)"
				/>
			))}
			<g transform="rotate(-90)">
				{arc_dots(72).map(([cx, cy]) => (
					<line x1={cx * 48} x2={cx * 50} y1={cy * 48} y2={cy * 50} />
				))}
			</g>

			<path d="M-90,6 H90"></path>

			<path
				d={Array.from(
					{ length: 24 },
					(_, i) => `M${i * 2 + 50},2v-2`
				).join("")}
			/>
			<path
				d={Array.from(
					{ length: 24 },
					(_, i) => `M${-i * 2 - 50},2v-2`
				).join("")}
			/>
		</g>
	</svg>
);
