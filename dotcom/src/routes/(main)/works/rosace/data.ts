export interface Point {
	x: number;
	y: number;
}

export interface Pattern {
	id: string;
	count: number;
	mirror: boolean;
	position: Point;
	d: string;
}
