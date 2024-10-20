import { handler } from "./mononykus.ts";

const port = 8080;

Deno.serve({ port }, handler);
