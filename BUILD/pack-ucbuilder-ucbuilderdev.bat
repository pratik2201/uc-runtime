@echo off
cd /d "%~dp0"

REM --- CLEAN old local packages ---
if exist "ucbuilder\node_modules\ucbuilder-devtools" (
    rmdir /s /q "ucbuilder\node_modules\ucbuilder-devtools"
)

if exist "ucbuilder-devtools\node_modules\ucbuilder" (
    rmdir /s /q "ucbuilder-devtools\node_modules\ucbuilder"
)

REM --- ucbuilder-devtools ---
cd ucbuilder-devtools
call npm run rebuild 
call npm i
call npm pack

REM --- ucbuilder ---
cd ../ucbuilder
call npm run build 
call npm i
call npm pack

REM --- sharepnl-middleLib ---
cd ../sharepnl-middleLib
call npm run rebuild 
call npm pack
