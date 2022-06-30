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
		publicPath: "dist",
		filename: "worker.js",
	},
};

export default () => {
	return config;
};
