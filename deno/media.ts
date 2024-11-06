import { copy, ensureDir } from "jsr:@std/fs";
import { dirname, fromFileUrl, resolve } from "jsr:@std/path";

const dir = dirname(fromFileUrl(import.meta.url));

const media = resolve(dir, "..", "build", "media");

await ensureDir(media);

await copy(resolve(dir, "media"), media, { overwrite: true });
