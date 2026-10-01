const assert = require("node:assert/strict");
const test = require("node:test");
const { createSystemMetricsSampler } = require("../system-metrics");

test("mesure CPU et memoire sans inventer une valeur au premier echantillon", () => {
  let cpu = { idle: 50, user: 50 };
  const system = {
    cpus: () => [{ times: cpu }],
    totalmem: () => 1000,
    freemem: () => 400,
    networkInterfaces: () => ({ ethernet: [{ family: "IPv4", internal: false, address: "192.168.1.2" }] })
  };
  const sample = createSystemMetricsSampler({ system, now: () => new Date("2026-10-01T12:00:00.000Z") });

  const first = sample();
  assert.equal(first.cpuPercent, null);
  assert.equal(first.memoryPercent, 60);
  assert.equal(first.lanAvailable, true);
  assert.equal(first.sampledAt, "2026-10-01T12:00:00.000Z");

  cpu = { idle: 80, user: 120 };
  assert.equal(sample().cpuPercent, 70);
});

test("ne confond pas une interface locale avec un LAN disponible", () => {
  const system = {
    cpus: () => [],
    totalmem: () => 0,
    freemem: () => 0,
    networkInterfaces: () => ({ loopback: [{ family: "IPv4", internal: true, address: "127.0.0.1" }] })
  };
  const result = createSystemMetricsSampler({ system })();
  assert.equal(result.cpuPercent, null);
  assert.equal(result.memoryPercent, null);
  assert.equal(result.lanAvailable, false);
});
