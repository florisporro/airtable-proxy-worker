const methods = {
	list: "GET",
	create: "POST",
	read: "GET",
	update: "PATCH",
	delete: "DELETE",
};

export const getRequestUrl = (config, routing) => {
	const { airtableApiUrl, airtableApiVersion } = config;

	const url = [];

	url.push(airtableApiUrl);
	url.push("/" + airtableApiVersion);
	url.push("/" + routing.route.baseId);
	url.push("/" + routing.route.tableId);

	if (routing.id) url.push("/" + routing.id);

	if (routing.params && Object.entries(routing.params).length > 0) {
		let params = new URLSearchParams(routing.params);
		url.push("?" + params.toString());
	}

	return url.join("");
};

const findId = async (config, routing) => {
	if (routing.route.method === "list") return;
	if (routing.route.method === "create") return;
	if (routing.id === undefined) return;

	// If the route has an idField defined, and the method is not 'list' or 'create'
	// we'll need to find the Airtable ID by doing a list request with a filter.
	// To do this we make use of the filterByFormula query param.
	const newRouting = {
		route: routing.route,
		method: "list",
		params: {
			filterByFormula: `{${routing.route.idField}}="${routing.id}"`,
		},
	};

	try {
		const { json } = await airtableRequest(config, newRouting);
		return json.records[0].id;
	} catch (error) {
		// console.error(error);
		return undefined;
	}
};

export const airtableRequest = async (config, routing, requestBody) => {
	// In-case of a create, update or delete we absolutely must know the Airtable record ID,
	// and the only way to get it is to first do a 'list' fetch with the appropriate filter set.
	if (routing.route.idField !== undefined && routing.id !== undefined && routing.method !== "read") {
		const id = await findId(config, routing);
		if (!id) return undefined;
		routing.id = id;
	}

	// On a read request however, it's enough to do a list request with the appropriate filter set
	if (routing.route.idField !== undefined && routing.id !== undefined && routing.method === "read") {
		routing.params = {
			filterByFormula: `FIND("${routing.id}", {${routing.route.idField}})`,
		}
		routing.id = undefined;
	}

	const url = getRequestUrl(config, routing);
	console.log(`Making Airtable request to URL ${url}`);

	// Set the caching rules object
	// See also: https://developers.cloudflare.com/workers/learning/how-the-cache-works/
	const cf = {
		cacheTtl: config.cloudflareCacheTime,
		cacheEverything: true,
	};

	const fetchOptions = {
		// Only if our config cacheTime property is set, pass the cf object
		cf: config.cloudflareCacheTime !== undefined ? cf : undefined,
		headers: {
			Authorization: `Bearer ${config.airtableApiKey}`,
			"Content-type": "application/json",
		},
		method: methods[routing.method],
		body: requestBody ? requestBody : undefined,
	};

	const response = await fetch(url, fetchOptions);
	const json = await response.json();

	if (routing.method === "read") {
		if (json.records.length === 0) {
			return { response: undefined, json: undefined };
		}
	}

	return { response, json };
};
