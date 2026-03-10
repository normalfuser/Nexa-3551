@echo off
echo ============================================
echo  Nexa LAN - Firewall Setup
echo  Run this as Administrator!
echo ============================================
echo.

echo Adding firewall rules...

netsh advfirewall firewall add rule name="Nexa Backend (TCP 3551)" dir=in action=allow protocol=TCP localport=3551
netsh advfirewall firewall add rule name="Fortnite Game Server (UDP 7777)" dir=in action=allow protocol=UDP localport=7777
netsh advfirewall firewall add rule name="Fortnite Beacon (UDP 15009)" dir=in action=allow protocol=UDP localport=15009
netsh advfirewall firewall add rule name="Matchmaker WebSocket (TCP 5555)" dir=in action=allow protocol=TCP localport=5555

echo.
echo ============================================
echo  Done! Firewall rules added successfully.
echo  Your brother can now connect to your PC.
echo ============================================
pause
