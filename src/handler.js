import { getRouting } from "./routing.js";
import { config, routes } from "../config.js";

export async function handleRequest(event) {
	const { request } = event;
	const { route, method, id } = getRouting(request, routes);

	if (route === undefined) {
		return new Response("Not found", {
			status: 404,
			statusText: "That route was not found on this API",
		});
	}

	if (route.methods[method] === undefined) {
		return new Response("Method Not Allowed", {
			status: 405,
			statusText: `Method "${method}" not allowed on the ${
				route.name
			} resource`,
		});
	}

	return new Response(JSON.stringify({ route, method, id }), {
		status: 200,
		statusText: `We are developing :)`,
	});

	// try {
	// 	const response = await fetch(target.airtableRequestUrl, {
	// 		headers: {
	// 			Authorization: `Bearer ${config.airtableApiKey}`,
	// 			"Content-type": "application/json",
	// 		},
	// 		method: method,
	// 		body: req.body,
	// 	});

	// 	const body = await response.body;

	// 	const headers = new Headers();
	// 	for (const kv of response.headers.entries()) {
	// 		headers.append(kv[0], kv[1]);
	// 	}
	// 	headers.set("Cache-Control", "max-age=" + config.cacheTime);

	// 	return new Response(body, {
	// 		status: response.status,
	// 		statusText: response.statusText,
	// 		headers: headers,
	// 	});
	// } catch (e) {
	// 	console.error(e);

	// 	return new Response("Bad Request", {
	// 		status: 400,
	// 		statusText: "Bad Request",
	// 	});
	// }
}
