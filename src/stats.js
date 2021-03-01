const fs = require("fs").promises;
const path = require("path");
require("dotenv").config();

const _ = require("lodash");
const prettier = require("prettier");
const Catchpoint = require("./catchpoint");

const tracepoints = [
  {
    id: 6846,
    name: "decisioningMethod",
    options: ["on-device", "server-side", "hybrid"],
  },
  {
    id: 6848,
    name: "visit",
    options: ["first", "repeat"],
  },
  {
    id: 6847,
    name: "property",
    options: ["lean", "heavy"],
  },
  {
    id: 6876,
    name: "bandwidth",
    options: ["broadband", "3G"],
  },
];

const tracepointsById = tracepoints.reduce((acc, value) => {
  acc[value.id] = value;
  return acc;
}, {});

async function run() {
  try {
    const catchpoint = await Catchpoint(
      process.env.CATCHPOINT_CLIENT_ID,
      process.env.CATCHPOINT_CLIENT_SECRET
    );

    const testData = [];

    const CHART_ODD_THREEG = { id: 226856, bandwidth: "3G" };
    const CHART_ODD_BROADBAND = { id: 226854, bandwidth: "broadband" };

    for (const chart of [CHART_ODD_BROADBAND, CHART_ODD_THREEG]) {
      const chartData = await catchpoint.getFavChart(chart.id);
      simplifyTestData(chartData.detail, chart.bandwidth, testData);
    }

    await fs.writeFile(
      path.resolve("public_html", "metrics.json"),
      prettier.format(
        JSON.stringify({
          metrics: testData,
        }),
        { parser: "json" }
      )
    );
  } catch (err) {
    console.log("ERROR", err);
  }
}

function simplifyTestData({ fields, items }, bandwidth, testData) {
  items.forEach((item) => {
    const { indicators, synthetic_metrics } = item;

    const entry = {
      bandwidth,
    };

    ["breakdown_1", "breakdown_2", "dimension"].forEach((key) => {
      const facet = item[key];

      const tp = tracepoints.find(
        (tracepoint) => tracepoint.options.indexOf(facet.name) >= 0
      );

      entry[tp.name] = facet.name;
    });

    fields.indicators.forEach(
      (indicator, idx) =>
        (entry[`${indicator.name}-${indicator.statistical.prefix}`] =
          indicators[idx])
    );

    fields.synthetic_metrics.forEach(
      (metric, idx) => (entry[`${metric.name}`] = synthetic_metrics[idx])
    );
    testData.push(entry);
  });
}

run();
