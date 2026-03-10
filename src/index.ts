import { Hono } from "hono";
import path from "node:path";
import fs from "node:fs";
import { loadRoutes } from "./utils/startup/loadRoutes";
import { Nexa } from "./utils/handlers/errors";
import logger from "./utils/logger/logger";
import { cors } from "hono/cors";
import { parse as parseIni } from "ini";

// Load config from config.ini
const configPath = path.join("src", "config", "config.ini");
let configRaw: string;
try {
  configRaw = fs.readFileSync(configPath, "utf-8");
} catch {
  throw new Error(`Cannot read config file at "${configPath}". Make sure src/config/config.ini exists.`);
}
const config = parseIni(configRaw);

// Network settings from config.ini
export const LanIP = config.Network?.LanIP || "192.168.16.102";
export const GameServerPort = parseInt(config.Network?.GameServerPort || "7777");
export const MatchmakerPort = parseInt(config.Network?.MatchmakerPort || "5555");
const PortConfig = parseInt(config.Network?.BackendPort || "3551");
const HostConfig = config.Network?.Host || "0.0.0.0";

const app = new Hono({ strict: false });

app.use("*", cors());

app.notFound((c) => c.json(Nexa.basic.notFound, 404));

app.use(async (c, next) => {
  if (c.req.path === "/images/icons/gear.png" || c.req.path === "/favicon.ico") await next();
  else {
    await next();

    logger.backend(`${c.req.path} | ${c.req.method} | Status ${c.res.status}`);
  }
});

await loadRoutes(path.join("src", "routes"), app);

logger.backend(`Nexa started on port ${PortConfig}`);
logger.backend(`Listening on ${HostConfig}:${PortConfig}`);
logger.backend(`LAN IP: ${LanIP}`);
logger.backend(`Game Server: ${LanIP}:${GameServerPort}`);
logger.backend(`Matchmaker WebSocket: ws://${LanIP}:${MatchmakerPort}`);

export default {
  hostname: HostConfig,
  port: PortConfig,
  fetch: app.fetch,
}
