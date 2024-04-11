import { getRouting } from "./routing.js";
import { config, routes } from "../config.js";
import { airtableRequest } from "./airtable.js";
import { filterResponse } from "./filter.js";
import { encryptResponse } from "./encrypt.js";

export async function handleRequest(event) {
	const headers = new Headers();
	headers.set('Access-Control-Allow-Origin', "*")

	try {
		const { request } = event;
		const routing = getRouting(request, routes);
		const { route, method, id, params } = routing;

		// If there was no route matched in our routes table, return 404
		if (route === undefined) {
			return new Response("Not found", {
				status: 404,
				statusText: "That route was not found on this API",
				headers
			});
		}

		console.log(`Received ${method} request on ${route.path}`);
		const routeMethod = route.methods[method];

		// If the route was a match, but the method is not allowed on that route
		if (routeMethod === undefined) {
			return new Response("Method Not Allowed", {
				status: 405,
				headers,
				statusText: `Method "${method}" not allowed on the ${route.name
					} resource`,
			});
		}

		try {
			// Make our request to Airtable
			const { response, json } = await airtableRequest(config, routing, request.body);

			if (response === undefined) {
				return new Response("Not found", {
					status: 404,
					statusText: "That resource was not found",
					headers
				});
			}

			let responseBody = { ...json };

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

			const encryptedResponseBody = await encryptResponse(filteredResponseBody, routeMethod.encryptKeyField);

			// Copy all the original headers from the response into our new headers
			// for (const kv of response.headers.entries()) {
			// 	headers.append(kv[0], kv[1]);
			// }

			// Override the browser TTL with our value
			headers.set("Cache-Control", "max-age=" + config.browserTTL);

			return new Response(JSON.stringify(encryptedResponseBody), {
				status: response.status,
				statusText: response.statusText,
				headers: headers,
			});
		} catch (error) {
			console.error(error);
			return new Response(error, {
				status: 400,
				statusText: "Bad Request",
				headers
			});
		}
	} catch (error) {
		console.error(error);
		return new Response(error, {
			status: 500,
			statusText: "Internal Server Error",
			headers
		});
	}
}
