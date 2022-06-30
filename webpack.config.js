const config = {
	entry: "./src/index.js",
	mode: "development",
	devtool: "source-map",
	optimization: {
		minimize: false,
	},
	performance: {
		hints: false,
	},
	output: {
		path: __dirname + "/dist",
		publicPath: "dist",
		filename: "worker.js",
	},
};

module.exports = () => {
	return config;
};
