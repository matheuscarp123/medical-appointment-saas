@echo off
setlocal enabledelayedexpansion

:: Create backup directory with timestamp
set "timestamp=%date:~-4,4%%date:~-7,2%%date:~-10,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "timestamp=!timestamp: =0!"
set "backup_dir=medical-app-backup_%timestamp%"

echo Creating backup directory: %backup_dir%
mkdir "%backup_dir%"

:: Copy root files
echo Copying root files...
copy "package.json" "%backup_dir%\"
copy "package-lock.json" "%backup_dir%\"
copy "docker-compose.yml" "%backup_dir%\"
copy "docker-compose.dev.yml" "%backup_dir%\"
copy "README.md" "%backup_dir%\"
copy ".gitignore" "%backup_dir%\"
copy ".prettierrc" "%backup_dir%\"
copy ".eslintrc.json" "%backup_dir%\"
copy "firebase.json" "%backup_dir%\"
copy "firestore.rules" "%backup_dir%\"
copy "firestore.indexes.json" "%backup_dir%\"
copy ".firebaserc" "%backup_dir%\"

:: Copy frontend
echo Copying frontend...
mkdir "%backup_dir%\frontend"
xcopy "frontend\src" "%backup_dir%\frontend\src\" /E /I /H
xcopy "frontend\public" "%backup_dir%\frontend\public\" /E /I /H
copy "frontend\package.json" "%backup_dir%\frontend\"
copy "frontend\tsconfig.json" "%backup_dir%\frontend\"
copy "frontend\webpack.config.js" "%backup_dir%\frontend\"
copy "frontend\Dockerfile" "%backup_dir%\frontend\"
copy "frontend\Dockerfile.dev" "%backup_dir%\frontend\"
copy "frontend\nginx.conf" "%backup_dir%\frontend\"

:: Copy backend
echo Copying backend...
mkdir "%backup_dir%\backend"
xcopy "backend\src" "%backup_dir%\backend\src\" /E /I /H
copy "backend\package.json" "%backup_dir%\backend\"
copy "backend\tsconfig.json" "%backup_dir%\backend\"

:: Copy functions
echo Copying functions...
mkdir "%backup_dir%\functions"
xcopy "functions\src" "%backup_dir%\functions\src\" /E /I /H
copy "functions\package.json" "%backup_dir%\functions\"

echo Backup completed successfully!
echo Backup location: %backup_dir%
pause 