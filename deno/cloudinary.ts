import { load } from "std/dotenv/mod.ts";
import { walk } from "std/fs/walk.ts";
import { v2 as cloud } from "npm:cloudinary@1.39.0";

const { API_KEY, API_SECRET } = await load({ envPath: "deno/.env" });

if (!API_KEY || !API_SECRET) throw new Error("Missing credentials");

cloud.config({
	cloud_name: "mxdvl",
	api_key: API_KEY,
	api_secret: API_SECRET,
	secure: true,
});

const grid_size = 18;
const widths = [18, 24, 30, 36] as const;

const root = "dotcom/src/routes";

const extensions = /\.(jpg|png)$/g;

for await (const { path, name } of walk(root, { includeDirs: false, match: [extensions] })) {
	if (name === "cover.jpg") continue;
	const timestamp = new Date().getTime();

	const url = await cloud.uploader.upload_url({ shorten: true });
	const folder = path.replace(root, "dotcom")
		.replaceAll(/\/\(\w+\)\//g, "/")
		.replaceAll(/(é|è|ë)/g, "e")
		.replaceAll(/(ï)/g, "i")
		.replaceAll(/(ü|ù)/g, "u")
		.replaceAll(/(ç)/g, "c")
		.replace(name, "");

	const overwrite = true;
	const use_filename = true;
	const unique_filename = false;

	const transforms = cloud.utils.generate_transformation_string({
		eager: widths.map((width) => ({ width: width * grid_size })),
		eager_async: true,
	});
	console.log(transforms);

	const signature = cloud.utils.api_sign_request(
		{ timestamp, overwrite, folder, use_filename, unique_filename },
		API_SECRET,
	);
	const body = new FormData();
	body.append("timestamp", String(timestamp));
	body.append("overwrite", String(overwrite));
	body.append("use_filename", String(use_filename));
	body.append("unique_filename", String(unique_filename));
	body.append("folder", folder);
	body.append("signature", signature);
	body.append(
		"file",
		`https://raw.githubusercontent.com/mxdvl/mxdvl/main/${path}`,
	);
	body.append("api_key", API_KEY);

	const response = await fetch(url, { method: "POST", body });
	console.log(await response.text());
}
