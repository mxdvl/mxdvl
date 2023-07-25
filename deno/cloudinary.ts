import { load } from "std/dotenv/mod.ts";
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

console.log(cloud.uploader.upload_url({ sign_url: true }));
console.log(
	cloud.utils.generate_transformation_string({
		eager: widths.map((width) => ({ width: width * grid_size })),
		eager_async: true,
	}),
);
console.log(cloud.uploader.upload_url({ shorten: true }));
console.log(cloud.utils.api_sign_request({}, API_SECRET));

// await fetch(new URL());

await cloud.uploader.upload("./dotcom/src/routes/(main)/travaux/émergences/plaine.jpg", {
	overwrite: false,
});
