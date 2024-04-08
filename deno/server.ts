import { serve } from "std/http/server.ts";
import { handler } from "./mononykus.ts";

const port = 8080;

await serve(handler, { port });
