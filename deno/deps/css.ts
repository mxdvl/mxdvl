import init, { transform } from "lightningcss-wasm";
import import_map from "../import-map.json" assert { type: "json" };

await init(import_map.imports["lightningcss-wasm"] + "/lightningcss_node.wasm?module");

export { transform };
