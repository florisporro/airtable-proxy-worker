import { getRequestUrl } from "./airtable.js";

const routing = {
	route: {
		name: "Fruits",
		path: "/api/fruits",
		baseId: "appysXfGe2",
		tableId: "tblGyTm4",
		methods: {
			list: {},
			read: {},
		},
	},
};

const config = {
	airtableApiUrl: "https://api.airtable.com",
	airtableApiVersion: "v0",
};

describe("getRequestUrl()", () => {
	describe("with no id set", () => {
		it("returns the right url", () => {
			let result = getRequestUrl(config, routing);
			expect(result).toBe("https://api.airtable.com/v0/appysXfGe2/tblGyTm4");
		});
	});

	describe("with an id set", () => {
		it("returns the right url", () => {
			let result = getRequestUrl(config, {
				route: routing.route,
				id: "12345",
			});
			expect(result).toBe(
				"https://api.airtable.com/v0/appysXfGe2/tblGyTm4/12345"
			);
		});
	});

	describe("with an id and params set", () => {
		it("returns the right url", () => {
			let result = getRequestUrl(config, {
				route: routing.route,
				id: "12345",
				params: {
					hello: "there",
				},
			});
			expect(result).toBe(
				"https://api.airtable.com/v0/appysXfGe2/tblGyTm4/12345?hello=there"
			);
		});
	});
});
