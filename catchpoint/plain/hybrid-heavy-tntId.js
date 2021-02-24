//Step-1
open(
  "https://target-perf-site.s3.us-west-1.amazonaws.com/plain.html?dmethod=hybrid&property=heavy&ecid=false&cache=true&render=false&bandwidth=broadband"
);
setStepName("Step1-First Visit");
waitForNoRequest("5000");

runScript(
  "var atLibraryLoaded = perfStats['atLibraryLoaded'];var artifactDownloaded = perfStats['artifactDownloaded'];var decisioningFinished = perfStats['decisioningFinished'];var requestCompleted = perfStats['requestCompleted'];var offersRendered = perfStats['offersRendered'];var endToEndOffersRendered = perfStats['endToEndOffersRendered'];var endToEndOffersReady = perfStats['endToEndOffersReady'];var decisioningMethod = perfStats['decisioningMethod'];var property = perfStats['property'];var visit = perfStats['visit'];var allocationId = perfStats['allocationId'];var bandwidth = perfStats['bandwidth'];"
);

storeScriptVariable("bandwidth", "bandwidth;");
storeScriptVariable("decisioningMethod", "decisioningMethod;");
storeScriptVariable("property", "property;");
storeScriptVariable("visit", "visit;");
storeScriptVariable("allocationId", "allocationId;");
storeScriptVariable("atLibraryLoaded", "atLibraryLoaded;");
storeScriptVariable("artifactDownloaded", "artifactDownloaded;");
storeScriptVariable("decisioningFinished", "decisioningFinished;");
storeScriptVariable("requestCompleted", "requestCompleted;");
storeScriptVariable("offersRendered", "offersRendered;");
storeScriptVariable("endToEndOffersRendered", "endToEndOffersRendered;");
storeScriptVariable("endToEndOffersReady", "endToEndOffersReady;");

setTracepoint("t81723", "${var(bandwidth)}");
setTracepoint("t12125", "${var(decisioningMethod)}");
setTracepoint("t65215", "${var(property)}");
setTracepoint("t36912", "${var(visit)}");
setTracepoint("t41212", "${var(allocationId)}");
setIndicator("i54417", "${var(atLibraryLoaded)}");
setIndicator("i21234", "${var(artifactDownloaded)}");
setIndicator("i41521", "${var(decisioningFinished)}");
setIndicator("i38844", "${var(requestCompleted)}");
setIndicator("i64216", "${var(offersRendered)}");
setIndicator("i33428", "${var(endToEndOffersRendered)}");
setIndicator("i33799", "${var(endToEndOffersReady)}");

//Step-2
open(
  "https://target-perf-site.s3.us-west-1.amazonaws.com/plain.html?dmethod=hybrid&property=heavy&ecid=false&cache=true&render=false&bandwidth=broadband"
);
setStepName("Step2-Repeat Visit");
waitForNoRequest("5000");

runScript(
  "var atLibraryLoaded = perfStats['atLibraryLoaded'];var artifactDownloaded = perfStats['artifactDownloaded'];var decisioningFinished = perfStats['decisioningFinished'];var requestCompleted = perfStats['requestCompleted'];var offersRendered = perfStats['offersRendered'];var endToEndOffersRendered = perfStats['endToEndOffersRendered'];var endToEndOffersReady = perfStats['endToEndOffersReady'];var decisioningMethod = perfStats['decisioningMethod'];var property = perfStats['property'];var visit = perfStats['visit'];var allocationId = perfStats['allocationId'];var bandwidth = perfStats['bandwidth'];"
);

storeScriptVariable("bandwidth", "bandwidth;");
storeScriptVariable("decisioningMethod", "decisioningMethod;");
storeScriptVariable("property", "property;");
storeScriptVariable("visit", "visit;");
storeScriptVariable("allocationId", "allocationId;");
storeScriptVariable("atLibraryLoaded", "atLibraryLoaded;");
storeScriptVariable("artifactDownloaded", "artifactDownloaded;");
storeScriptVariable("decisioningFinished", "decisioningFinished;");
storeScriptVariable("requestCompleted", "requestCompleted;");
storeScriptVariable("offersRendered", "offersRendered;");
storeScriptVariable("endToEndOffersRendered", "endToEndOffersRendered;");
storeScriptVariable("endToEndOffersReady", "endToEndOffersReady;");

setTracepoint("t81723", "${var(bandwidth)}");
setTracepoint("t12125", "${var(decisioningMethod)}");
setTracepoint("t65215", "${var(property)}");
setTracepoint("t36912", "${var(visit)}");
setTracepoint("t41212", "${var(allocationId)}");
setIndicator("i54417", "${var(atLibraryLoaded)}");
setIndicator("i21234", "${var(artifactDownloaded)}");
setIndicator("i41521", "${var(decisioningFinished)}");
setIndicator("i38844", "${var(requestCompleted)}");
setIndicator("i64216", "${var(offersRendered)}");
setIndicator("i33428", "${var(endToEndOffersRendered)}");
setIndicator("i33799", "${var(endToEndOffersReady)}");
