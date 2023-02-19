import init, { transform as untyped_transform } from "https://unpkg.com/lightningcss-wasm@1.14.0/index.js";

import type { transform as transform_function } from "https://esm.sh/lightningcss-wasm@1.19.0";

/**
 * Why are we declaring this here?
 *
 * - esm.sh has d.ts, but no wasm
 * - unpkg has wasm, but no d.ts
 */
const transform: typeof transform_function = (options) => untyped_transform(options);

await init();

export { transform };
