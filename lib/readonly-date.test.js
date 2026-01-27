import { assertEquals } from "jsr:@std/assert";
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

		assertEquals(date.getTime(), timestamp);
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
		assertEquals(date.toJSON(), "2024-01-27T12:34:56.789Z");
		assertEquals(date.toUTCString(), "Sat, 27 Jan 2024 12:34:56 GMT");
	},
});

Deno.test({
	name: "ReadonlyDate - no setter methods available",
	fn() {
		const date = new ReadonlyDate(2024, 0, 27);

		// Verify that setter methods don't exist
		assertEquals(typeof date.setUTCFullYear, "undefined");
		assertEquals(typeof date.setUTCMonth, "undefined");
		assertEquals(typeof date.setUTCDate, "undefined");
		assertEquals(typeof date.setUTCHours, "undefined");
		assertEquals(typeof date.setUTCMinutes, "undefined");
		assertEquals(typeof date.setUTCSeconds, "undefined");
		assertEquals(typeof date.setUTCMilliseconds, "undefined");
		assertEquals(typeof date.setTime, "undefined");

		// Also verify non-UTC setters don't exist
		assertEquals(typeof date.setFullYear, "undefined");
		assertEquals(typeof date.setMonth, "undefined");
		assertEquals(typeof date.setDate, "undefined");
		assertEquals(typeof date.setHours, "undefined");
		assertEquals(typeof date.setMinutes, "undefined");
		assertEquals(typeof date.setSeconds, "undefined");
		assertEquals(typeof date.setMilliseconds, "undefined");
	},
});

Deno.test({
	name: "ReadonlyDate - no non-UTC getter methods",
	fn() {
		const date = new ReadonlyDate(2024, 0, 27);

		// Verify that non-UTC getter methods don't exist
		assertEquals(typeof date.getFullYear, "undefined");
		assertEquals(typeof date.getMonth, "undefined");
		assertEquals(typeof date.getDate, "undefined");
		assertEquals(typeof date.getDay, "undefined");
		assertEquals(typeof date.getHours, "undefined");
		assertEquals(typeof date.getMinutes, "undefined");
		assertEquals(typeof date.getSeconds, "undefined");
		assertEquals(typeof date.getMilliseconds, "undefined");
		assertEquals(typeof date.getTimezoneOffset, "undefined");
	},
});

Deno.test({
	name: "ReadonlyDate - immutability (time remains constant)",
	fn() {
		const date = new ReadonlyDate(2024, 0, 27);
		const originalTime = date.getTime();

		// The date should remain constant since there are no setters
		assertEquals(date.getTime(), originalTime);
		assertEquals(date.getUTCFullYear(), 2024);
		assertEquals(date.getUTCMonth(), 0);
		assertEquals(date.getUTCDate(), 27);
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
		const timestamp = Date.UTC(2024, 0, 27, 12, 34, 56, 789);
		const date = new ReadonlyDate(timestamp);

		assertEquals(date.getUTCHours(), 12);
		assertEquals(date.getUTCMinutes(), 34);
		assertEquals(date.getUTCSeconds(), 56);
		assertEquals(date.getUTCMilliseconds(), 789);
	},
});

Deno.test({
	name: "ReadonlyDate - constructor throws on invalid argument count",
	fn() {
		// Should throw with 0 arguments
		try {
			new ReadonlyDate();
			throw new Error("Expected constructor to throw with 0 arguments");
		} catch (error) {
			assertEquals(error instanceof TypeError, true);
		}

		// Should throw with 2 arguments
		try {
			new ReadonlyDate(2024, 0);
			throw new Error("Expected constructor to throw with 2 arguments");
		} catch (error) {
			assertEquals(error instanceof TypeError, true);
		}

		// Should throw with 4 arguments
		try {
			new ReadonlyDate(2024, 0, 27, 12);
			throw new Error("Expected constructor to throw with 4 arguments");
		} catch (error) {
			assertEquals(error instanceof TypeError, true);
		}
	},
});
