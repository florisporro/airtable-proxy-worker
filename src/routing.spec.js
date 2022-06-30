import { getRoute, getResourceId, getMethod, getRouting } from "./routing.js";

const routes = [
	{
		name: "Fruits",
		path: "/api/fruits",
		methods: {
			list: {},
			read: {},
		},
	},
	{
		name: "Animals",
		path: "/animals",
		methods: {
			list: {},
			read: {},
		},
	},
];

describe("getRoute()", () => {
	it("returns undefined if route does not exist", () => {
		let result = getRoute("/api/vehicles", routes);
		expect(result).toBe(undefined);
	});

	it("returns undefined if only part of the path is a match", () => {
		let result = getRoute("/api/animals", routes);
		expect(result).toBe(undefined);
	});

	it("returns a route object when matching a path without resource ID", () => {
		let result = getRoute("/api/fruits", routes);
		expect(result.name).toBe("Fruits");
	});

	it("returns a route when matching a path with resource ID", () => {
		let result = getRoute("/api/fruits/12345", routes);
		expect(result.name).toBe("Fruits");
	});
});

describe("getResourceId()", () => {
	it("returns 12345 on /api/fruits/12345", () => {
		let result = getResourceId("/api/fruits/12345", routes[0]);
		expect(result).toBe("12345");
	});

	it("returns 12345/6789 on /api/fruits/12345/6789", () => {
		let result = getResourceId("/api/fruits/12345/6789", routes[0]);
		expect(result).toBe("12345/6789");
	});

	it("returns undefined with no resource id", () => {
		let result = getResourceId("/api/fruits", routes[0]);
		expect(result).toBe(undefined);
	});

	it("returns undefined with no resource id and trailing slash", () => {
		let result = getResourceId("/api/fruits/", routes[0]);
		expect(result).toBe(undefined);
	});

	it("returns undefined on false url", () => {
		let result = getResourceId("/api/vehicles", routes[0]);
		expect(result).toBe(undefined);
	});
});

describe("getMethod()", () => {
	it("returns list when method is GET and resourceId is not set", () => {
		let req = {
			method: "GET",
		};
		let result = getMethod(req);
		expect(result).toBe("list");
	});

	it("returns create when method is POST", () => {
		let req = {
			method: "POST",
		};
		let result = getMethod(req);
		expect(result).toBe("create");
	});

	it("returns read when method is GET and resourceId is set", () => {
		let req = {
			method: "GET",
		};
		let result = getMethod(req, "12345");
		expect(result).toBe("read");
	});

	it("returns delete when method is DELETE and resourceId is set", () => {
		let req = {
			method: "DELETE",
		};
		let result = getMethod(req, "12345");
		expect(result).toBe("delete");
	});

	it("returns undefined when method is DELETE and resourceId is not set", () => {
		let req = {
			method: "DELETE",
		};
		let result = getMethod(req);
		expect(result).toBe(undefined);
	});

	it("returns update when method is PATCH and resourceId is set", () => {
		let req = {
			method: "PATCH",
		};
		let result = getMethod(req, "12345");
		expect(result).toBe("update");
	});

	it("returns undefined when method is PATCH and resourceId is not set", () => {
		let req = {
			method: "PATCH",
		};
		let result = getMethod(req);
		expect(result).toBe(undefined);
	});

	it("returns undefined when method is not a string", () => {
		let req = {
			method: 1,
		};
		let result = getMethod(req);
		expect(result).toBe(undefined);
	});

	it("returns undefined when method is undefined", () => {
		let req = {};
		let result = getMethod(req);
		expect(result).toBe(undefined);
	});
});

describe("getRouting()", () => {
	describe("when deleting a resource", () => {
		let req = {
			url: "http://example.com/api/fruits/12345",
			method: "DELETE",
		};

		let result = getRouting(req, routes);

		it("finds the correct route", () => {
			expect(result.route.name).toBe("Fruits");
		});

		it("finds the correct method", () => {
			expect(result.method).toBe("delete");
		});

		it("finds the correct resource id", () => {
			expect(result.id).toBe("12345");
		});
	});

	describe("when adding query params", () => {
		let req = {
			url: "http://example.com/api/fruits/12345?view=567",
			method: "GET",
		};

		let result = getRouting(req, routes);

		it("finds the correct route", () => {
			expect(result.route.name).toBe("Fruits");
		});

		it("finds the correct method", () => {
			expect(result.method).toBe("read");
		});

		it("finds the correct resource id", () => {
			expect(result.id).toBe("12345");
		});

		it("returns the query params", () => {
			expect(result.params.view).toBe("567");
		});
	});

	describe("when targeting an incorrect route", () => {
		let req = {
			url: "http://example.com/api/vehicles",
			method: "DELETE",
		};

		let result = getRouting(req, routes);

		it("returns undefined", () => {
			expect(result.route).toBeFalsy();
		});
	});
});
