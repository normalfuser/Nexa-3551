import { LanIP, GameServerPort, MatchmakerPort } from "..";
import jwt from "jsonwebtoken";
import getVersion from "../utils/handlers/getVersion";
import type { Hono } from "hono";
import { v4 as uuidv4 } from "uuid";

// Store the buildUniqueId from the last matchmaking ticket request
// This is used by the session endpoint to return the correct build version
let currentBuildUniqueId = "0";

export default function (app: Hono) {
  app.get("/waitingroom/api/waitingroom", async (c) => {
    return c.json([]);
  });
  app.get("/fortnite/api/matchmaking/session/findPlayer/:id", async (c) => {
    return c.json([]);
  });

  app.get("/fortnite/api/game/v2/matchmakingservice/ticket/player/*", async (c) => {
    const bucketId: any = c.req.query("bucketId");
    const playerMatchmakingKey = c.req.query("player.option.customKey");
    const playerPlaylist = bucketId.split(":")[3];
    const playerRegion = bucketId.split(":")[2];
    const ver = getVersion(c);

    // Save the buildUniqueId from the bucketId for use in the session endpoint
    currentBuildUniqueId = bucketId.split(":")[0];

    const mmData = jwt.sign(
      {
        region: playerRegion,
        playlist: playerPlaylist,
        type: typeof playerMatchmakingKey === "string" ? "custom" : "normal",
        key: typeof playerMatchmakingKey === "string" ? playerMatchmakingKey : undefined,
        bucket: bucketId,
        version: `${ver.build}`,
      },
      "LVe51Izk03lzceNf1ZGZs0glGx5tKh7f",
    );
    var data = mmData.split(".");
    return c.json({
      serviceUrl: `ws://${LanIP}:${MatchmakerPort}`,
      ticketType: "mms-player",
      payload: data[0] + "." + data[1],
      signature: undefined,
    });
  });

  // Session endpoint - Fortnite queries this after matchmaking to know WHERE to connect
  // This is the equivalent of typing "open 192.168.16.102" in the game console
  app.get("/fortnite/api/matchmaking/session/:sessionId", async (c) => {
    const sessionId = c.req.param("sessionId");
    return c.json({
      id: sessionId,
      ownerId: uuidv4().replace(/-/g, ""),
      ownerName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-14840880",
      serverName: "[DS]fortnite-liveeugcec1c2e30ubrcore0a-14840880",
      serverAddress: LanIP,
      serverPort: GameServerPort,
      maxPublicPlayers: 220,
      openPublicPlayers: 175,
      maxPrivatePlayers: 0,
      openPrivatePlayers: 0,
      attributes: {
        REGION_s: "EU",
        GAMEMODE_s: "FORTATHENA",
        ALLOWBROADCASTING_b: true,
        SUBREGION_s: "GB",
        DCID_s: "FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880",
        tenant_s: "Fortnite",
        MATCHMAKINGPOOL_s: "Any",
        STORMSHIELDDEFENSETYPE_i: 0,
        HOTFIXVERSION_i: 0,
        PLAYLISTNAME_s: "Playlist_DefaultSolo",
        SESSIONKEY_s: uuidv4().replace(/-/g, "").toUpperCase(),
        TENANT_s: "Fortnite",
        BEACONPORT_i: 15009,
      },
      publicPlayers: [],
      privatePlayers: [],
      totalPlayers: 45,
      allowJoinInProgress: false,
      shouldAdvertise: false,
      isDedicated: false,
      usesStats: false,
      allowInvites: false,
      usesPresence: false,
      allowJoinViaPresence: true,
      allowJoinViaPresenceFriendsOnly: false,
      buildUniqueId: currentBuildUniqueId,
      lastUpdated: new Date().toISOString(),
      started: false,
    });
  });

  // Join session - must return 204 No Content (not JSON)
  app.post("/fortnite/api/matchmaking/session/:SessionId/join", async (c) => {
    return new Response(null, { status: 204 });
  });

  // Account session encryption key
  app.get("/fortnite/api/game/v2/matchmaking/account/:accountId/session/:sessionId", async (c) => {
    return c.json({
      accountId: c.req.param("accountId"),
      sessionId: c.req.param("sessionId"),
      key: "AOJEv8uTFmUh7XM2328kq9rlAzeQ5xzWzPIiyKn2s7s=",
    });
  });

  app.post("/fortnite/api/matchmaking/session/matchMakingRequest", async (c) => {
    return c.json([]);
  });
}
