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

export const airtableRequest = async (config, routing, requestBody) => {
	const url = getRequestUrl(config, routing);
	console.log(`Making Airtable request to URL ${url}`);

	// Set the caching rules object
	// See also: https://developers.cloudflare.com/workers/learning/how-the-cache-works/
	const cf = {
		cacheTtl: config.cloudflareCacheTime,
		cacheEverything: true,
	};

	const response = fetch(url, {
		// Only if our config cacheTime property is set, pass the cf object
		cf: config.cloudflareCacheTime !== undefined ? cf : undefined,
		headers: {
			Authorization: `Bearer ${config.airtableApiKey}`,
			"Content-type": "application/json",
		},
		method: methods[routing.route.method],
		body: requestBody,
	});

	return response;
};
