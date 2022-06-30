# Airtable Proxy Cloudflare Worker

> A [Cloudflare Worker](http://developers.cloudflare.com/workers/) that allows you to make secure requests to the [Airtable API](https://airtable.com/api) from your frontend.

[![Travis Build Status](https://travis-ci.org/portable-cto/airtable-proxy-worker.png?branch=master)](https://travis-ci.org/portable-cto/airtable-proxy-worker)
[![Coverage Status](https://coveralls.io/repos/github/portable-cto/airtable-proxy-worker/badge.svg)](https://coveralls.io/github/portable-cto/airtable-proxy-worker)
[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![GitHub stars](https://img.shields.io/github/stars/portable-cto/airtable-proxy-worker.svg?style=social&label=Stars)](https://github.com/portable-cto/airtable-proxy-worker)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![](https://i.imgur.com/QW0VWpG.png)

## Features

- Keep your Airtable Base ID and API Key secret while still allowing frontend apps to access data from Airtable's API.
- 'Patch' Airtable bases, tables and views to specific routes, essentially building your own customized API layer on Airtable.
- Limit requests to specific methods and tables. For example, using this library, you can make sure that public users can only make `GET` requests to your tables.
- Automatically build and push updates to your Cloudflare Worker using [Travis-CI](https://travis-ci.org/).

## Changes in this fork

I required a more advanced and configurable version of airtable-proxy-worker for my own purposes, to be able to accomplish the following:

- Combining resources and methods from several Airtable bases into a single Cloudflare worker
- Filtering the fields returned from Airtable to the API consumer by blacklisting, whitelisting
- Allowing other data transformation with callback functions in the request handler, allowing for much more complex use-cases like validation

## Usage

### Prerequisites

- Cloudflare account with [Workers](https://www.cloudflare.com/products/cloudflare-workers/) enabled.
- An [Airtable Base ID](https://community.airtable.com/t/what-is-the-app-id-where-do-i-find-it/2984) and your [Airtable API key](https://support.airtable.com/hc/en-us/articles/219046777-How-do-I-get-my-API-key-).
- Node and Node Package Manager ([npm](https://www.npmjs.com/get-npm)).
- Familiarity with your computer's terminal/command line interface.

### Install and test

The easiest way to test this project in action is to test locally with Cloudflare's CLI wrangler:

- Clone this repo: `git clone https://github.com/portable-cto/airtable-proxy-worker.git`
- Install dependencies: `npm install`
- Create a config.js file based on the config.js.sample file.
- Run via Wrangler in development mode `npm run dev`

### Deploying on Cloudflare with Wrangler

Wrangler is by far the easiest way to deploy:

- Login on Cloudflare: `npx wrangler login`
- Initiate a wrangler.toml file: `npx wrangler init`
- Modify the file to fit your needs. For example you may want to adjust the worker name.
- Deploy on Cloudflare: `npm run deploy`

### Manually deploying on Cloudflare or testing on cloudflareworkers

You can also use Wrangler to build a worker file and you can manually upload it if you wish:

- Build the dist file: `npm run build`
- Upload the built `dist/index.js` file to [cloudflareworkers.com](https://cloudflareworkers.com/) to test your script.

## Contributing

Contributions are welcome and encouraged! When contributing to this repository, please first discuss the change you wish to make via the [issues on Github](https://github.com/portable-cto/airtable-proxy-worker/issues).

### Testing

Before you make a pull request, please add or update any relevant tests. You can run the test suite (uses [Jest](https://jestjs.io/)): `npm run test:local`

Also run [Prettier](https://prettier.io/) to ensure that code styling is consistent: `npm run prettier`.

### Pull Request Process

1. Make sure tests are running and linting passes before you submit a PR.
2. Update any relevant parts of the documentation in the `readme.md` file.
3. Update the `changelog.md` file with any new updates, breaking changes, or important notes.
4. Run the build process to make sure it passes too: `npm run build`.
5. Include a link to any relevant issues in the PR on Github. If there are problems with your PR, we will discuss them in Github before merging.

### Releases

This library uses [semantic versioning](https://semver.org/) to inform users of breaking and non-breaking changes. When a new release is ready, the following steps will be taken:

- Make sure tests still pass: `npm test`.
- Run the release script: `npm version <SEMANTIC_VERSION> && git push --tags` with the release number you want to use.

This will create a new Tag in Github.

## License

The MIT License (MIT)

Copyright (c) 2018 Portable CTO, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
