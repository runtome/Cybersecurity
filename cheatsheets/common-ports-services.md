# Common Ports & Services Cheatsheet

| Port | Protocol | Service | Attack Notes |
|------|----------|---------|--------------|
| 21 | TCP | FTP | Try anonymous login; check for writable dirs; version exploits |
| 22 | TCP | SSH | Brute force with Hydra; check for old versions (CVE-2018-10933) |
| 23 | TCP | Telnet | Cleartext auth; default credentials; packet sniffing |
| 25 | TCP | SMTP | Open relay; user enumeration (VRFY/EXPN); phishing infrastructure |
| 53 | TCP/UDP | DNS | Zone transfer (AXFR); cache poisoning; DNS tunnelling |
| 67/68 | UDP | DHCP | DHCP starvation; rogue DHCP server |
| 69 | UDP | TFTP | No authentication; file read/write |
| 80 | TCP | HTTP | Web app attacks; directory brute-force; default pages |
| 110 | TCP | POP3 | Cleartext credentials; brute force |
| 111 | TCP/UDP | RPCbind | NFS enumeration; privilege escalation |
| 135 | TCP | MSRPC | Relay attacks; DCOM exploitation |
| 137-139 | TCP/UDP | NetBIOS | LLMNR/NBT-NS poisoning; name resolution attacks |
| 143 | TCP | IMAP | Brute force; cleartext credentials |
| 161/162 | UDP | SNMP | v1/v2c community strings (public/private); MIB enumeration |
| 389 | TCP | LDAP | AD enumeration; LDAP injection; null bind |
| 443 | TCP | HTTPS | TLS version; web app attacks; cert info leakage |
| 445 | TCP | SMB | EternalBlue (MS17-010); relay attacks; share enumeration |
| 512-514 | TCP | RSH/Rlogin | Legacy remote access; no encryption |
| 873 | TCP | Rsync | Unauthenticated file access if misconfigured |
| 1433 | TCP | MSSQL | Brute force; xp_cmdshell RCE; linked servers |
| 1521 | TCP | Oracle DB | Default credentials (scott/tiger); TNS listener |
| 2049 | TCP | NFS | Mount shares without auth if misconfigured; `showmount -e` |
| 3306 | TCP | MySQL | Brute force; UDF exploitation; FILE privilege |
| 3389 | TCP | RDP | Brute force; BlueKeep (CVE-2019-0708); pass-the-hash |
| 4369 | TCP | Erlang Port Mapper | RabbitMQ; remote code execution |
| 5432 | TCP | PostgreSQL | Brute force; COPY TO/FROM RCE |
| 5900 | TCP | VNC | No auth; weak passwords; screenshot |
| 5985/5986 | TCP | WinRM | PowerShell remoting; pass-the-hash with Evil-WinRM |
| 6379 | TCP | Redis | Unauthenticated access; RCE via cron/authorized_keys write |
| 6667 | TCP | IRC | Command & control; botnet C2 |
| 8080 | TCP | HTTP-Alt | Tomcat manager (default creds); Jenkins; admin panels |
| 8443 | TCP | HTTPS-Alt | Same as above over TLS |
| 9200 | TCP | Elasticsearch | Unauthenticated REST API; data exposure |
| 27017 | TCP | MongoDB | No auth by default; data dump |

## Quick Nmap by Port/Service

```bash
# SMB
nmap --script smb-vuln* -p445 TARGET
nmap --script smb-enum-shares,smb-enum-users -p445 TARGET

# FTP
nmap --script ftp-anon,ftp-bounce -p21 TARGET

# HTTP/HTTPS
nmap --script http-title,http-headers,http-methods -p80,443,8080 TARGET

# SNMP
snmpwalk -c public -v 2c TARGET
nmap -sU --script snmp-info -p161 TARGET

# NFS
showmount -e TARGET

# Redis
redis-cli -h TARGET ping
redis-cli -h TARGET --no-auth

# MongoDB
mongo TARGET:27017

# MySQL
mysql -h TARGET -u root -p
```
