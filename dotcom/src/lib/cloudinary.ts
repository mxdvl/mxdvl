// Import the Cloudinary class
import { Cloudinary } from "@cloudinary/url-gen";
import { Resize } from "@cloudinary/url-gen/actions/resize";

// Create your instance
const cld = new Cloudinary({
	cloud: {
		cloudName: "mxdvl",
	},
	url: {
		secure: true, // force https, set to false to force http
	},
});

export const cloud = (filepath: string, width: number) => {
	const img = cld.image("www" + filepath);
	img.resize(Resize.scale().width(width));
	img.format("auto");
	img.quality("auto:best");

	return img.toURL();
};
