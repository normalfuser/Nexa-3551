import { v4 as uuidv4 } from "uuid";
import logger from "./utils/logger/logger";
import fs from "node:fs";
import path from "node:path";
import { parse as parseIni } from "ini";

// Load config
const configPath = path.join("src", "config", "config.ini");
let configRaw: string;
try {
  configRaw = fs.readFileSync(configPath, "utf-8");
} catch {
  throw new Error(`Cannot read config file at "${configPath}". Make sure src/config/config.ini exists.`);
}
const config = parseIni(configRaw);

const MatchmakerPort = parseInt(config.Network?.MatchmakerPort || "5555");
const LanIP = config.Network?.LanIP || "192.168.16.102";

function generateId(): string {
  return uuidv4().replace(/-/g, "");
}

const matchmakerServer = Bun.serve({
  hostname: "0.0.0.0",
  port: MatchmakerPort,
  fetch(req, server) {
    const success = server.upgrade(req);
    if (success) return undefined;
    return new Response("Matchmaker WebSocket server", { status: 200 });
  },
  websocket: {
    async open(ws) {
      logger.backend(`[Matchmaker] Client connected`);

      const ticketId = generateId();
      const matchId = generateId();
      const sessionId = generateId();

      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

      // 1. Connecting
      ws.send(JSON.stringify({
        payload: { state: "Connecting" },
        name: "StatusUpdate",
      }));

      await delay(500);

      // 2. Waiting
      ws.send(JSON.stringify({
        payload: {
          totalPlayers: 1,
          connectedPlayers: 1,
          state: "Waiting",
        },
        name: "StatusUpdate",
      }));

      await delay(500);

      // 3. Queued
      ws.send(JSON.stringify({
        payload: {
          ticketId: ticketId,
          queuedPlayers: 0,
          estimatedWaitSec: 0,
          status: {},
          state: "Queued",
        },
        name: "StatusUpdate",
      }));

      await delay(500);

      // 4. SessionAssignment
      ws.send(JSON.stringify({
        payload: {
          matchId: matchId,
          state: "SessionAssignment",
        },
        name: "StatusUpdate",
      }));

      await delay(500);

      // 5. Play - tells Fortnite to query the session endpoint
      ws.send(JSON.stringify({
        payload: {
          matchId: matchId,
          sessionId: sessionId,
          joinDelaySec: 1,
        },
        name: "Play",
      }));
    },
    message(_ws, _message) {
      // Matchmaker does not need to handle incoming messages
    },
    close(_ws) {
      logger.backend(`[Matchmaker] Client disconnected`);
    },
  },
});

logger.backend(`Matchmaker WebSocket started on ws://0.0.0.0:${MatchmakerPort}`);
logger.backend(`Matchmaker accessible at ws://${LanIP}:${MatchmakerPort}`);

export default matchmakerServer;
