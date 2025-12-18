const observation = {
  runtime: "edge",
  node: process.version,
  platform: process.platform,
  arch: process.arch,
  constraints: ["sandboxed-fs"],
  anomalies: []
};

console.log(JSON.stringify(observation, null, 2));
