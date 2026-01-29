/**
 * Immutable date wrapper exposing only UTC getter methods.
 *
 * ReadonlyDate provides a small subset of the Date API
 * without setters or timezone-specific methods.
 *
 * @example
 * ```js
 * const date = new ReadonlyDate(2024, 0, 27); // year, month, day (UTC)
 * date.getUTCFullYear(); // 2024
 * date.getUTCMonth();    // 0 (January)
 * date.getTime();        // 1706313600000
 * ```
 *
 * @deprecated favour the [Temporal API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
 */
export class ReadonlyDate {
	/** @type {Date} */
	#date;

	/**
	 * Creates a new immutable date instance.
	 * @param {[number] | [number, number, number]} args - Either a timestamp or a triplet of year, month and day in UTC
	 */
	constructor(...args) {
		if (args.length === 1) {
			// timestamp constructor
			this.#date = new Date(args[0]);
		} else if (args.length === 3) {
			// year, month, day constructor
			this.#date = new Date(Date.UTC(...args));
		} else {
			// Invalid argument count - create Invalid Date
			this.#date = new Date(NaN);
		}
	}

	/**
	 * Year (4 digits)
	 * @returns {number}
	 */
	getUTCFullYear() {
		return this.#date.getUTCFullYear();
	}

	/**
	 * Month (0-11)
	 * @returns {number}
	 */
	getUTCMonth() {
		return this.#date.getUTCMonth();
	}

	/**
	 * Day of month (1-31)
	 * @returns {number}
	 */
	getUTCDate() {
		return this.#date.getUTCDate();
	}

	/**
	 * Day of week (0-6)
	 * @returns {number}
	 */
	getUTCDay() {
		return this.#date.getUTCDay();
	}

	/**
	 * Hours (0-23)
	 * @returns {number}
	 */
	getUTCHours() {
		return this.#date.getUTCHours();
	}

	/**
	 * Minutes (0-59)
	 * @returns {number}
	 */
	getUTCMinutes() {
		return this.#date.getUTCMinutes();
	}

	/**
	 * Seconds (0-59)
	 * @returns {number}
	 */
	getUTCSeconds() {
		return this.#date.getUTCSeconds();
	}

	/**
	 * Milliseconds (0-999)
	 * @returns {number}
	 */
	getUTCMilliseconds() {
		return this.#date.getUTCMilliseconds();
	}

	/**
	 * ISO 8601 string representation (YYYY-MM-DDTHH:mm:ss.sssZ)
	 * @returns {string}
	 */
	toISOString() {
		return this.#date.toISOString();
	}

	/**
	 * Primitive numeric value
	 * @returns {number} timestamp in milliseconds
	 */
	valueOf() {
		return this.#date.valueOf();
	}
}
