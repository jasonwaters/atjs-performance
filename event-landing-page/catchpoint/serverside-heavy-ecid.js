//Step-1
open("https://target-perf-site.netlify.app/?ondevice=false&property=heavy&ecid=true&repeatvisit=false&bandwidth=broadband");
setStepName("Step1-First Visit")
waitForElementPresent("//*[@id='action_insert_15960604422991312']", "30000");

runScript("var atLibraryLoaded = perfStats['atLibraryLoaded'];var artifactDownloaded = perfStats['artifactDownloaded'];var decisioningFinished = perfStats['decisioningFinished'];var requestCompleted = perfStats['requestCompleted'];var offersRendered = perfStats['offersRendered'];var endToEndOffersRendered = perfStats['endToEndOffersRendered'];var decisioningMethod = perfStats['decisioningMethod'];var property = perfStats['property'];var visit = perfStats['visit'];var allocationId = perfStats['allocationId'];var bandwidth = perfStats['bandwidth'];")

storeScriptVariable("bandwidth","bandwidth;")
storeScriptVariable("decisioningMethod","decisioningMethod;")
storeScriptVariable("property","property;")
storeScriptVariable("visit","visit;")
storeScriptVariable("allocationId","allocationId;")
storeScriptVariable("atLibraryLoaded","atLibraryLoaded;")
storeScriptVariable("artifactDownloaded","artifactDownloaded;")
storeScriptVariable("decisioningFinished","decisioningFinished;")
storeScriptVariable("requestCompleted","requestCompleted;")
storeScriptVariable("offersRendered","offersRendered;")
storeScriptVariable("endToEndOffersRendered","endToEndOffersRendered;")

setTracepoint("t81723","${var(bandwidth)}")
setTracepoint("t12125","${var(decisioningMethod)}")
setTracepoint("t65215","${var(property)}")
setTracepoint("t36912","${var(visit)}")
setTracepoint("t41212","${var(allocationId)}")
setIndicator("i54417","${var(atLibraryLoaded)}")
setIndicator("i21234","${var(artifactDownloaded)}")
setIndicator("i41521","${var(decisioningFinished)}")
setIndicator("i38844","${var(requestCompleted)}")
setIndicator("i64216","${var(offersRendered)}")
setIndicator("i33428","${var(endToEndOffersRendered)}")

//Step-2
open("https://target-perf-site.netlify.app/?ondevice=false&property=heavy&ecid=true&repeatvisit=true&bandwidth=broadband");
setStepName("Step2-Repeat Visit")
waitForElementPresent("//*[@id='action_insert_15960604422991312']", "30000");

runScript("var atLibraryLoaded = perfStats['atLibraryLoaded'];var artifactDownloaded = perfStats['artifactDownloaded'];var decisioningFinished = perfStats['decisioningFinished'];var requestCompleted = perfStats['requestCompleted'];var offersRendered = perfStats['offersRendered'];var endToEndOffersRendered = perfStats['endToEndOffersRendered'];var decisioningMethod = perfStats['decisioningMethod'];var property = perfStats['property'];var visit = perfStats['visit'];var allocationId = perfStats['allocationId'];var bandwidth = perfStats['bandwidth'];")

storeScriptVariable("bandwidth","bandwidth;")
storeScriptVariable("decisioningMethod","decisioningMethod;")
storeScriptVariable("property","property;")
storeScriptVariable("visit","visit;")
storeScriptVariable("allocationId","allocationId;")
storeScriptVariable("atLibraryLoaded","atLibraryLoaded;")
storeScriptVariable("artifactDownloaded","artifactDownloaded;")
storeScriptVariable("decisioningFinished","decisioningFinished;")
storeScriptVariable("requestCompleted","requestCompleted;")
storeScriptVariable("offersRendered","offersRendered;")
storeScriptVariable("endToEndOffersRendered","endToEndOffersRendered;")

setTracepoint("t81723","${var(bandwidth)}")
setTracepoint("t12125","${var(decisioningMethod)}")
setTracepoint("t65215","${var(property)}")
setTracepoint("t36912","${var(visit)}")
setTracepoint("t41212","${var(allocationId)}")
setIndicator("i54417","${var(atLibraryLoaded)}")
setIndicator("i21234","${var(artifactDownloaded)}")
setIndicator("i41521","${var(decisioningFinished)}")
setIndicator("i38844","${var(requestCompleted)}")
setIndicator("i64216","${var(offersRendered)}")
setIndicator("i33428","${var(endToEndOffersRendered)}")
