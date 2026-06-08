$ErrorActionPreference = "Stop"

$mysqladmin = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqladmin.exe"

if (-not (Test-Path $mysqladmin)) {
    throw "mysqladmin not found at $mysqladmin"
}

& $mysqladmin -h 127.0.0.1 -P 3307 -u root shutdown
Write-Host "Project MySQL stopped"
