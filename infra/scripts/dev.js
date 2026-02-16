const { execSync, spawn } = require("node:child_process");

execSync("npm run services:up", { stdio: "inherit" });
execSync("npm run services:wait:database", { stdio: "inherit" });
execSync("npm run migrate:up", { stdio: "inherit" });

const next = spawn("npm", ["exec", "next", "dev"], { stdio: "inherit" });

const cleanup = () => {
  next.kill();
  execSync("npm run services:stop", { stdio: "inherit" });
  process.exit(0);
};

process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("SIGHUP", cleanup);