// derive string key
async function deriveKey(password) {
	const algo = {
		name: 'PBKDF2',
		hash: 'SHA-256',
		salt: new TextEncoder().encode('a-unique-salt'),
		iterations: 1000
	}
	return crypto.subtle.deriveKey(
		algo,
		await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(password),
			{
				name: algo.name
			},
			false,
			['deriveKey']
		),
		{
			name: 'AES-GCM',
			length: 256
		},
		false,
		['encrypt', 'decrypt']
	)
}

// Encrypt function
async function encrypt(text, password) {
	const algo = {
		name: 'AES-GCM',
		length: 256,
		iv: crypto.getRandomValues(new Uint8Array(12))
	}
	return {
		cipherText: await crypto.subtle.encrypt(
			algo,
			await deriveKey(password, algo.name, algo.length),
			new TextEncoder().encode(text)
		),
		iv: algo.iv
	}
}

export const encryptResponse = async (body, encryptKeyField) => {
	if (!encryptKeyField) return body;

	if (body.records !== undefined) {
		// Array of records
		for (let [index, record] of body.records.entries()) {
			let key = record.fields[encryptKeyField]
			if (!key) continue;
			const encrypted = await encrypt(JSON.stringify(record), key);
			body.records[index] = {
				encrypted: true,
				cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted.cipherText))),
				iv: btoa(String.fromCharCode(...new Uint8Array(encrypted.iv)))
			}
		}
		return body
	}

	if (body.fields !== undefined) {
		// Single item
		let key = body.fields[encryptKeyField]
		if (!key) return body
		const encrypted = await encrypt(JSON.stringify(body), key);
		return {
			encrypted: true,
			cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted.cipherText))),
			iv: btoa(String.fromCharCode(...new Uint8Array(encrypted.iv)))
		}
	}
};
