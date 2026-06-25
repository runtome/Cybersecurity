# Cybersecurity Notes

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Modules](https://img.shields.io/badge/modules-10-blue)
![Platform](https://img.shields.io/badge/platform-Kali%20Linux-557C94?logo=kalilinux&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

A structured knowledge base covering both **Offensive** and **Defensive** security practices, built for Capture The Flag (CTF) competitions, penetration testing study, and professional certification preparation (OSCP, CEH, eJPT, CompTIA PenTest+).

All notes follow the EC-Council CEH v13 / CompTIA PenTest+ PT0-003 curriculum and are supplemented with practical CTF techniques and real tool output examples.

---

## Table of Contents

- [How to Use This Repo](#how-to-use-this-repo)
- [Module Index](#module-index)
- [Cheatsheets](#cheatsheets)
- [CTF Write-Ups](#ctf-write-ups)
- [Resources](#resources)
- [Tools Referenced](#tools-referenced)
- [Contributing](#contributing)

---

## How to Use This Repo

1. **Linear study** — work through modules 01 to 10 in order for a complete penetration testing methodology.
2. **Topic lookup** — jump directly to any module folder or cheatsheet for a quick command reference.
3. **CTF workflow** — start in `ctf-writeups/` for solved challenge write-ups; use `cheatsheets/reverse-shells.md` and `cheatsheets/privilege-escalation.md` during active competitions.
4. **Lab setup** — see `resources/lab-setup.md` to configure your Kali Linux VM, vulnerable machines (Metasploitable, DVWA, VulnHub), and networking.

All commands are written for **Kali Linux 2024+** unless otherwise noted. Windows-specific commands are clearly labelled.

---

## Module Index

| # | Module | Topics |
|---|--------|--------|
| 01 | [Introduction to Ethical Hacking and Penetration Testing](./module-01-intro/) | Ethics, legal frameworks, hacker types, pentest phases, CVE/CVSS |
| 02 | [Planning and Scoping a Penetration Testing Assessment](./module-02-planning/) | Rules of engagement, scope definition, threat modelling, compliance (PCI-DSS, HIPAA) |
| 03 | [Information Gathering and Vulnerability Scanning](./module-03-recon/) | Passive/active recon, OSINT, Nmap, Nessus, Nikto, Shodan |
| 04 | [Social Engineering Attacks](./module-04-social-engineering/) | Phishing, vishing, pretexting, SET framework, defences |
| 05 | [Exploiting Wired and Wireless Networks](./module-05-network-exploitation/) | MITM, ARP spoofing, WPA2 cracking, Metasploit, pivoting |
| 06 | [Exploiting Application-Based Vulnerabilities](./module-06-app-vulnerabilities/) | OWASP Top 10, SQLi, XSS, IDOR, Burp Suite, API testing |
| 07 | [Cloud, Mobile, and IoT Security](./module-07-cloud-mobile-iot/) | AWS/Azure misconfigs, Android APK analysis, firmware analysis |
| 08 | [Performing Post-Exploitation Techniques](./module-08-post-exploitation/) | Privilege escalation, persistence, lateral movement, credential dumping |
| 09 | [Reporting and Communication](./module-09-reporting/) | Report structure, CVSS scoring, executive summaries, remediation advice |
| 10 | [Tools and Code Analysis](./module-10-tools-code-analysis/) | Reverse engineering, static/dynamic analysis, scripting (Python/Bash), custom exploits |

---

## Cheatsheets

Quick-reference sheets for use during CTFs and assessments.

| Cheatsheet | Description |
|------------|-------------|
| [Linux Commands](./cheatsheets/linux-commands.md) | Essential file system, process, and network commands |
| [Windows Commands](./cheatsheets/windows-commands.md) | CMD and PowerShell for post-exploitation |
| [Networking Basics](./cheatsheets/networking-basics.md) | OSI model, TCP/IP, subnetting, ports |
| [Common Ports & Services](./cheatsheets/common-ports-services.md) | Top ports with service names and attack notes |

| [Privilege Escalation](./cheatsheets/privilege-escalation.md) | Linux and Windows privesc vectors and commands |
| [Cryptography Basics](./cheatsheets/cryptography-basics.md) | Encoding, hashing, cipher identification |

---

## CTF Write-Ups

Documented solutions to CTF challenges and HackTheBox / TryHackMe machines.

- [HackTheBox Machines](./ctf-writeups/htb/)
- [TryHackMe Rooms](./ctf-writeups/thm/)
- [picoCTF Challenges](./ctf-writeups/picoctf/)
- [Other Platforms](./ctf-writeups/other/)
- [Write-Up Template](./ctf-writeups/template-writeup.md)

---

## Resources

- [Tools Reference](./resources/tools-reference.md) — Full Kali Linux toolset quick reference
- [Wordlists](./resources/wordlists.md) — SecLists, rockyou.txt, custom list generation
- [Lab Setup Guide](./resources/lab-setup.md) — VirtualBox / VMware Kali + target VMs
- [Certifications](./resources/certifications.md) — OSCP, CEH, eJPT, PenTest+ study paths

---

## Tools Referenced

| Tool | Category | Notes |
|------|----------|-------|
| Kali Linux | Platform | Primary OS for all offensive techniques |
| Nmap | Recon | Network scanning and service enumeration |
| Metasploit Framework | Exploitation | Module-based exploitation framework |
| Burp Suite | Web Testing | HTTP proxy, scanner, intruder |
| Wireshark | Network Analysis | Packet capture and protocol dissection |
| Hashcat / John the Ripper | Password Cracking | GPU and CPU-based hash cracking |
| Aircrack-ng | Wireless | WPA/WPA2 handshake capture and cracking |
| Gobuster / ffuf | Web Recon | Directory and subdomain fuzzing |
| Nikto | Web Scanning | Automated web server vulnerability scanner |
| SQLMap | SQL Injection | Automated SQL injection detection and exploitation |
| Hydra | Brute Force | Online password brute-force tool |
| Netcat / Ncat | Networking | Reverse shells, port forwarding |
| BloodHound | AD Recon | Active Directory attack path mapping |
| Mimikatz | Credential Dumping | Windows credential extraction |
| Impacket | AD Attacks | Python suite for SMB/Kerberos attacks |
| SET (Social-Engineer Toolkit) | Social Engineering | Phishing and credential harvesting |
| Ghidra / IDA Free | Reverse Engineering | Binary analysis and decompilation |
| linPEAS / winPEAS | Privesc | Automated privilege escalation enumeration |

---

## Contributing

1. Fork the repository.
2. Create a branch: `git checkout -b notes/your-topic`
3. Add or edit notes following the module `README.md` template.
4. Commit with a descriptive message: `git commit -m "add: SQLi cheatsheet examples"`
5. Open a pull request.

Please keep commands tested, label OS-specific steps clearly, and include defensive countermeasures alongside offensive techniques where applicable.

---

*Maintained by [suphot.n@gmail.com](mailto:suphot.n@gmail.com) — Last updated: 2026-06-08*
