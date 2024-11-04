import { readFileSync } from "fs";
import { join } from "path";

export const getDailyStats = () => {
  const logs = readFileSync(join(process.cwd(), "combined.log"), "utf8")
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));

  const today = new Date().toISOString().split("T")[0];

  const todayLogs = logs.filter((log) => log.timestamp.startsWith(today));

  return {
    totalRequests: todayLogs.length,
    totalErrors: todayLogs.filter((log) => log.level === "error").length,
    averageCost:
      todayLogs.reduce((acc, log) => acc + (log.cost || 0), 0) /
      todayLogs.length,
    rateLimit: {
      hits: todayLogs.filter((log) => log.message?.includes("Rate limit"))
        .length,
    },
  };
};
