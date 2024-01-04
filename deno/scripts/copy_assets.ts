import { copy } from "https://deno.land/std@0.193.0/fs/copy.ts";

await copy(new URL("../assets", import.meta.url), new URL("../static", import.meta.url), {
	overwrite: true,
});
