const fs = require("fs")
const path = require("path")

const getAllFiles = function(dirPath, arrayOfFiles=[], excludes=[]) {
	const files = fs.readdirSync(dirPath)

	files.forEach(fileName => {
		const filePath = dirPath + "/" + fileName;

		if( excludes.map(exclude => fileName.match(exclude) != null).indexOf(true) === -1 ) {
			if (fs.statSync(filePath).isDirectory()) {
				arrayOfFiles = getAllFiles(dirPath + "/" + fileName, arrayOfFiles, excludes)
			} else {
				arrayOfFiles.push(path.join(filePath))
			}
		}
	})

	return arrayOfFiles
}

const allFiles = getAllFiles(__dirname, [], [/node_modules/, /^\..+/]);
const urls = allFiles.map(filePath => filePath.replace(__dirname, "https://target-on-device-decisioning-dev.akamaized.net/target-perf-site"));

// https://control.akamai.com/apps/fast-purge/#/ccu-main
fs.writeFileSync(`${__dirname}/purgethese.txt`, urls.join("\n"));


