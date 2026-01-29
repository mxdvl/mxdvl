import { assertEquals } from "@std/assert";
import { ReadonlyDate } from "./readonly-date.js";

Deno.test({
	name: "ReadonlyDate - constructor and basic UTC getters",
	fn() {
		const date = new ReadonlyDate(2024, 0, 27);

		assertEquals(date.getUTCFullYear(), 2024);
		assertEquals(date.getUTCMonth(), 0); // January
		assertEquals(date.getUTCDate(), 27);
		assertEquals(date.getUTCDay(), 6); // Saturday
	},
});

Deno.test({
	name: "ReadonlyDate - timestamp constructor",
	fn() {
		const timestamp = 1706357696789;
		const date = new ReadonlyDate(timestamp);

		assertEquals(date.valueOf(), timestamp);
		assertEquals(+date, timestamp); // Implicit conversion
	},
});

Deno.test({
	name: "ReadonlyDate - year/month/day constructor",
	fn() {
		const date = new ReadonlyDate(2024, 0, 27);

		assertEquals(date.getUTCFullYear(), 2024);
		assertEquals(date.getUTCMonth(), 0);
		assertEquals(date.getUTCDate(), 27);
	},
});

Deno.test({
	name: "ReadonlyDate - string conversions",
	fn() {
		const timestamp = Date.UTC(2024, 0, 27, 12, 34, 56, 789);
		const date = new ReadonlyDate(timestamp);

		assertEquals(date.toISOString(), "2024-01-27T12:34:56.789Z");

	},
});

Deno.test({
	name: "ReadonlyDate - various constructor arguments",
	async fn({ step }) {
		await step("timestamp", () => {
			const timestamp = Date.UTC(2024, 0, 1);
			const date = new ReadonlyDate(timestamp);
			assertEquals(date.getUTCFullYear(), 2024);
			assertEquals(date.getUTCMonth(), 0);
			assertEquals(date.getUTCDate(), 1);
		});

		await step("year, month, day", () => {
			const date = new ReadonlyDate(2024, 11, 25);
			assertEquals(date.getUTCFullYear(), 2024);
			assertEquals(date.getUTCMonth(), 11); // December
			assertEquals(date.getUTCDate(), 25);
		});
	},
});

Deno.test({
	name: "ReadonlyDate - UTC time components",
	fn() {
		const timestamp = Date.UTC(2026, 0, 29, 12, 34, 56, 789);
		const date = new ReadonlyDate(timestamp);

		assertEquals(date.getUTCHours(), 12);
		assertEquals(date.getUTCMinutes(), 34);
		assertEquals(date.getUTCSeconds(), 56);
		assertEquals(date.getUTCMilliseconds(), 789);
	},
});

Deno.test({
	name: "ReadonlyDate - constructor creates Invalid Date with invalid argument count",
	fn() {
		// @ts-ignore -- this should fail
		const date0 = new ReadonlyDate();
		assertEquals(Number.isNaN(date0.valueOf()), true);

		// Should create Invalid Date with 2 arguments
		// @ts-ignore -- this should fail
		const date2 = new ReadonlyDate(2024, 0);
		assertEquals(Number.isNaN(date2.valueOf()), true);

		// Should create Invalid Date with 4 arguments
		// @ts-ignore -- this should fail
		const date4 = new ReadonlyDate(2024, 0, 27, 12);
		assertEquals(Number.isNaN(date4.valueOf()), true);
	},
});
