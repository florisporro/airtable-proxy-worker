# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Nothing yet.

### Fixed

- Updated NPM dependencies.
- Improved documentation around installation and usage.

### Removed

- Nothing yet.

## 1.0.0 - 2022-06-30

### Changed

- Configuration method, now uses config.js instead of webpack presets

### Added

- Mapping multiple Airtable bases and tables to different paths on the API
- Blacklisting and whitelisting fields accepted on the API per route and method
- Callback function to allow modification of the response data before it's returned on the API

### Fixed

- Fixed Cloudflare not properly caching the requests to Airtable
- Updated NPM dependencies

### Removed

- Travis CI scripts for automatic deployment, should be fairly easy to add back in
- Webpack build step removed

## 0.1.0 - 2018-09-08

### Fixed

- Changed `PREFIX` to `PROXY_PREFIX` to avoid variable clashes.
- Making sure request body is attached to Airtable request.

## 0.0.1 - 2018-09-08

### Added

- Initial release. Primary features:
  - Secure API key and Base ID usage for Airtable API
  - Route-based permissions
  - Automated builds with Travis-CI
