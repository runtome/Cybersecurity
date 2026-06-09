# Kali Linux Recon Lab

> **Module:** 03 — Information Gathering and Vulnerability Scanning
> **Platform:** Kali Linux
> **Difficulty:** Beginner–Intermediate

---

## Table of Contents

1. [OSINT Framework](#1-osint-framework)
2. [SpiderFoot](#2-spiderfoot)
3. [recon-ng](#3-recon-ng)
4. [dnsrecon](#4-dnsrecon)
5. [Output Capture with tee](#5-output-capture-with-tee)
6. [WHOIS Lookups](#6-whois-lookups)
7. [DNS Lookup Lab](#7-dns-lookup-lab)
8. [SSL Certificate Analysis](#8-ssl-certificate-analysis)
9. [Metadata Extraction](#9-metadata-extraction)
10. [Advanced Google Searches](#10-advanced-google-searches)
11. [Shodan CLI](#11-shodan-cli)
12. [Active Reconnaissance with Nmap](#12-active-reconnaissance-with-nmap)
13. [Packet Inspection and Eavesdropping](#13-packet-inspection-and-eavesdropping)
14. [Vulnerability Scanning with GVM](#14-vulnerability-scanning-with-gvm)

---

## 1. OSINT Framework

Visit **https://osintframework.com/** — a categorised, interactive map of OSINT tools organised by target type (domain, email, social media, IP, etc.). Use it to discover the right tool before running commands.

---

## 2. SpiderFoot

SpiderFoot automates OSINT collection across 200+ data sources.

```bash
# Launch the web UI on localhost port 5001
spiderfoot -l 127.0.0.1:5001

# List available modules and filter by keyword
spiderfoot -M | grep [search term]
```

Open a browser to `http://127.0.0.1:5001` to access the SpiderFoot dashboard and start a new scan.

---

## 3. recon-ng

recon-ng is a full-featured web reconnaissance framework with a modular architecture similar to Metasploit.

```bash
recon-ng
```

### Key Commands Inside recon-ng

```
# Show all commands
[recon-ng][default] > help

# Search the marketplace for modules
[recon-ng][default] > marketplace search

# Refresh the module index
[recon-ng][default] > marketplace refresh

# Search for Bing-related modules
[recon-ng][default] > marketplace search bing

# List locally installed modules
[recon-ng][default] > modules search

# Load a module
[recon-ng][default] > modules load recon/domains-hosts/bing_domain_web

# View module options
[recon-ng][default][bing_domain_web] > info

# Set the target source
[recon-ng][default][bing_domain_web] > options set SOURCE h4cker.org

# Run the module
[recon-ng][default][bing_domain_web] > run
```

**Example output — Bing hostname enumeration against h4cker.org:**

```
----------
H4CKER.ORG
----------
[*] URL: https://www.bing.com/search?first=0&q=domain%3Ah4cker.org
```

**Marketplace module columns:**

| Column | Meaning |
|--------|---------|
| D | Has dependencies |
| K | Requires an API key |

---

## 4. dnsrecon

dnsrecon performs comprehensive DNS enumeration.

```bash
dnsrecon -d h4cker.org
```

---

## 5. Output Capture with tee

`tee` writes command output to both the terminal and a file simultaneously.

```bash
# Basic — overwrites file.txt each run
ping yahoo.com | tee file.txt

# Append to file instead of overwriting
ping yahoo.com | tee -a file.txt

# Fix buffering for commands that don't flush output line-by-line
stdbuf -oL ping yahoo.com | tee -a file.txt

# Add a timestamp to every line
ping yahoo.com | while read line; do
    echo "$(date '+%Y-%m-%d %H:%M:%S') $line"
done | tee -a file.txt
```

---

## 6. WHOIS Lookups

```bash
# Full WHOIS record for a domain
whois h4cker.org

# Extract email addresses registered under cisco.com
whois cisco.com | grep '@cisco.com'

# WHOIS on an IP address (shows netblock owner/ASN)
whois 72.163.5.201
```

---

## 7. DNS Lookup Lab

### nslookup — Interactive Mode

```bash
nslookup
```

```
# Resolve A record
> cisco.com
Server:         115.178.58.10
Address:        115.178.58.10#53

Non-authoritative answer:
Name:   cisco.com
Address: 72.163.4.185
Name:   cisco.com
Address: 2001:420:1101:1::185

# Switch query type to name servers
> set type=ns
> cisco.com
Server:         115.178.58.10
Address:        115.178.58.10#53

Non-authoritative answer:
cisco.com  nameserver = a28-64.akam.net.
cisco.com  nameserver = ns3.cisco.com.
cisco.com  nameserver = a3-64.akam.net.
cisco.com  nameserver = ns1.cisco.com.
cisco.com  nameserver = ns2.cisco.com.

Authoritative answers can be found from:
ns1.cisco.com   internet address = 72.163.5.201
ns2.cisco.com   internet address = 64.102.255.44
ns3.cisco.com   internet address = 173.37.146.41
```

```bash
# Reverse DNS lookup on a Cisco name server IP
nslookup 72.163.5.201
# → 201.5.163.72.in-addr.arpa  name = ns1.cisco.com.
```

---

### dig — Command Line DNS

```bash
# Standard A record query
dig cisco.com
```

```
; <<>> DiG 9.20.0-Debian <<>> cisco.com
;; ANSWER SECTION:
cisco.com.  1053  IN  A  72.163.4.185
;; Query time: 12 msec
;; SERVER: 115.178.58.10#53(115.178.58.10) (UDP)
```

```bash
# Query using Google's public DNS server for NS records
dig cisco.com @8.8.8.8 ns

# Reverse lookup (PTR record) on a specific IP
dig -x 72.163.5.201
```

```
;; ANSWER SECTION:
201.5.163.72.in-addr.arpa. 1800 IN PTR ns1.cisco.com.
```

```bash
# Explore adjacent IPs in the Cisco block
dig -x 72.163.1.1
# → 1.1.163.72.in-addr.arpa. PTR hsrp-72-163-1-1.cisco.com.
```

---

### host — Simple DNS Resolution

```bash
# Resolve all record types for a domain
host netflix.com
```

```
netflix.com has address 54.155.246.232
netflix.com has address 54.73.148.110
netflix.com has address 18.200.8.190
netflix.com has IPv6 address 2a05:d018:76c:b684:...
netflix.com mail is handled by 1 aspmx.l.google.com.
```

```bash
# Identify the hosting provider for each IP
whois 54.155.246.232 | grep OrgName   # → Amazon Technologies Inc.
whois 54.73.148.110  | grep OrgName   # → Amazon Technologies Inc.
whois 18.200.8.190   | grep OrgName   # → Amazon Technologies Inc.
```

---

## 8. SSL Certificate Analysis

SSL certificates reveal hostnames, org names, and sometimes internal infrastructure.

```bash
# Install dependencies
sudo apt update && sudo apt install -y aha

# Scan TLS configuration and supported ciphers
sslscan netacad.com

# Save colorised HTML report
sslscan netacad.com | aha > sfa_cert.html
```

---

## 9. Metadata Extraction

Metadata embedded in files (images, documents) can expose author names, GPS coordinates, software versions, and internal paths.

### Images — exiftool

```bash
# Install ExifTool
sudo apt install libimage-exiftool-perl

# List all supported file types
exiftool -listf

# Dump all metadata groups from an image
exiftool download.jpg

# Full grouped metadata dump from a PowerPoint
exiftool -a -G1 Solar_Anomaly_Detection_Trial_36.pptx
```

### Word Documents — docx2txt

```bash
sudo apt install docx2txt

# Extract text and search for passwords
docx2txt 260425_IntroduceMySelf_ChatGPT.docx - | grep -i password
```

### PDF Files — pdftotext

```bash
sudo apt install poppler-utils

# Extract text from PDF and search for passwords
pdftotext "Application_Form.pdf" - | grep -i password
```

### Arbitrary Binaries — strings

```bash
# Dump printable strings and search for secrets
strings Solar_Anomaly_Detection_Trial_36.pptx | less
strings Solar_Anomaly_Detection_Trial_36.pptx | grep -i password
strings Solar_Anomaly_Detection_Trial_36.pptx | grep -i api
strings Solar_Anomaly_Detection_Trial_36.pptx | grep -Ei "password|secret|token|apikey"

# Inspect the ZIP structure of Office documents
file Solar_Anomaly_Detection_Trial_36.pptx
zipinfo Solar_Anomaly_Detection_Trial_36.pptx | head
```

---

## 10. Advanced Google Searches

Use these Google dork patterns to find sensitive data indexed from public sources:

```
# Exposed credentials in source code / log files
"public $user =" | "public $password = " | "public $secret =" | "public $db =" ext:txt | ext:log -git

# Session IDs leaked in access logs
intext:JSESSIONID OR intext:PHPSESSID inurl:access.log ext:log
```

> For a comprehensive list of 4,448+ dork queries, see [google-dorking.md](./google-dorking.md).

---

## 11. Shodan CLI

Shodan indexes internet-connected devices and their open ports, banners, and vulnerabilities.

```bash
# Install
pip install shodan

# Authenticate with your API key
shodan init <YOUR_API_KEY>

# Check your account status and credits
shodan info

# Get your current public IP
shodan myip

# Search for webcam devices
shodan search webcam

# Get country statistics for a search term (no query credits used)
shodan stats webcam
```

**Example `shodan stats webcam` output:**

```
Top 10 Results for Facet: country
US     714
CN     391
SG     223
DE     191
GB     181

Top 10 Results for Facet: org
Linode                          690
Aliyun Computing Co., LTD      244
Alibaba Cloud LLC               186
```

> Note: `shodan search` requires query credits. `shodan stats` and `shodan myip` are free.

---

## 12. Active Reconnaissance with Nmap

### Host and Port Discovery

```bash
# Ping sweep — find live hosts on a subnet (no port scan)
nmap -sn 10.6.6.0/24

# Default scan of a single host (top 1000 TCP ports)
nmap 10.6.6.23

# OS detection (requires root)
sudo nmap -O 10.6.6.23
```

### Scan Types

| Flag | Scan Type | Notes |
|------|-----------|-------|
| `-sS` | SYN / Stealth scan | Requires root; half-open, less likely to be logged |
| `-sT` | TCP Connect scan | Full 3-way handshake; logged by target |
| `-sU` | UDP scan | Slow; use `-p` to target specific ports |
| `-sF` | TCP FIN scan | Sends FIN packets; evades some firewalls |
| `-sn` | Host Discovery | Ping sweep only, no port scan |
| `-T0`–`-T5` | Timing templates | 0 = paranoid, 5 = insane |

```bash
# SYN scan
sudo nmap -sS 192.168.88.251

# TCP Connect scan
nmap -sT 192.168.88.251

# UDP scan on DNS port only
sudo nmap -sU -p 53 192.168.88.251

# FIN scan on HTTP port
sudo nmap -sF -p 80 192.168.88.251
```

### Service and Version Detection

```bash
# Verbose FTP version scan with timing
nmap -v -p21 -sV -T4 10.6.6.23

# Aggressive scan — version + OS + scripts + traceroute
nmap -p21 -sV -A 10.6.6.23

# SMB service fingerprint
nmap -A -p139,445 10.6.6.23
```

### NSE (Nmap Scripting Engine)

```bash
# Enumerate SMB users
nmap --script smb-enum-users.nse 192.168.88.251
nmap --script smb-enum-users.nse -p139,445 10.6.6.23

# Enumerate SMB shares
nmap --script smb-enum-shares.nse -p445 10.6.6.23
nmap --script smb-enum-shares.nse -p445 192.168.88.251

# Enumerate SMB groups with credentials
nmap --script smb-enum-groups.nse --script-args smbusername=vagrant,smbpass=vagrant 192.168.56.3
```

---

## 13. Packet Inspection and Eavesdropping

### Network Sniffing with Wireshark / tcpdump

```bash
# Show network interfaces
ifconfig

# Show routing table
ip route

# Show DNS resolver configuration
cat /etc/resolv.conf

# Capture all traffic on eth0 to a pcap file (full packet capture)
sudo tcpdump -i eth0 -s 0 -w packetdump.pcap

# Verify the capture file was created
ls packetdump.pcap

# Open the capture in the Wireshark GUI for analysis
wireshark
```

> In Wireshark, open `packetdump.pcap` via **File → Open** and use display filters (e.g., `http`, `dns`, `tcp.port == 80`) to isolate traffic of interest.

---

## 14. Vulnerability Scanning with GVM

GVM (Greenbone Vulnerability Manager, formerly OpenVAS) is a full-featured vulnerability scanner built into Kali.

### Pre-scan Checks on Target Host

```bash
# Check open ports and services on the target (run on the target machine)
netstat -tunap
sudo netstat -tunap
```

### Service Discovery Before Scanning

```bash
# Confirm target is reachable
ping -c5 10.6.6.23

# Identify services and versions
nmap -sV 10.6.6.23

# Add OS detection
sudo nmap -O 10.6.6.23
```

### GVM Lifecycle Commands

```bash
# Verify GVM is correctly set up
sudo gvm-check-setup

# Start GVM services
sudo gvm-start

# Stop GVM services
sudo gvm-stop
```

After `gvm-start`, access the web interface at `https://127.0.0.1:9392` (default credentials: `admin` / check setup output).

**Typical GVM scan workflow:**

1. `sudo gvm-start` — start services
2. Browse to `https://127.0.0.1:9392`
3. Create a **Target** (enter the IP or range)
4. Create a **Task** (link to the target, select scan config)
5. Start the task and monitor progress
6. Export the report as PDF or XML when complete
7. `sudo gvm-stop` — stop services when done

---

*Back to [Module 03 README](./README.md)*
