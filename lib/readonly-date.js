import { assertEquals, assertThrows } from "jsr:@std/assert";

/**
 * A readonly subset of the Date object that only exposes UTC getter methods.
 * No setters are available, making instances immutable.
 *
 * @example
 * ```js
 * const date = new ReadonlyDate("2024-01-27T12:00:00Z");
 * console.log(date.getUTCFullYear()); // 2024
 * console.log(date.getUTCMonth()); // 0 (January)
 * console.log(date.getUTCDate()); // 27
 * ```
 */
export class ReadonlyDate {
	#date;

	/**
	 * Creates a new ReadonlyDate instance
	 * @param {...any} args - Same arguments as the Date constructor
	 */
	constructor(...args) {
		this.#date = new Date(...args);
	}

	/**
	 * Returns the year (4 digits for 4-digit years) of the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCFullYear() {
		return this.#date.getUTCFullYear();
	}

	/**
	 * Returns the month (0-11) in the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCMonth() {
		return this.#date.getUTCMonth();
	}

	/**
	 * Returns the day of the month (1-31) for the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCDate() {
		return this.#date.getUTCDate();
	}

	/**
	 * Returns the day of the week (0-6) for the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCDay() {
		return this.#date.getUTCDay();
	}

	/**
	 * Returns the hours (0-23) in the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCHours() {
		return this.#date.getUTCHours();
	}

	/**
	 * Returns the minutes (0-59) in the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCMinutes() {
		return this.#date.getUTCMinutes();
	}

	/**
	 * Returns the seconds (0-59) in the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCSeconds() {
		return this.#date.getUTCSeconds();
	}

	/**
	 * Returns the milliseconds (0-999) in the specified date according to universal time.
	 * @returns {number}
	 */
	getUTCMilliseconds() {
		return this.#date.getUTCMilliseconds();
	}

	/**
	 * Returns the numeric value of the specified date as the number of milliseconds since January 1, 1970, 00:00:00 UTC.
	 * @returns {number}
	 */
	getTime() {
		return this.#date.getTime();
	}

	/**
	 * Returns a string representation of a date in the ISO 8601 Extended Format.
	 * @returns {string}
	 */
	toISOString() {
		return this.#date.toISOString();
	}

	/**
	 * Returns a string with a locality sensitive representation of the date portion of this date in UTC.
	 * @returns {string}
	 */
	toUTCString() {
		return this.#date.toUTCString();
	}

	/**
	 * Returns a string representing the specified Date object in JSON format (using toISOString()).
	 * @returns {string}
	 */
	toJSON() {
		return this.#date.toJSON();
	}

	/**
	 * Returns the primitive value of a Date object (same as getTime()).
	 * @returns {number}
	 */
	valueOf() {
		return this.#date.valueOf();
	}
}

// ========== Tests ==========

Deno.test({
	name: "ReadonlyDate - constructor and basic UTC getters",
	fn() {
		const date = new ReadonlyDate("2024-01-27T12:34:56.789Z");

		assertEquals(date.getUTCFullYear(), 2024);
		assertEquals(date.getUTCMonth(), 0); // January
		assertEquals(date.getUTCDate(), 27);
		assertEquals(date.getUTCDay(), 6); // Saturday
		assertEquals(date.getUTCHours(), 12);
		assertEquals(date.getUTCMinutes(), 34);
		assertEquals(date.getUTCSeconds(), 56);
		assertEquals(date.getUTCMilliseconds(), 789);
	},
});

Deno.test({
	name: "ReadonlyDate - getTime and valueOf",
	fn() {
		const timestamp = 1706357696789;
		const date = new ReadonlyDate(timestamp);

		assertEquals(date.getTime(), timestamp);
		assertEquals(date.valueOf(), timestamp);
		assertEquals(+date, timestamp); // Implicit conversion
	},
});

Deno.test({
	name: "ReadonlyDate - string conversions",
	fn() {
		const date = new ReadonlyDate("2024-01-27T12:34:56.789Z");

		assertEquals(date.toISOString(), "2024-01-27T12:34:56.789Z");
		assertEquals(date.toJSON(), "2024-01-27T12:34:56.789Z");
		assertEquals(date.toUTCString(), "Sat, 27 Jan 2024 12:34:56 GMT");
	},
});

Deno.test({
	name: "ReadonlyDate - no setter methods available",
	fn() {
		const date = new ReadonlyDate("2024-01-27T12:00:00Z");

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
		const date = new ReadonlyDate("2024-01-27T12:00:00Z");

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
	name: "ReadonlyDate - immutability (internal date cannot be accessed)",
	fn() {
		const date = new ReadonlyDate("2024-01-27T12:00:00Z");
		const originalTime = date.getTime();

		// Attempt to access the private field should fail
		// @ts-expect-error - accessing private field
		assertEquals(typeof date.#date, "undefined");

		// Verify the time hasn't changed
		assertEquals(date.getTime(), originalTime);
	},
});

Deno.test({
	name: "ReadonlyDate - various constructor arguments",
	async fn({ step }) {
		await step("ISO string", () => {
			const date = new ReadonlyDate("2024-12-25T00:00:00Z");
			assertEquals(date.getUTCFullYear(), 2024);
			assertEquals(date.getUTCMonth(), 11); // December
			assertEquals(date.getUTCDate(), 25);
		});

		await step("timestamp", () => {
			const timestamp = Date.UTC(2024, 0, 1);
			const date = new ReadonlyDate(timestamp);
			assertEquals(date.getUTCFullYear(), 2024);
			assertEquals(date.getUTCMonth(), 0);
			assertEquals(date.getUTCDate(), 1);
		});

		await step("individual components", () => {
			const date = new ReadonlyDate(2024, 0, 1, 12, 30, 45, 100);
			// Note: The month is 0-indexed, so 0 = January
			assertEquals(date.getUTCMonth(), 0);
		});
	},
});
