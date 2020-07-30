open("https://target-perf-site.netlify.app/?ondevice=true")

waitForNoRequest(5000)
runScript("var atLibraryLoaded = perfStats['atLibraryLoaded'];var artifactDownloaded = perfStats['artifactDownloaded'];var decisioningFinished = perfStats['decisioningFinished'];var requestCompleted = perfStats['requestCompleted'];var offersRendered = perfStats['offersRendered'];var endToEndOffersRendered = perfStats['endToEndOffersRendered'];")
storeScriptVariable("atLibraryLoaded","atLibraryLoaded;")
storeScriptVariable("artifactDownloaded","artifactDownloaded;")
storeScriptVariable("decisioningFinished","decisioningFinished;")
storeScriptVariable("requestCompleted","requestCompleted;")
storeScriptVariable("offersRendered","offersRendered;")
storeScriptVariable("endToEndOffersRendered","endToEndOffersRendered;")

setIndicator("i54417","${var(atLibraryLoaded)}")
setIndicator("i21234","${var(artifactDownloaded)}")
setIndicator("i41521","${var(decisioningFinished)}")
setIndicator("i38844","${var(requestCompleted)}")
setIndicator("i64216","${var(offersRendered)}")
setIndicator("i33428","${var(endToEndOffersRendered)}")

open("https://target-perf-site.netlify.app/?ondevice=true&repeatvisit=true")
waitForNoRequest(5000)
runScript("var atLibraryLoaded = perfStats['atLibraryLoaded'];var artifactDownloaded = perfStats['artifactDownloaded'];var decisioningFinished = perfStats['decisioningFinished'];var requestCompleted = perfStats['requestCompleted'];var offersRendered = perfStats['offersRendered'];var endToEndOffersRendered = perfStats['endToEndOffersRendered'];")
storeScriptVariable("atLibraryLoaded","atLibraryLoaded;")
storeScriptVariable("artifactDownloaded","artifactDownloaded;")
storeScriptVariable("decisioningFinished","decisioningFinished;")
storeScriptVariable("requestCompleted","requestCompleted;")
storeScriptVariable("offersRendered","offersRendered;")
storeScriptVariable("endToEndOffersRendered","endToEndOffersRendered;")

setIndicator("i54417","${var(atLibraryLoaded)}")
setIndicator("i21234","${var(artifactDownloaded)}")
setIndicator("i41521","${var(decisioningFinished)}")
setIndicator("i38844","${var(requestCompleted)}")
setIndicator("i64216","${var(offersRendered)}")
setIndicator("i33428","${var(endToEndOffersRendered)}")


// setTracepoint()
