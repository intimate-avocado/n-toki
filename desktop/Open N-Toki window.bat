@echo off
rem Opens N-Toki in its own clean window (no browser bars).
rem Keep this file inside the n-toki folder (it opens ..\index.html), or edit the path below to the live site.
start "" msedge --app="file:///%~dp0..\index.html" --window-size=520,900
