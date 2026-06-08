$ErrorActionPreference = "Stop"

$workspace = Resolve-Path (Join-Path $PSScriptRoot "..")
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe"
$mysql = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$dataDir = Join-Path $workspace ".local\mysql-data"
$logFile = Join-Path $workspace ".local\mysql-error.log"
$pidFile = Join-Path $workspace ".local\mysql.pid"

if (-not (Test-Path $mysqld)) {
    throw "MySQL Server binary not found at $mysqld"
}

if (-not (Test-Path $mysql)) {
    throw "MySQL client binary not found at $mysql"
}

New-Item -ItemType Directory -Force -Path (Split-Path $dataDir -Parent) | Out-Null

if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Force -Path $dataDir | Out-Null
    & $mysqld --no-defaults --initialize-insecure --datadir="$dataDir" --console
}

$listening = Get-NetTCPConnection -State Listen -LocalPort 3307 -ErrorAction SilentlyContinue
if (-not $listening) {
    $arguments = "--no-defaults --datadir=`"$dataDir`" --port=3307 --bind-address=127.0.0.1 --mysqlx=0 --log-error=`"$logFile`" --pid-file=`"$pidFile`""
    Start-Process -FilePath $mysqld -ArgumentList $arguments -WindowStyle Hidden

    Start-Sleep -Seconds 6
    $listening = Get-NetTCPConnection -State Listen -LocalPort 3307 -ErrorAction SilentlyContinue
    if (-not $listening) {
        if (Test-Path $logFile) {
            Get-Content $logFile -Tail 80
        }
        throw "Project MySQL did not start on 127.0.0.1:3307"
    }
}

& $mysql -h 127.0.0.1 -P 3307 -u root -e "CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci; CREATE USER IF NOT EXISTS 'ecommerce'@'127.0.0.1' IDENTIFIED BY 'ecommerce_local_123'; CREATE USER IF NOT EXISTS 'ecommerce'@'localhost' IDENTIFIED BY 'ecommerce_local_123'; GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce'@'127.0.0.1'; GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce'@'localhost'; FLUSH PRIVILEGES;"

Write-Host "Project MySQL is ready on 127.0.0.1:3307"
