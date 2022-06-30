export const getRoute = (path, routes) => {
	const route = routes.find((route) => {
		return path.indexOf(route.path) > -1;
	});

	return route;
};

export const getResourceId = (path, route) => {
	try {
		const splitPath = path.split(route.path);

		let resourceId = splitPath?.[1];

		// Remove any leading slashes
		while (resourceId.charAt(0) === "/") {
			resourceId = resourceId.substring(1);
		}

		if (resourceId.length > 0) return resourceId;
		return undefined;
	} catch (error) {
		return undefined;
	}
};

export const getMethod = (req, resourceId) => {
	const method = req?.method?.toUpperCase?.();

	if (method === "PATCH" && resourceId !== undefined) return "update";
	if (method === "DELETE" && resourceId !== undefined) return "delete";
	if (method === "GET" && resourceId !== undefined) return "read";
	if (method === "POST") return "create";
	if (method === "GET") return "list";
};

export const getRouting = (req, routes) => {
	try {
		const { pathname } = new URL(req.url);

		const route = getRoute(pathname, routes);
		const id = getResourceId(pathname, route);
		const method = getMethod(req, id);

		return {
			route,
			id,
			method,
		};
	} catch (error) {
		return {
			id: undefined,
			method: undefined,
			route: undefined,
		};
	}
};
