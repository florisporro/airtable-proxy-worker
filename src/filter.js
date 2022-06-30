export const filterFields = (fields, blacklist, whitelist) => {
	if (blacklist === undefined && whitelist == undefined) return fields;

	let filteredFields = {};

	if (blacklist !== undefined) {
		for (const [key, value] of Object.entries(fields)) {
			if (blacklist.includes(key)) {
				filteredFields[key] = undefined;
			} else {
				filteredFields[key] = value;
			}
		}
	}

	if (whitelist !== undefined) {
		for (const [key, value] of Object.entries(fields)) {
			if (whitelist.includes(key)) {
				filteredFields[key] = value;
			} else {
				filteredFields[key] = undefined;
			}
		}
	}

	return filteredFields;
};

export const filterResponse = (body, blacklist, whitelist) => {
	if (body.records !== undefined) {
		// LIST
		body.records.forEach((record) => {
			record.fields = filterFields(record.fields, blacklist, whitelist);
		});
		return body;
	}

	if (body.fields !== undefined) {
		// GET
		body.fields = filterFields(body.fields, blacklist, whitelist);
		return body;
	}

	// As a precaution, if neither of these cases is true, return nothing
	return undefined;
};
