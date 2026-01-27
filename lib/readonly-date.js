/**
 * Immutable date wrapper exposing only UTC getter methods.
 *
 * ReadonlyDate provides a subset of the Date API without setters or timezone-specific methods,
 * ensuring dates remain constant and timezone-independent.
 *
 * @example
 * ```js
 * const date = new ReadonlyDate(2024, 0, 27); // year, month, day (UTC)
 * date.getUTCFullYear(); // 2024
 * date.getUTCMonth();    // 0 (January)
 * date.getTime();        // 1706313600000
 * ```
 *
 * @example Immutability
 * ```js
 * const date = new ReadonlyDate(1706356800000);
 * date.setUTCFullYear;   // undefined - no setters exist
 * date.getFullYear;      // undefined - no local timezone methods
 * ```
 */
export class ReadonlyDate {
	/** @type {Date} */
	#date;

	/**
	 * Creates a new immutable date instance.
	 * @param {number} yearOrTimestamp - Year (UTC) or timestamp in milliseconds
	 * @param {number} [month] - Month (0-11, UTC). Required if first arg is a year
	 * @param {number} [day=1] - Day of month (1-31, UTC)
	 * @example
	 * ```js
	 * new ReadonlyDate(1706356800000); // timestamp
	 * new ReadonlyDate(2024, 0, 27);   // year, month, day (UTC)
	 * ```
	 */
	constructor(yearOrTimestamp, month, day = 1) {
		if (month !== undefined) {
			// year, month, day constructor
			this.#date = new Date(Date.UTC(yearOrTimestamp, month, day));
		} else {
			// timestamp constructor
			this.#date = new Date(yearOrTimestamp);
		}
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
