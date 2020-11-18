require("dotenv").config();

const EdgeGrid = require("edgegrid");

const AWS = require("aws-sdk");
const fs = require("fs").promises;
const { minify } = require("terser");

const mkdirp = require("mkdirp");
const rimraf = require("rimraf");

const ARTIFACTS_FOLDER = "artifacts";
const ATJS = "public_html/target/dist/at.min.js";
let atJsContent = "";

const CDN_HOST = "https://assets.adobetarget.com";

const REQUIRED_ENV_VARS = [
  "CLIENTS",
  "AWS_BUCKET",
  "AWS_ACCESS_KEY",
  "AWS_ACCESS_KEY_SECRET",
  "AKAMAI_CLIENT_SECRET",
  "AKAMAI_HOST",
  "AKAMAI_ACCESS_TOKEN",
  "AKAMAI_CLIENT_TOKEN",
  "AKAMAI_NETWORK",
];

const CONTENT_TYPE = {
  JAVASCRIPT: "application/javascript",
  JSON: "application/json",
};

function escapeSpecial(str) {
  return str
    .replace(/[\\]/g, "\\\\")
    .replace(/[\"]/g, '\\"')
    .replace(/[\/]/g, "\\/")
    .replace(/[\b]/g, "\\b")
    .replace(/[\f]/g, "\\f")
    .replace(/[\n]/g, "\\n")
    .replace(/[\r]/g, "\\r")
    .replace(/[\t]/g, "\\t");
}

function deleteFile(filePath) {
  return new Promise((resolve, reject) => {
    rimraf(filePath, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

async function invalidateAkamaiURLs(urls) {
  if (urls.length === 0) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const eg = new EdgeGrid(
      process.env.AKAMAI_CLIENT_TOKEN,
      process.env.AKAMAI_CLIENT_SECRET,
      process.env.AKAMAI_ACCESS_TOKEN,
      process.env.AKAMAI_HOST
    );

    const body = {
      objects: [...urls],
    };

    eg.auth({
      path: `/ccu/v3/invalidate/url/${process.env.AKAMAI_NETWORK}`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    eg.send((err, response, body) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(JSON.parse(body));
    });
  });
}

async function run() {
  for (const name of REQUIRED_ENV_VARS) {
    if (!process.env.hasOwnProperty(name)) {
      console.error(`${name} must be set in the .env file.`);
      return;
    }
  }

  const clients = process.env.CLIENTS.split(",")
    .map((client) => client.trim())
    .filter((client) => client.length > 0);

  if (clients.length === 0) {
    console.error("No clients specified.");
    return;
  }

  try {
    atJsContent = await fs.readFile(ATJS).then((buffer) => buffer.toString());
  } catch (err) {
    console.error(err);
    return;
  }

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET,
  });

  const s3 = new AWS.S3({ apiVersion: "latest" });
  const bucketParams = { Bucket: process.env.AWS_BUCKET };

  const purgeURLs = [];

  for (const client of clients) {
    const s3ClientObjects = await s3
      .listObjectsV2({
        ...bucketParams,
        Prefix: `${client}/`,
      })
      .promise();

    const s3ArtifactObjects = s3ClientObjects.Contents.filter((file) =>
      file.Key.endsWith(".json")
    );

    for (const s3Object of s3ArtifactObjects) {
      const pathParts = s3Object.Key.split("/");

      const directoryPath = [
        ARTIFACTS_FOLDER,
        bucketParams.Bucket,
        ...pathParts.slice(0, pathParts.length - 1),
      ].join("/");

      await mkdirp(directoryPath);

      const artifacts = {
        "rules.json": {
          fileName: "rules.json",
          filePath: `${directoryPath}/rules.json`,
          content: "",
          contentType: CONTENT_TYPE.JSON,
          minify: false,
        },
        "rules.js": {
          fileName: "rules.js",
          filePath: `${directoryPath}/rules.js`,
          content: "",
          contentType: CONTENT_TYPE.JAVASCRIPT,
          minify: true,
        },
        "at.js": {
          fileName: "at.js",
          filePath: `${directoryPath}/at.js`,
          content: "",
          contentType: CONTENT_TYPE.JAVASCRIPT,
          minify: true,
        },
      };

      const s3ObjectContent = await s3
        .getObject({
          ...bucketParams,
          Key: s3Object.Key,
        })
        .promise();

      const jsonArtifactContent = s3ObjectContent.Body.toString();
      const jsonArtifactContent_escaped = escapeSpecial(jsonArtifactContent);

      artifacts["rules.json"].content = jsonArtifactContent;
      artifacts[
        "rules.js"
      ].content = `window.artifactPayload = window.targetGlobalSettings["artifactPayload"] = JSON.parse("${jsonArtifactContent_escaped}");`;

      artifacts[
        "at.js"
      ].content = `window.artifactPayload = window.targetGlobalSettings["artifactPayload"] = JSON.parse("${jsonArtifactContent_escaped}");${atJsContent}`;

      for (const artifact of Object.values(artifacts)) {
        await deleteFile(artifact.filePath);

        let artifactContents = artifact.content;

        if (artifact.minify) {
          const minified = await minify(artifact.content);
          artifactContents = minified.code;
        }

        if (artifact.fileName !== "rules.json") {
          const uploadParams = {
            ...bucketParams,
            Key: [
              ...pathParts.slice(0, pathParts.length - 1),
              artifact.fileName,
            ].join("/"),
            Body: Buffer.from(artifact.content),
            CacheControl: "max-age=1800",
            ContentType: artifact.contentType,
            ACL: "public-read",
          };

          await s3.upload(uploadParams).promise();

          purgeURLs.push(
            [
              CDN_HOST,
              ...pathParts.slice(0, pathParts.length - 1),
              artifact.fileName,
            ].join("/")
          );
        }

        await fs.writeFile(artifact.filePath, artifactContents);
      }
    }
  }

  await invalidateAkamaiURLs(purgeURLs);
}

run();
