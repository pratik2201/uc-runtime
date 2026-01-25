@echo off
REM Always go to the folder where this .bat file is
cd /d "%~dp0"

REM Now go inside sharepnl project
cd sharepnl-middleLib
call npm run rebuild  
call npm pack

cd ../sharepnl
REM Install local tgz packages
call npm install "../sharepnl-middleLib/sharepnl-middle-lib-1.0.0.tgz"
REM call npm run rebuild

echo.
echo ✅ All local packages installed successfully!
REM pause
