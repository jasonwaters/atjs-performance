Performance Options for the Target Web SDK Alpha
================================================

There are a few options to try when using the Target Web SDK (at.js) which can impact performance.  Ideally you should try each option and measure performance in a real world use case in a staging environment.


## How to test

Try each performance option and observe and measure performance in each case.  The most important thing to observe is the time-to-target-offers-rendered.  In other words, how long does it take from page load until the target offers are rendered on the page?  This should be measured programmatically if possible, but you can also measure perceived performance in the browser. For example, if you rely on at.js `pageLoad` with [body hiding](https://experienceleague.adobe.com/docs/target/using/implement-target/client-side/at-js/manage-flicker-with-atjs.html?lang=en#how-at-js-manages-flicker), is there a noticeable improvement in flicker time?  If you rely on making ad-hoc `getOffers` calls, you can also measure the time it takes to get a response in each option.

Other factors to consider when testing these various performance options:

**First or repeat View.**

The first time a page is loaded, at.js and (if on-device decisioning is enabled) an artifact are downloaded for the first time.  But on subsequent page loads, both at.js and the artifact are cached.  Test both scenarios.

**Bandwidth**

Connection speed is a factor for on-device decisioning.  Especially depending on the size of the decisioning artifact.  If you can test under varying connection speeds it will give you a better picture of how the experience may vary.

**Decisioning Artifact Size**
The decisioning artifact size will vary depending on the number of activities you have.  But the more activities, the larger the size -- which could impact performance.  You may want to use target properties to limit which activities are part of an artifact and reduce file size.


## Performance Options

For each option, please use [this build of at.js](https://raw.githubusercontent.com/jasonwaters/atjs-performance/master/public_html/target/dist/at.min.js) unless specified otherwise.

### Server-side Decisioning

This is the default decisioning method in at.js, which makes a request to target edge servers.  There is no specific configuration necessary, but you should take care not to override the `decisioningMethod` in `window.targetGlobalSettings`.

This option is important because it is the base case to compare the other performance options against.  On-device decisioning aims to outperform server-side decisioning.  In our internal synthetic testing, it does outperform it in many instances.  But measuring it in a real-world use case is even more valuable.

#### How to use

Download at.js and include it on a html page like so.

```html
<head>
    <script>
        window.targetGlobalSettings = {
          decisioningMethod: "server-side",
        };
    </script>
    <script src="at.js"></script>
</head>
```

### On-device Decisioning - JSON Artifact

When configured for on-device decisioning, at.js downloads a JSON artifact and caches it in the browser.

#### How to use

Download at.js and include it on a html page like so.

```html
<head>
    <script>
        window.targetGlobalSettings = {
          decisioningMethod: "on-device",
        };
    </script>
    <script src="at.js"></script>
</head>
```

### On-device Decisioning - Cached Artifact (localStorage)

When configured for on-device decisioning with the `cacheArtifact` flag set to `true`, at.js downloads a JSON artifact and caches it using [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).  localStorage has proven to be faster than relying on the browser's native caching mechanism.  So repeat visits, after the artifact is cached, benefit from this. 

#### How to use

Download at.js and include it on a html page like so.

```html
<head>
    <script>
        window.targetGlobalSettings = {
          decisioningMethod: "on-device",
          cacheArtifact: true
        };
    </script>
    <script src="at.js"></script>
</head>
```


### On-device Decisioning - Dynamic Script Include

When configured for on-device decisioning with the dynamic script include option, at.js injects a `<script>` tag into the document header which loads a JavaScript file.  That javascript file simply contains the decisioning artifact within it which is provided to at.js.  It is cached in the browser.  This is beneficial because browsers give special treatment to javascript files and cache them better than other file formats.

#### How to use

Download at.js and include it on a html page like so.

```html
<head>
    <script>
        window.targetGlobalSettings = {
          decisioningMethod: "on-device",
          artifactFormat: "js"
        };
    </script>
    <script src="at.js"></script>
</head>
```

### On-device Decisioning -  Bundle

This option groups at.js and the decisioning artifact together in a single file.  This is beneficial because only one file needs to be requested and downloaded. But it means that, rather than downloading and hosting at.js on your own server or CDN, you need to include at.js from Adobe's CDN.
 
#### How to use

Include at.js on a html page loading it from `assets.adobetarget.com`.  You will need to assemble an url based on the use case you desire.  The pattern of the url is: `https://assets.adobetarget.com/${clientId}/production/v1/${propertyToken}/at.js`.  If you do not have a property token it can be omitted like so: `https://assets.adobetarget.com/${clientId}/production/v1/at.js`.

##### Without property token

This example assumes a client id of `targettesting`.

```html
<head>
    <script>
        window.targetGlobalSettings = {
          decisioningMethod: "on-device"
        };
    </script>
    <script src="https://assets.adobetarget.com/targettesting/production/v1/at.js"></script>
</head>
```


##### With property token

This example assumes a client id of `targettesting` and a property token of `be92ac4c-e72f-9f82-2a80-2c211ea86578`.

```html
<head>
    <script>
        window.targetGlobalSettings = {
          decisioningMethod: "on-device"
        };
    </script>
    <script src="https://assets.adobetarget.com/targettesting/production/v1/be92ac4c-e72f-9f82-2a80-2c211ea86578/at.js"></script>
</head>
```
