# Module 03: Information Gathering and Vulnerability Scanning

> **Curriculum alignment:** CEH v13 Domain 3 / CompTIA PenTest+ PT0-003 — Domain 2.0 Information Gathering
> **Difficulty:** Beginner–Intermediate
> **Estimated study time:** 5 hours

---

## Overview

Reconnaissance and vulnerability scanning form the intelligence backbone of any penetration test. This module covers both passive OSINT techniques (no direct target interaction) and active scanning (Nmap, Nessus, Nikto). Thorough recon dramatically increases the probability of finding an exploitable path and reduces wasted effort during exploitation phases.

---

## Table of Contents

- [Key Concepts](#key-concepts)
- [Methodology / Process](#methodology--process)
- [Tools & Commands](#tools--commands)
- [Attack Techniques (Offensive)](#attack-techniques-offensive)
- [Detection & Defence (Defensive)](#detection--defence-defensive)
- [CTF Tips & Tricks](#ctf-tips--tricks)
- [Common Mistakes](#common-mistakes)
- [Practice Labs](#practice-labs)
- [References](#references)

## Supplementary Files

| File | Description |
|------|-------------|
| [google-dorking.md](./google-dorking.md) | Full Google Dorking reference — 4,448 dork queries organised by category (directory listings, credentials, CMS, network devices, log files, private keys, and more) |
| [kali-lab.md](./kali-lab.md) | Hands-on Kali Linux lab — SpiderFoot, recon-ng, dnsrecon, WHOIS, dig, nslookup, sslscan, exiftool, Shodan CLI, Nmap, tcpdump, Wireshark, and GVM/OpenVAS |

---

## Key Concepts

### Passive vs Active Reconnaissance

| Type | Interaction with Target | Risk of Detection | Examples |
|------|------------------------|-------------------|---------|
| Passive | None — uses public data | Very low | WHOIS, Shodan, Google Dorks, LinkedIn |
| Active | Direct — sends packets to target | Medium–High | Nmap, Nikto, Nessus, DNS zone transfers |

### DNS Record Types

| Record | Purpose |
|--------|---------|
| A | Maps hostname to IPv4 address |
| AAAA | Maps hostname to IPv6 address |
| MX | Mail exchange server |
| NS | Authoritative name servers |
| CNAME | Alias to another hostname |
| TXT | Arbitrary text (SPF, DKIM, domain verification) |
| PTR | Reverse DNS (IP to hostname) |

### Google Dork Operators

| Operator | Example | Purpose |
|----------|---------|---------|
| `site:` | `site:example.com filetype:pdf` | Restrict results to a domain |
| `filetype:` | `filetype:xlsx` | Find specific file types |
| `intitle:` | `intitle:"index of"` | Search page titles |
| `inurl:` | `inurl:admin` | Search URLs |
| `cache:` | `cache:example.com` | View Google's cached copy |

> **Full dork list:** See [google-dorking.md](./google-dorking.md) for a comprehensive reference of 4,448+ dork queries organised by category — credentials, directory listings, CMS platforms, network devices, private keys, and more.

---

## Methodology / Process

1. **Passive OSINT** — WHOIS, DNS, Shodan, LinkedIn, Google Dorks, Certificate Transparency
2. **Infrastructure mapping** — identify IP ranges, ASNs, cloud providers
3. **Active DNS enumeration** — zone transfer attempts, subdomain brute force
4. **Host discovery** — ping sweeps to find live hosts
5. **Port scanning** — TCP/UDP port discovery
6. **Service and version detection** — identify software and versions on open ports
7. **Vulnerability scanning** — run Nessus/OpenVAS against enumerated services
8. **Manual verification** — confirm scanner findings are not false positives

![Recon Methodology](./images/recon-methodology.png)
*Figure 1: Information gathering workflow from passive OSINT to vulnerability confirmation*

---

## Tools & Commands

### Nmap

**Purpose:** Network discovery, port scanning, service/OS detection
**Install:** Pre-installed on Kali Linux

```bash
# Host discovery (no port scan)
nmap -sn 192.168.1.0/24

# Fast scan — top 1000 ports, service version, default scripts
nmap -sV -sC -T4 -oA scan_output 192.168.1.100

# Full TCP port scan
nmap -p- -T4 192.168.1.100

# UDP scan (slow — target specific ports)
nmap -sU -p 53,67,68,161 192.168.1.100

# Aggressive scan (OS detection + traceroute)
nmap -A 192.168.1.100

# Vulnerability scripts
nmap --script vuln 192.168.1.100
```

**Key flags:**

| Flag | Description |
|------|-------------|
| `-sS` | SYN scan (stealth, requires root) |
| `-sV` | Service/version detection |
| `-sC` | Default NSE scripts |
| `-O` | OS detection |
| `-p-` | All 65535 ports |
| `-T0`–`-T5` | Timing template (0=paranoid, 5=insane) |
| `-oA` | Output in all formats (xml, nmap, gnmap) |
| `--script` | Specify NSE script(s) |

---

### theHarvester

**Purpose:** OSINT — email, subdomain, IP, and URL enumeration
**Install:** Pre-installed on Kali Linux

```bash
# Gather emails and subdomains from multiple sources
theHarvester -d example.com -b google,bing,linkedin,shodan -l 500

# Output to HTML report
theHarvester -d example.com -b all -f output_report
```

---

### Gobuster

**Purpose:** Directory and subdomain brute-forcing
**Install:** Pre-installed on Kali Linux

```bash
# Directory brute force
gobuster dir -u http://192.168.1.100 -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -t 50

# Subdomain enumeration
gobuster dns -d example.com -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt

# Virtual host enumeration
gobuster vhost -u http://example.com -w /usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt
```

---

### Nikto

**Purpose:** Web server vulnerability scanner
**Install:** Pre-installed on Kali Linux

```bash
# Basic web server scan
nikto -h http://192.168.1.100

# Scan specific port, output to HTML
nikto -h 192.168.1.100 -p 8080 -o nikto_report.html -Format html
```

---

### Shodan (CLI)

**Purpose:** Internet-connected device search engine
**Install:** `pip install shodan`

```bash
# Initialise with API key
shodan init YOUR_API_KEY

# Search for Apache servers in a specific country
shodan search 'apache country:TH'

# Get info on a specific IP
shodan host 1.2.3.4

# Find hosts with open port 22
shodan search 'port:22'
```

---

## Attack Techniques (Offensive)

### Technique 1: DNS Zone Transfer

**Description:** Requests a full copy of a DNS zone from a misconfigured name server, revealing all hostnames and IPs in a domain.
**Prerequisites:** Identify the target's name servers via WHOIS or `nslookup`.
**MITRE ATT&CK:** [T1590.002 — DNS](https://attack.mitre.org/techniques/T1590/002/)

```bash
# Find name servers
nslookup -type=NS example.com

# Attempt zone transfer
dig axfr example.com @ns1.example.com

# Alternative with host
host -l example.com ns1.example.com
```

---

### Technique 2: Subdomain Enumeration with Certificate Transparency

**Description:** Certificate Transparency logs record every SSL/TLS cert issued, including internal and staging subdomains the organisation intended to keep private.
**MITRE ATT&CK:** [T1596.003 — Digital Certificates](https://attack.mitre.org/techniques/T1596/003/)

```bash
# Query crt.sh (passive)
curl -s "https://crt.sh/?q=%.example.com&output=json" | jq '.[].name_value' | sort -u

# Amass (active + passive)
amass enum -passive -d example.com
amass enum -active -d example.com -o amass_output.txt
```

---

## Detection & Defence (Defensive)

### Defending Against Recon

**Detection indicators:**
- Firewall/IDS logs showing rapid sequential connection attempts from a single IP (port scan signature)
- DNS logs showing AXFR requests to authoritative name servers
- Web server logs showing directory scan patterns (`/admin`, `/login`, `/.env`)

**Mitigations:**
- Disable DNS zone transfers on all public name servers (allow only to authorised secondary NS)
- Implement rate limiting and geo-blocking on web applications
- Use a Web Application Firewall (WAF) to detect and block scanner signatures
- Deploy honeypot directories (e.g., `/secret-admin/`) to catch directory scanners
- Remove version banners from web server and service headers (`Server:`, `X-Powered-By:`)

**CIS Controls:** CIS Control 7 (Continuous Vulnerability Management), CIS Control 13 (Network Monitoring)

---

## CTF Tips & Tricks

- **Always scan all ports:** `nmap -p-` — CTF boxes often hide services on non-standard ports.
- **Check UDP:** Services like SNMP (161) and TFTP (69) are often forgotten; `nmap -sU -p 161 <target>`.
- **Run default scripts:** `-sC` triggers helpful scripts like `http-title`, `smb-os-discovery`, `ftp-anon`.
- **Gobuster after Nmap:** If port 80/443 is open, immediately run a directory scan in the background.
- **Check robots.txt and sitemap.xml** — often discloses admin paths and hidden endpoints.
- **Source code:** View page source (`Ctrl+U`) — commented-out paths, credentials, and API keys appear regularly.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| Only scanning top 1000 ports | Misses services on high ports like 8080, 8443, 10000 | Always follow up with `-p-` full port scan |
| Not saving scan output | Cannot reference evidence in the report | Use `-oA <name>` on every Nmap scan |
| Trusting scanner output blindly | High false positive rate, especially with Nessus | Manually verify all critical findings |
| Forgetting UDP | SNMP, TFTP, DNS on UDP are frequently exploitable | Include UDP scan in methodology |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| **Local (Kali)** | **Kali Linux Recon Lab** | **Beginner–Intermediate** | [kali-lab.md](./kali-lab.md) |
| TryHackMe | Passive Reconnaissance | Easy | [Link](https://tryhackme.com/room/passiverecon) |
| TryHackMe | Active Reconnaissance | Easy | [Link](https://tryhackme.com/room/activerecon) |
| TryHackMe | Nmap | Easy | [Link](https://tryhackme.com/room/furthernmap) |
| HackTheBox | Any Easy Linux machine | Easy | [Link](https://www.hackthebox.com) |

---

## References

- [Nmap Official Documentation](https://nmap.org/book/man.html) — Complete flag and script reference
- [OSINT Framework](https://osintframework.com/) — Categorised OSINT tool directory
- [Shodan.io](https://www.shodan.io/) — Internet-wide device search
- [crt.sh](https://crt.sh/) — Certificate Transparency log search
- CEH v13 Official Courseware — Module 03 & 04
- CompTIA PenTest+ PT0-003 Study Guide — Chapter 2

---

*Back to [Repository Root](../README.md)*
