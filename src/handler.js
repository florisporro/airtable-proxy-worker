import { getRouting } from "./routing.js";
import { config, routes } from "../config.js";
import { airtableRequest } from "./airtable.js";
import { filterResponse } from "./filter.js";

export async function handleRequest(event) {
	try {
		const { request } = event;
		const routing = getRouting(request, routes);
		const { route, method, id, params } = routing;
		const routeMethod = route.methods[method];

		// If there was no route matched in our routes table, return 404
		if (route === undefined) {
			return new Response("Not found", {
				status: 404,
				statusText: "That route was not found on this API",
			});
		}

		// If the route was a match, but the method is not allowed on that route
		if (routeMethod === undefined) {
			return new Response("Method Not Allowed", {
				status: 405,
				statusText: `Method "${method}" not allowed on the ${
					route.name
				} resource`,
			});
		}

		try {
			// Make our request to Airtable
			const response = await airtableRequest(config, routing, request.body);
			const originalBody = await response.json();

			let responseBody = { ...originalBody };

			// Call the before Filter callback, if it is set
			if (typeof routeMethod.beforeFilter === "function") {
				responseBody = routeMethod.beforeFilter(responseBody);
			}

			// Filter our response body with whitelist & blacklist
			const filteredResponseBody = filterResponse(
				responseBody,
				routeMethod.blacklist,
				routeMethod.whitelist
			);

			// Create new headers object
			const headers = new Headers();

			// Copy all the original headers from the response into our new headers
			for (const kv of response.headers.entries()) {
				headers.append(kv[0], kv[1]);
			}

			// Override the browser TTL with our value
			headers.set("Cache-Control", "max-age=" + config.browserTTL);

			return new Response(JSON.stringify(filteredResponseBody), {
				status: response.status,
				statusText: response.statusText,
				headers: headers,
			});
		} catch (error) {
			console.error(error);
			return new Response(error, {
				status: 400,
				statusText: "Bad Request",
			});
		}
	} catch (error) {
		console.error(error);
		return new Response(error, {
			status: 500,
			statusText: "Internal Server Error",
		});
	}
}
