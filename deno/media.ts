import { ensureDir } from "@std/fs/ensure-dir";
import { copy } from "@std/fs/copy";

const base = import.meta.url;

const media = new URL("../build/media/", base);

await ensureDir(media);

copy(new URL("./media", base), media, { overwrite: true });
