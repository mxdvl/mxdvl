import { ensureDir } from "jsr:@std/fs/ensure-dir";
import { copy } from "jsr:@std/fs/copy";
import { walk } from "jsr:@std/fs/walk";

const match = [/\.(png|jpe?g)$/];

const base = import.meta.url;

const media = new URL("../build/media/", base);

await ensureDir(media);

copy(new URL("./media", base), media, { overwrite: true });
