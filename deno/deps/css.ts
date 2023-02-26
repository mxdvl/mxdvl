import init, { transform } from "lightningcss-wasm";
await init("https://esm.sh/v107/*lightningcss-wasm@1.19.0/lightningcss_node.wasm")

export { transform };
