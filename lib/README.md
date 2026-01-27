# ReadonlyDate

Immutable date wrapper that exposes only UTC getter methods—no setters, no timezone confusion.

> **Note**: This is a temporary patch to ensure immutability when working with dates. For new projects, prefer the [Temporal API](https://tc39.es/proposal-temporal/docs/) which provides proper immutable date/time handling built into the language.

## Why?

When working with dates across timezones, it's easy to introduce bugs through:

- Accidental mutations via setter methods
- Timezone-dependent getters that vary by location
- Inconsistent date handling in distributed systems

ReadonlyDate solves this by providing a strict subset of the Date API.

## Usage

```js
import { ReadonlyDate } from "./lib/readonly-date.js";

// Constructor accepts:
// 1. A timestamp in milliseconds
const date1 = new ReadonlyDate(1706358896789);

// 2. Year, month, and day (UTC)
const date2 = new ReadonlyDate(2024, 0, 27); // January 27, 2024

// ✓ UTC getters work
date2.getUTCFullYear(); // 2024
date2.getUTCMonth(); // 0 (January)
date2.getUTCDate(); // 27
date2.getTime(); // 1706313600000

// ✓ String conversions
date2.toISOString(); // "2024-01-27T00:00:00.000Z"
date2.toUTCString(); // "Sat, 27 Jan 2024 00:00:00 GMT"

// ✗ No setters exist
date2.setUTCFullYear; // undefined (property doesn't exist)
date2.setTime; // undefined

// ✗ No local timezone methods
date2.getFullYear; // undefined (property doesn't exist)
date2.getMonth; // undefined
```

## API

All methods mirror the standard Date API but restricted to UTC operations:

**Time components:**

- `getUTCFullYear()` → year (4 digits)
- `getUTCMonth()` → month (0-11, where 0 = January)
- `getUTCDate()` → day of month (1-31)
- `getUTCDay()` → day of week (0-6, where 0 = Sunday)
- `getUTCHours()` → hours (0-23)
- `getUTCMinutes()` → minutes (0-59)
- `getUTCSeconds()` → seconds (0-59)
- `getUTCMilliseconds()` → milliseconds (0-999)

**Timestamps & conversions:**

- `getTime()` → milliseconds since Unix epoch
- `valueOf()` → same as `getTime()`
- `toISOString()` → ISO 8601 string (YYYY-MM-DDTHH:mm:ss.sssZ)
- `toUTCString()` → human-readable UTC string
- `toJSON()` → same as `toISOString()`

## Design

ReadonlyDate wraps a native Date in a private field, exposing only UTC methods through a minimal interface. This ensures:

- **Immutability** – no setters means dates can't change
- **Consistency** – UTC-only methods eliminate timezone ambiguity
- **Simplicity** – smaller API surface reduces cognitive load

Perfect for APIs, data serialization, and distributed systems where dates must remain stable and timezone-independent.
