import { first } from "./1-first.js";
import { second } from "./2-second.js";
import { third } from "./3-third.js";

export const depth = () => {
	for (const element of Array.from(document.querySelectorAll("[depth]"))) {
		if (!(element instanceof HTMLElement)) continue;

		const depth = parseInt(element.getAttribute("depth") ?? "0", 10);
		switch (depth) {
			case 1: {
				element.innerText = first;
				break;
			}
			case 2: {
				element.innerText = second;
				break;
			}
			case 3: {
				element.innerText = third;
				break;
			}

			default:
				break;
		}
	}
};
