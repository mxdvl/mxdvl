import { serve } from "https://deno.land/std@0.167.0/http/server.ts";
const port = 8080;

await serve(
	() =>
		new Response(
			'nothing to see here until <a href="https://github.com/mxdvl/mxdvl/pull/110">mxdvl#110</a>',
			{
				status: 200,
				headers: {
					"Content-Type": "text/html",
				},
			}
		),
	{ port }
);
