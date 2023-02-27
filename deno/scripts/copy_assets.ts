import { copy } from "std/fs/copy.ts";

await copy(new URL("../assets", import.meta.url), new URL("../static", import.meta.url), {
	overwrite: true,
});
