import { config, routes } from "../config.js";

const methods = {
	list: "GET",
	create: "POST",
	read: "GET",
	update: "PATCH",
	delete: "DELETE",
};

for (const route of routes) {
	console.log(`# ${route.name}`);
	console.log("\n");

	for (const [method, properties] of Object.entries(route.methods)) {
		let path = config.apiBaseUrl + route.path;
		if (method !== "list") {
			path += "/:id";
		}
		console.log(`## ${methods[method]} ${path}`);

		if (properties.whitelist) {
			console.log("Whitelist:" + JSON.stringify(properties.whitelist));
		}
		if (properties.blacklist) {
			console.log("Blacklist:" + JSON.stringify(properties.blacklist));
		}
	}
	console.log("\n");
}
