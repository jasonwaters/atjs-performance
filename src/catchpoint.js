const fetch = require("node-fetch");
const sub = require("date-fns/sub");
const format = require("date-fns/format");

const CATCHPOINT_API = "https://io.catchpoint.com/ui/api";

const authHeaders = (access_token) => ({
  Authorization: `Bearer ${access_token}`,
  Accept: "application/json",
});

function getAccessToken(client_id, client_secret) {
  return fetch(`${CATCHPOINT_API}/token`, {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id,
      client_secret,
    }).toString(),
  }).then((res) => res.json());
}

function getTests(access_token, filterFunc) {
  return fetch(`${CATCHPOINT_API}/v1/tests`, {
    method: "get",
    headers: authHeaders(access_token),
  })
    .then((res) => res.json())
    .then((data) => {
      const { items } = data;
      return filterFunc ? items.filter(filterFunc) : items;
    });
}

function getTestResults(access_token, tests) {
  const endTime = new Date();
  const startTime = sub(endTime, {
    days: 30,
  });

  return fetch(`${CATCHPOINT_API}/v1/performance/aggregated`, {
    method: "post",
    headers: {
      ...authHeaders(access_token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tests: tests.map((test) => test.id).join(","),
      aggregationType: "Minutes15",
      startTime: format(startTime, "MM-dd-yyyy HH:mm"),
      endTime: format(endTime, "MM-dd-yyyy HH:mm"),
    }),
  }).then((res) => {
    return res.json();
  });
}

function getRawSingleTestData(access_token, test, tracepoints = []) {
  const endTime = new Date();
  const startTime = sub(endTime, {
    days: 7,
  });

  const url = new URL(`${CATCHPOINT_API}/v1/performance/raw/${test.id}`);

  url.search = new URLSearchParams({
    tracepoints: tracepoints.join(","),
    startTime: format(startTime, "MM-dd-yyyy HH:mm"),
    endTime: format(endTime, "MM-dd-yyyy HH:mm"),
  }).toString();

  return fetch(url.toString(), {
    method: "get",
    headers: {
      ...authHeaders(access_token),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((res) => res.json());
}

function getRawTestData(access_token, tests, tracepoints = []) {
  const endTime = new Date();
  const startTime = sub(endTime, {
    days: 7,
  });

  const url = new URL(`${CATCHPOINT_API}/v1/performance/raw}`);

  url.search = new URLSearchParams({
    tests: tests.map((test) => test.id).join(","),
    tracepoints: tracepoints.join(","),
    startTime: format(startTime, "MM-dd-yyyy HH:mm"),
    endTime: format(endTime, "MM-dd-yyyy HH:mm"),
  }).toString();

  return fetch(url.toString(), {
    method: "get",
    headers: {
      ...authHeaders(access_token),
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then((res) => res.json());
}

function getFavChart(access_token, chartId) {
  const url = new URL(
    `${CATCHPOINT_API}/v1/performance/favoriteCharts/${chartId}/data`
  );

  return fetch(url.toString(), {
    method: "get",
    headers: {
      ...authHeaders(access_token),
    },
  }).then((res) => res.json());
}

module.exports = async function Catchpoint(client_id, client_secret) {
  const { access_token } = await getAccessToken(client_id, client_secret);

  return {
    getTests: (filterFunc) => getTests(access_token, filterFunc),
    getTestResults: (tests) => getTestResults(access_token, tests),
    getRawSingleTestData: (test, tracepoints) =>
      getRawSingleTestData(access_token, test, tracepoints),
    getRawTestData: (tests, tracepoints) =>
      getRawTestData(access_token, tests, tracepoints),
    getFavChart: (chartId) => getFavChart(access_token, chartId),
  };
};
