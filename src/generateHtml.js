const fs = require("fs");

const args = process.argv.slice(2);
let numLines = 100;

if(args.length > 0) {
	numLines = parseInt(args[0]);
}

function randomString(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

let fileContents = "<div>\n";

for(let i=0;i<numLines;i++) {
	fileContents+= `\t<p>${randomString(440)}</p>\n`;
}

fileContents += "</div>";

fs.writeFileSync(`${__dirname}/scratch.html`, fileContents);
