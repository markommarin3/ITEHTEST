@echo off
title Auto Rent - Pokretanje aplikacije
cd /d "%~dp0"

echo.
echo ========================================
echo    AUTO RENT - Pokretanje aplikacije
echo ========================================
echo.

REM --- 1. Provera Docker-a ---
echo [1/5] Provera da li je Docker instaliran...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo   GRESKA: Docker nije instaliran!
    echo   Preuzmi sa: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)
echo   OK: Docker je instaliran.

REM --- 2. Provera da li Docker radi ---
echo [2/5] Provera da li Docker Desktop radi...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo   GRESKA: Docker Desktop nije pokrenut!
    echo   Pokreni Docker Desktop pa probaj ponovo.
    pause
    exit /b 1
)
echo   OK: Docker Desktop radi.

REM --- 3. Kreiranje .env fajla ---
echo [3/5] Priprema .env fajla...
if not exist "iznajmljivanjevozila-backend\.env" (
    if not exist "iznajmljivanjevozila-backend\.env.example" (
        echo   GRESKA: Ne postoji .env.example fajl!
        pause
        exit /b 1
    )
    copy "iznajmljivanjevozila-backend\.env.example" "iznajmljivanjevozila-backend\.env" >nul

    REM Zameni SQLite sa MySQL podesavanjima za Docker
    powershell -Command "(Get-Content 'iznajmljivanjevozila-backend\.env' -Raw) -replace 'DB_CONNECTION=sqlite','DB_CONNECTION=mysql' -replace '# DB_HOST=127.0.0.1','DB_HOST=db' -replace '# DB_PORT=3306','DB_PORT=3306' -replace '# DB_DATABASE=laravel','DB_DATABASE=laravel' -replace '# DB_USERNAME=root','DB_USERNAME=root' -replace '# DB_PASSWORD=','DB_PASSWORD=root' | Set-Content 'iznajmljivanjevozila-backend\.env'"

    echo   .env kreiran i konfigurisan za Docker.
) else (
    echo   .env vec postoji, preskoceno.
)

REM --- 4. Pokretanje Docker Compose ---
echo [4/5] Pokretanje kontejnera (prvi put moze potrajati)...
echo.
docker-compose down >nul 2>&1
docker-compose up --build -d
if %errorlevel% neq 0 (
    echo   GRESKA: Docker Compose nije uspeo!
    pause
    exit /b 1
)
echo.
echo   Kontejneri pokrenuti!

REM --- 5. Cekanje baze + migracije ---
echo [5/5] Cekanje da baza bude spremna...
set /a retry=0
set /a maxRetries=30

:wait_loop
if %retry% geq %maxRetries% goto db_failed
set /a retry+=1
docker exec iteh_db mysqladmin ping -h localhost -u root -proot >nul 2>&1
if %errorlevel% equ 0 goto db_ready
echo   Cekam bazu... (%retry%/%maxRetries%)
timeout /t 2 /nobreak >nul
goto wait_loop

:db_failed
echo   GRESKA: MySQL se nije pokrenuo na vreme!
pause
exit /b 1

:db_ready
echo   Baza spremna!
echo.

echo   Generisanje kljuca...
docker exec iteh_backend php artisan key:generate --force >nul 2>&1

echo   Pokretanje migracija...
docker exec iteh_backend php artisan migrate --force

echo   Popunjavanje baze test podacima...
docker exec iteh_backend php artisan db:seed --force

docker exec iteh_backend php artisan storage:link >nul 2>&1

echo.
echo ========================================
echo    APLIKACIJA JE POKRENUTA!
echo ========================================
echo.
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:8000
echo   Swagger:   http://localhost:8000/api/documentation
echo.
echo   Test nalozi:
echo     Admin:     admin@iteh.rs     / admin123
echo     Sluzbenik: sluzbenik@iteh.rs / sluzbenik123
echo     Klijent:   klijent@iteh.rs   / klijent123
echo.
echo   Za zaustavljanje: zatvori ovaj prozor ili pokreni:
echo     docker-compose down
echo.
echo   Pratim logove... (Ctrl+C za izlaz)
echo.
docker-compose logs -f
pause
