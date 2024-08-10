import { copy } from "jsr:@std/fs/copy";

await copy(new URL("../assets", import.meta.url), new URL("../static", import.meta.url), {
	overwrite: true,
});
