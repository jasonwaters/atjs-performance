const path = require("path");
require("dotenv").config({ path: path.resolve("../", ".env") });

const _ = require("lodash");
const percentile = require("stats-percentile");
const Catchpoint = require("./catchpoint");

const tracepoints = [
  {
    id: 6846,
    name: "decisioningMethod",
  },
  {
    id: 6848,
    name: "visit",
  },
  {
    id: 6847,
    name: "property",
  },
  {
    id: 6876,
    name: "bandwidth",
  },
];

const tracepointsById = tracepoints.reduce((acc, value) => {
  acc[value.id] = value;
  return acc;
}, {});

const tracepointsByName = tracepoints.reduce((acc, value) => {
  acc[value.name] = value;
  return acc;
}, {});

async function run() {
  const catchpoint = await Catchpoint(
    process.env.CATCHPOINT_CLIENT_ID,
    process.env.CATCHPOINT_CLIENT_SECRET
  );

  const tests = await catchpoint.getTests(
    (test) =>
      test.product_id === 17928 &&
      test.status.name === "Active" &&
      test.type.name === "Web Transactional"
  );
  const broadbandTests = tests.filter((test) =>
    test.name.toLowerCase().includes("broadband")
  );

  const slowTests = tests.filter((test) =>
    test.name.toLowerCase().includes("3g")
  );

  const testData = [];

  //get raw test data for each test
  const results = await catchpoint.getRawSingleTestData(
    broadbandTests[0],
    tracepoints.map((tracepoint) => tracepoint.id)
  );

  simplifyTestData(results.detail, testData);

  //summarize data
  debugger;
}

function simplifyTestData({ fields, items }, testData) {
  items.forEach((item) => {
    const { tracepoint, indicators } = item;

    const entry = {
      date: item.dimension.name,
      location: _.get(item, "breakdown_2.name", ""),
      property: tracepoint[tracepointsByName.property.id][0].values[0],
      visit: tracepoint[tracepointsByName.visit.id][0].values[0],
      decisioningMethod:
        tracepoint[tracepointsByName.decisioningMethod.id][0].values[0],
      bandwidth: tracepoint[tracepointsByName.bandwidth.id][0].values[0],
    };

    fields.indicators.forEach(
      (indicator, idx) => (entry[indicator.name] = indicators[idx])
    );
    testData.push(entry);
  });
}

run();
