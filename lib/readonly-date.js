import { assertEquals } from "jsr:@std/assert";

/**
 * Immutable date wrapper exposing only UTC getter methods.
 *
 * ReadonlyDate provides a subset of the Date API without setters or timezone-specific methods,
 * ensuring dates remain constant and timezone-independent.
 *
 * @example
 * ```js
 * const date = new ReadonlyDate("2024-01-27T12:00:00Z");
 * date.getUTCFullYear(); // 2024
 * date.getUTCMonth();    // 0 (January)
 * date.getTime();        // 1706356800000
 * ```
 *
 * @example Immutability
 * ```js
 * const date = new ReadonlyDate("2024-01-27T12:00:00Z");
 * date.setUTCFullYear;   // undefined - no setters exist
 * date.getFullYear;      // undefined - no local timezone methods
 * ```
 */
export class ReadonlyDate {
	#date;

	/**
	 * Creates a new immutable date instance.
	 * @param {...any} args - Arguments accepted by the Date constructor (timestamp, ISO string, or date components)
	 * @example
	 * ```js
	 * new ReadonlyDate("2024-01-27T12:00:00Z");
	 * new ReadonlyDate(1706356800000);
	 * new ReadonlyDate(2024, 0, 27);
	 * ```
	 */
	constructor(...args) {
		this.#date = new Date(...args);
	}

	/**
	 * Year (4 digits) in UTC.
	 * @returns {number} Year (e.g., 2024)
	 */
	getUTCFullYear() {
		return this.#date.getUTCFullYear();
	}

	/**
	 * Month (0-11) in UTC.
	 * @returns {number} Month index (0 = January, 11 = December)
	 */
	getUTCMonth() {
		return this.#date.getUTCMonth();
	}

	/**
	 * Day of month (1-31) in UTC.
	 * @returns {number} Day of the month
	 */
	getUTCDate() {
		return this.#date.getUTCDate();
	}

	/**
	 * Day of week (0-6) in UTC.
	 * @returns {number} Day index (0 = Sunday, 6 = Saturday)
	 */
	getUTCDay() {
		return this.#date.getUTCDay();
	}

	/**
	 * Hours (0-23) in UTC.
	 * @returns {number} Hour of the day
	 */
	getUTCHours() {
		return this.#date.getUTCHours();
	}

	/**
	 * Minutes (0-59) in UTC.
	 * @returns {number} Minute of the hour
	 */
	getUTCMinutes() {
		return this.#date.getUTCMinutes();
	}

	/**
	 * Seconds (0-59) in UTC.
	 * @returns {number} Second of the minute
	 */
	getUTCSeconds() {
		return this.#date.getUTCSeconds();
	}

	/**
	 * Milliseconds (0-999) in UTC.
	 * @returns {number} Millisecond of the second
	 */
	getUTCMilliseconds() {
		return this.#date.getUTCMilliseconds();
	}

	/**
	 * Milliseconds since Unix epoch (January 1, 1970, 00:00:00 UTC).
	 * @returns {number} Timestamp in milliseconds
	 */
	getTime() {
		return this.#date.getTime();
	}

	/**
	 * ISO 8601 string representation (YYYY-MM-DDTHH:mm:ss.sssZ).
	 * @returns {string} ISO date string
	 */
	toISOString() {
		return this.#date.toISOString();
	}

	/**
	 * Human-readable UTC string (e.g., "Mon, 27 Jan 2024 12:00:00 GMT").
	 * @returns {string} UTC date string
	 */
	toUTCString() {
		return this.#date.toUTCString();
	}

	/**
	 * JSON representation (same as toISOString()).
	 * @returns {string} ISO date string for JSON serialization
	 */
	toJSON() {
		return this.#date.toJSON();
	}

	/**
	 * Primitive numeric value (same as getTime()).
	 * @returns {number} Timestamp in milliseconds
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
	name: "ReadonlyDate - immutability (time remains constant)",
	fn() {
		const date = new ReadonlyDate("2024-01-27T12:00:00Z");
		const originalTime = date.getTime();

		// Wait a bit and verify the time hasn't changed
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
