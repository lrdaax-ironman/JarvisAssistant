const os = require("node:os");

function cpuTotals(cpus) {
  return (Array.isArray(cpus) ? cpus : []).reduce((totals, cpu) => {
    const times = cpu && cpu.times ? cpu.times : {};
    const values = Object.values(times).map(Number);
    totals.total += values.reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
    totals.idle += Number(times.idle) || 0;
    return totals;
  }, { total: 0, idle: 0 });
}

function hasLanAddress(interfaces) {
  return Object.values(interfaces || {}).some((entries) => (entries || []).some((entry) => (
    !entry.internal && Boolean(entry.address) && (entry.family === "IPv4" || entry.family === 4)
  )));
}

function createSystemMetricsSampler({ system = os, now = () => new Date() } = {}) {
  let previousCpu = null;

  return function sample() {
    const currentCpu = cpuTotals(system.cpus());
    const totalDelta = previousCpu ? currentCpu.total - previousCpu.total : 0;
    const idleDelta = previousCpu ? currentCpu.idle - previousCpu.idle : 0;
    const cpuPercent = totalDelta > 0
      ? Math.max(0, Math.min(100, Math.round((1 - idleDelta / totalDelta) * 100)))
      : null;
    previousCpu = currentCpu;

    const totalMemory = Number(system.totalmem());
    const freeMemory = Number(system.freemem());
    const memoryPercent = totalMemory > 0 && Number.isFinite(freeMemory)
      ? Math.max(0, Math.min(100, Math.round((1 - freeMemory / totalMemory) * 100)))
      : null;

    return {
      ok: true,
      cpuPercent,
      memoryPercent,
      lanAvailable: hasLanAddress(system.networkInterfaces()),
      sampledAt: now().toISOString()
    };
  };
}

module.exports = { createSystemMetricsSampler };
