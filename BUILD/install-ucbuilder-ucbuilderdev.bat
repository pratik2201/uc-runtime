@echo off
REM Always go to the folder where this .bat file is
cd /d "%~dp0"

REM --- CLEAN old local packages ---
if exist "ucbuilder\node_modules\ucbuilder-devtools" (
    rmdir /s /q "ucbuilder\node_modules\ucbuilder-devtools"
    rmdir /s /q "ucbuilder\package-lock.json"
)

if exist "ucbuilder-devtools\node_modules\ucbuilder" (
    rmdir /s /q "ucbuilder-devtools\node_modules\ucbuilder"
    rmdir /s /q "ucbuilder-devtools\package-lock.json"
)

if exist "sharepnl\node_modules\ucbuilder-devtools" (
    rmdir /s /q "sharepnl\node_modules\ucbuilder-devtools"
)

if exist "sharepnl\node_modules\ucbuilder" (
    rmdir /s /q "sharepnl\node_modules\ucbuilder"
    rmdir /s /q "sharepnl\package-lock.json"
)



REM --- ucbuilder ---
cd ucbuilder
call npm i
call npm run rebuild 
call npm pack

REM --- ucbuilder-devtools ---
cd ../ucbuilder-devtools
call npm i
call npm run rebuild 
call npm pack


REM --- sharepnl-middleLib ---
cd ../sharepnl-middleLib
call npm run rebuild 
call npm pack


cd ../sharepnl
REM Install local tgz packages
call npm install "../ucbuilder/ucbuilder-3.0.0-beta.0.tgz"
call npm install "../ucbuilder-devtools/ucbuilder-devtools-1.0.0-bata-0.tgz"
rem call npm install "../sharepnl-middleLib/sharepnl-middle-lib-1.0.0.tgz"
REM call npm run rebuild


rem cd ../builder-test
REM Install local tgz packages
rem call npm install "../ucbuilder/ucbuilder-3.0.0-beta.0.tgz"
rem call npm install -D "../ucbuilder-devtools/ucbuilder-devtools-1.0.0-bata-0.tgz"
REM call npm run rebuild



echo.
echo ✅ All local packages installed successfully!
REM pause
