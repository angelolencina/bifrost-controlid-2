@echo off

SET PM2_HOME = C:\deskbee-gateway\.pm2
SET BASE_DIR=C:\ProgramData\gateway
PushD %BASE_DIR%
pm2 start "dist/main" --name deskbee-gateway


