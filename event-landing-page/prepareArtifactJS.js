const fs = require("fs");

var at_property = {
	"lean": "be92ac4c-e72f-9f82-2a80-2c211ea86578",
	"heavy": "693de2cd-ac92-d2c7-59fc-a3c0f2bce646",
	"real": "bf77db72-3ab6-64ce-3bc5-6208be2f09c1"
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
	const stringified = escapeSpecial(JSON.stringify(require(`./target/artifacts/${property}/rules.json`)));
	fs.writeFileSync(`./target/artifacts/${property}/rules.txt`, stringified);
	fs.writeFileSync(`./target/artifacts/${property}/rules.js`, `window.artifactPayload = window.targetGlobalSettings["artifactPayload"] = JSON.parse("${stringified}");`);
});


