import { filterFields, filterResponse } from "./filter.js";

const record = {
	fields: {
		name: "Hello World",
		description: "This is a record",
		secretvalue: "ssssshhhhh",
		secretvalue2: "ssssshhhhh",
		secretvalue3: "ssssshhhhh",
	},
};

const response = {
	records: [
		{
			...record,
		},
	],
};

describe("filterFields()", () => {
	describe("doing nothing", () => {
		it("returns all the fields", () => {
			const result = filterFields(record.fields);
			expect(result.name).toBe("Hello World");
			expect(result.description).toBe("This is a record");
			expect(result.secretvalue).toBe("ssssshhhhh");
		});

		it("does not remove whitelisted properties", () => {
			const result = filterFields(record.fields, [], ["name", "description"]);
			expect(result.name).toBe("Hello World");
		});
	});

	describe("whitelisting", () => {
		it("removes none whitelisted properties", () => {
			const result = filterFields(record.fields, [], ["name", "description"]);
			expect(result.secretvalue).toBe(undefined);
		});

		it("does not remove whitelisted properties", () => {
			const result = filterFields(record.fields, [], ["name", "description"]);
			expect(result.name).toBe("Hello World");
		});
	});

	describe("blacklisting", () => {
		const result = filterFields(record.fields, ["secretvalue"]);
		expect(result.secretvalue).toBe(undefined);
	});

	it("does not remove none blacklisted properties", () => {
		const result = filterFields(record.fields, ["secretvalue"]);
		expect(result.name).toBe("Hello World");
	});
});

describe("filterResponse()", () => {
	describe("whitelisting", () => {
		it("removes none whitelisted properties", () => {
			const result = filterResponse(response, [], ["name", "description"]);
			expect(result.records[0].fields.secretvalue).toBe(undefined);
		});

		it("does not remove whitelisted properties", () => {
			const result = filterResponse(response, [], ["name", "description"]);
			expect(result.records[0].fields.name).toBe("Hello World");
		});
	});

	describe("blacklisting", () => {
		const result = filterResponse(response, ["secretvalue"]);

		expect(result.records[0].fields.secretvalue).toBe(undefined);
	});

	it("does not remove none blacklisted properties", () => {
		const result = filterResponse(response, ["secretvalue"]);
		expect(result.records[0].fields.name).toBe("Hello World");
	});
});
