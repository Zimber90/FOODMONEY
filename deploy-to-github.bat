@echo off
echo ========================================
echo Script di Deploy per GitHub
echo ========================================
echo.

:: Verifica se git è installato
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRORE: Git non è installato. Installa Git prima di eseguire questo script.
    pause
    exit /b 1
)

:: Verifica se il repository è già inizializzato
if not exist ".git" (
    echo Inizializzazione repository Git...
    git init
    echo Repository Git inizializzato.
) else (
    echo Repository Git già inizializzato.
)

:: Aggiungi tutti i file
echo Aggiungendo tutti i file al repository...
git add .

:: Commit iniziale se non ci sono commit precedenti
git log --oneline -n 1 >nul 2>&1
if %errorlevel% neq 0 (
    echo Creazione commit iniziale...
    git commit -m "Initial commit: Angular project setup"
    echo Commit iniziale creato.
) else (
    echo Aggiornamento commit...
    git commit -m "Update project files"
    echo File aggiornati nel repository.
)

:: Chiedi l'URL del repository GitHub
set /p github_url=Inserisci l'URL del repository GitHub (es. https://github.com/username/repository.git): 

if "%github_url%"=="" (
    echo ERRORE: L'URL del repository non può essere vuoto.
    pause
    exit /b 1
)

:: Aggiungi il remoto se non esiste
git remote -v | findstr "%github_url%" >nul
if %errorlevel% neq 0 (
    echo Aggiunta remoto GitHub...
    git remote add origin "%github_url%"
    echo Remoto aggiunto: %github_url%
) else (
    echo Remoto già configurato.
)

:: Push su GitHub
echo.
echo Invio i file a GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESSO! Il progetto è stato inviato a GitHub.
    echo ========================================
) else (
    echo.
    echo ERRORE: Si è verificato un problema durante il push a GitHub.
    echo Possibili cause:
    echo 1. Credenziali GitHub non configurate
    echo 2. Repository non esiste o non è accessibile
    echo 3. Problema di connessione a internet
    echo.
    echo Soluzioni:
    echo 1. Configura le credenziali con: git config --global user.name "Tuo Nome"
    echo    git config --global user.email "tua@email.com"
    echo 2. Crea un repository vuoto su GitHub prima di eseguire questo script
    echo 3. Verifica la connessione a internet
)

echo.
echo Premere un tasto per uscire...
pause