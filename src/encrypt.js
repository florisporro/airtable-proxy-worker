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

	let key;

	if (body.records !== undefined) {
		// LIST
		key = body.records[0].fields[encryptKeyField];
	}

	if (body.fields !== undefined) {
		// GET
		key = body.fields[encryptKeyField]
	}

	// If key is undefined or empty string, return body without modification
	if (key === undefined || key === "") return body;

	const encrypted = await encrypt(JSON.stringify(body), key)

	return {
		encrypted: true,
		// cipherText: String.fromCharCode.apply(null, new Uint8Array(encrypted.cipherText)),
		cipherText: btoa(String.fromCharCode(...new Uint8Array(encrypted.cipherText))),
		// cipherText: encrypted.cipherText.toString('utf8'),
		iv: btoa(String.fromCharCode(...new Uint8Array(encrypted.iv)))
	}
};