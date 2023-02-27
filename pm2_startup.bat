@echo off
set deskbeePm2DIR=C:\ProgramData\pm2
IF not exist %deskbeePm2DIR% (mkdir %deskbeePm2DIR%)
SET PM2_HOME = C:\ProgramData\pm2
SET BASE_DIR=C:\ProgramData\gateway
PushD %BASE_DIR%
pm2 start "dist/main" --name deskbee-gateway


