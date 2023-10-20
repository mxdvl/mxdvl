import { ensureDir } from "std/fs/ensure_dir.ts";
import { copy } from "std/fs/copy.ts";
import { walk } from "std/fs/walk.ts";

const match = [/\.(png|jpe?g)$/];

const base = import.meta.url;

const media = new URL("../build/media/", base);

await ensureDir(media);

for await (const { path, name } of walk(new URL("../dotcom/src", base), { includeFiles: true, match })) {
	copy(path, new URL(name, media), { overwrite: true });
}
