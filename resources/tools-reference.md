# Tools Reference

Kali Linux toolset organised by category. All tools are pre-installed on Kali Linux 2024+ unless noted.

## Reconnaissance

| Tool | Command | Purpose |
|------|---------|---------|
| Nmap | `nmap -sV -sC TARGET` | Port scan + service detection |
| theHarvester | `theHarvester -d domain.com -b all` | OSINT email/subdomain collection |
| Amass | `amass enum -d domain.com` | Subdomain enumeration |
| Recon-ng | `recon-ng` | Modular recon framework |
| Maltego | `maltego` | Visual link analysis |
| Shodan CLI | `shodan search "apache"` | Internet device search |
| whois | `whois domain.com` | Domain registration info |
| dig | `dig domain.com ANY` | DNS record lookup |

## Scanning & Enumeration

| Tool | Command | Purpose |
|------|---------|---------|
| Nmap NSE | `nmap --script vuln TARGET` | Vulnerability scripts |
| Nikto | `nikto -h http://TARGET` | Web server scanner |
| Gobuster | `gobuster dir -u URL -w WORDLIST` | Directory/subdomain brute force |
| ffuf | `ffuf -u URL/FUZZ -w WORDLIST` | Fast web fuzzer |
| enum4linux | `enum4linux -a TARGET` | SMB/Samba enumeration |
| smbclient | `smbclient -L //TARGET -N` | SMB share listing |
| snmpwalk | `snmpwalk -c public -v2c TARGET` | SNMP MIB walk |
| ldapsearch | `ldapsearch -H ldap://TARGET -x` | LDAP enumeration |

## Exploitation

| Tool | Command | Purpose |
|------|---------|---------|
| Metasploit | `msfconsole` | Exploitation framework |
| SQLMap | `sqlmap -u "URL?id=1" --dbs` | SQL injection automation |
| Hydra | `hydra -l user -P wordlist.txt TARGET ssh` | Brute-force logins |
| Searchsploit | `searchsploit apache 2.4` | Local exploit-db search |
| msfvenom | `msfvenom -p linux/x64/shell_reverse_tcp ...` | Payload generation |

## Post-Exploitation

| Tool | Command | Purpose |
|------|---------|---------|
| linPEAS | `./linpeas.sh` | Linux privesc enumeration |
| winPEAS | `.\winPEASx64.exe` | Windows privesc enumeration |
| Mimikatz | `.\mimikatz.exe` | Windows credential dumping |
| Impacket | `impacket-psexec domain/user@IP` | SMB/Kerberos attacks |
| BloodHound | `bloodhound` + SharpHound collector | AD attack path mapping |
| CrackMapExec | `cme smb TARGET -u user -p pass` | Mass SMB/WinRM testing |
| Evil-WinRM | `evil-winrm -i TARGET -u user -p pass` | WinRM shell |

## Password Cracking

| Tool | Command | Purpose |
|------|---------|---------|
| Hashcat | `hashcat -m 0 hash.txt wordlist.txt` | GPU hash cracking |
| John the Ripper | `john hash.txt --wordlist=wordlist.txt` | CPU hash cracking |
| Hydra | `hydra -l admin -P wordlist.txt http-post-form "..."` | Online brute force |

## Wireless

| Tool | Command | Purpose |
|------|---------|---------|
| Aircrack-ng | `aircrack-ng -w wordlist.txt cap.cap` | WPA2 handshake cracking |
| Airodump-ng | `airodump-ng wlan0mon` | Wireless network scanning |
| Aireplay-ng | `aireplay-ng --deauth 10 -a BSSID wlan0mon` | Deauthentication attack |
| Kismet | `kismet` | Wireless IDS and scanning |
| Bettercap | `bettercap -iface wlan0` | MITM and wireless attacks |

## Web Application

| Tool | Command | Purpose |
|------|---------|---------|
| Burp Suite | `burpsuite` | HTTP proxy and scanner |
| OWASP ZAP | `zaproxy` | Open-source web scanner |
| WPScan | `wpscan --url URL --enumerate` | WordPress vulnerability scanner |
| DirBuster | GUI tool | Web directory brute force |
| Wfuzz | `wfuzz -c -z file,wordlist.txt URL/FUZZ` | Web fuzzer |

## Forensics & Reverse Engineering

| Tool | Command | Purpose |
|------|---------|---------|
| Ghidra | `ghidra` | Binary reverse engineering |
| Binwalk | `binwalk -e firmware.bin` | Firmware analysis and extraction |
| Volatility | `vol.py -f memory.vmem imageinfo` | Memory forensics |
| Autopsy | `autopsy` | Disk forensics GUI |
| exiftool | `exiftool image.jpg` | Metadata extraction |
| strings | `strings binary \| less` | Find embedded strings |
| strace / ltrace | `strace ./binary` | System/library call tracing |

## Network Analysis

| Tool | Command | Purpose |
|------|---------|---------|
| Wireshark | `wireshark` | Packet capture and analysis |
| tcpdump | `tcpdump -i eth0 -w capture.pcap` | CLI packet capture |
| Responder | `responder -I eth0 -dwF` | LLMNR/NBT-NS poisoning |
| Scapy | Python library | Custom packet crafting |
