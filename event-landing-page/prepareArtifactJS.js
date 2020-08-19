const fs = require("fs");

var at_property = {
	"lean": "be92ac4c-e72f-9f82-2a80-2c211ea86578",
	"heavy": "693de2cd-ac92-d2c7-59fc-a3c0f2bce646"
}

function escapeSpecial(str) {
	return str
		.replace(/[\\]/g, '\\\\')
		.replace(/[\"]/g, '\\\"')
		.replace(/[\/]/g, '\\/')
		.replace(/[\b]/g, '\\b')
		.replace(/[\f]/g, '\\f')
		.replace(/[\n]/g, '\\n')
		.replace(/[\r]/g, '\\r')
		.replace(/[\t]/g, '\\t');
}


Object.values(at_property).forEach(property => {
	const stringified = escapeSpecial(JSON.stringify(require(`./targetartifacts/${property}/rules.json`)));
	fs.writeFileSync(`./targetartifacts/${property}/rules.txt`, stringified);
	fs.writeFileSync(`./targetartifacts/${property}/rules.js`, `window.artifactPayload = window.targetGlobalSettings["artifactPayload"] = JSON.parse("${stringified}");`);
});


