import * as steamworks from "steamworks.js";
import type { workshop } from "steamworks.js";

export default function main() {
	const client = steamworks.init(480);
	console.log(client.localplayer.getName())
}

// Example of using workshop types
const item: workshop.WorkshopItem | null = null;
