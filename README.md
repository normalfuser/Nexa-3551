# Nexa - LAN Edition

Nexa is a Fortnite backend for all versions of Fortnite, modified for **LAN play** with [Reboot Launcher](https://github.com/Auties00/Reboot-Launcher).

> [!WARNING]
> We do not accept any liability for the misuse of this program. Epic Games strictly prohibits the presence of cosmetics not bought from the game's official item shop on private servers, as it breaches the End User License Agreement (EULA).

## 🎮 What does this do?

When you press **"Play"** in the Fortnite lobby, instead of connecting to Epic Games servers, you'll connect to your local Game Server on your LAN. Your brother (or anyone on the same network) can join too!

This is equivalent to pressing F8 and typing `open 192.168.16.102` — but automatic.

## 📋 Network Info

| Role | IP | Mask |
|---|---|---|
| **Host (you)** | `192.168.16.102` | `255.255.248.0` |
| **Client (brother)** | `192.168.16.103` | `255.255.248.0` |

## 🚀 Setup

### Prerequisites
- [Bun](https://bun.sh/docs/installation) installed
- [Reboot Launcher](https://github.com/Auties00/Reboot-Launcher/releases/) installed on both PCs
- A Fortnite build (Season 0-14) on both PCs

### 1. Install & Run the Backend (on Host PC: 192.168.16.102)

```bash
git clone https://github.com/normalfuser/Nexa-3551.git
cd Nexa-3551
bun install
bun run src/index.ts
```

You should see:
```
Nexa started on port 3551
Listening on 0.0.0.0:3551
LAN IP: 192.168.16.102
Game Server: 192.168.16.102:7777
Matchmaker WebSocket: ws://192.168.16.102:5555
```

### 2. Open Windows Firewall Ports (on Host PC — run as Administrator)

Run the included `firewall-setup.bat` as Administrator, or manually:

```batch
netsh advfirewall firewall add rule name="Nexa Backend" dir=in action=allow protocol=TCP localport=3551
netsh advfirewall firewall add rule name="Fortnite Game Server" dir=in action=allow protocol=UDP localport=7777
netsh advfirewall firewall add rule name="Fortnite Beacon" dir=in action=allow protocol=UDP localport=15009
netsh advfirewall firewall add rule name="Matchmaker WebSocket" dir=in action=allow protocol=TCP localport=5555
```

### 3. Configure Reboot Launcher

#### On YOUR PC (Host — 192.168.16.102):

| Setting | Value |
|---|---|
| **Backend Type** | `Local` |
| **Host** | `127.0.0.1` |
| **Port** | `3551` |
| **Game Server Address** | `192.168.16.102` |

#### On your BROTHER's PC (Client — 192.168.16.103):

| Setting | Value |
|---|---|
| **Backend Type** | `Remote` |
| **Host** | `192.168.16.102` |
| **Port** | `3551` |
| **Game Server Address** | `192.168.16.102` |

### 4. Play!

1. ✅ Backend is running on host PC (`bun run src/index.ts`)
2. ✅ Firewall ports are open
3. ✅ Reboot Launcher configured on both PCs
4. ✅ Start the backend in Reboot Launcher (toggle button on Backend tab)
5. ✅ Host a game server (in Reboot Launcher: Host tab → Start)
6. 🎮 Click **"Play"** in the Fortnite lobby!

Both players will connect to the Game Server at `192.168.16.102:7777`.

## ⚙️ Configuration

Edit `src/config/config.ini` to change network settings:

```ini
[Network]
LanIP=192.168.16.102
Host=0.0.0.0
BackendPort=3551
GameServerPort=7777
MatchmakerPort=5555
```

If your IP changes, just update `LanIP` and restart the backend.

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| Brother can't connect to backend | Check firewall rules. Try `ping 192.168.16.102` from brother's PC |
| "Jugar" button doesn't work | Make sure the backend is running AND the game server is hosted |
| Stuck on "Connecting..." | Verify the Game Server is running on port 7777 |
| Wrong IP | Run `ipconfig` and update `LanIP` in `config.ini` |

## Todo
- Complete MCP

## Some added stuff
- Port set to 3551
- LAN/Network support with configurable IP
- Matchmaking redirects to local Game Server
- Fixes added such as Shogun knock back

## Used API's

<img src="https://api.nitestats.com/v1/static/ns-logo.png" width="15" title="NiteStats-API"> [NiteStats API](https://nitestats.com/)

## Credits

- [Hybrid](https://github.com/HybridFNBR) for Discovery for 26.30+ and MOTD
- [Zetax](https://github.com/simplyzetax) for Error responses
- [Ducki67](https://github.com/Ducki67) for the original Nexa-3551 fork
- [Auties00](https://github.com/Auties00) for Reboot Launcher
