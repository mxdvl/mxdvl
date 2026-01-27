# ReadonlyDate

Immutable date wrapper that exposes only UTC getter methods—no setters, no timezone confusion.

## Why?

When working with dates across timezones, it's easy to introduce bugs through:

- Accidental mutations via setter methods
- Timezone-dependent getters that vary by location
- Inconsistent date handling in distributed systems

ReadonlyDate solves this by providing a strict subset of the Date API.

## Usage

```js
import { ReadonlyDate } from "./lib/readonly-date.js";

const date = new ReadonlyDate("2024-01-27T12:34:56.789Z");

// ✓ UTC getters work
date.getUTCFullYear(); // 2024
date.getUTCMonth(); // 0 (January)
date.getUTCDate(); // 27
date.getUTCHours(); // 12
date.getTime(); // 1706358896789

// ✓ String conversions
date.toISOString(); // "2024-01-27T12:34:56.789Z"
date.toUTCString(); // "Sat, 27 Jan 2024 12:34:56 GMT"

// ✗ No setters exist
date.setUTCFullYear; // undefined (property doesn't exist)
date.setTime; // undefined

// ✗ No local timezone methods
date.getFullYear; // undefined (property doesn't exist)
date.getMonth; // undefined
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
