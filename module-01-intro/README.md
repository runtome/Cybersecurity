# Module 01: Introduction to Ethical Hacking and Penetration Testing

> **Curriculum alignment:** CEH v13 Domain 1 / CompTIA PenTest+ PT0-003 — Domain 1.0
> **Difficulty:** Beginner
> **Estimated study time:** 3 hours

---

## Overview

This module establishes the ethical and legal foundation of penetration testing. It covers the classification of hackers, the five phases of ethical hacking, key legal frameworks, and how vulnerabilities are scored and tracked. Understanding these concepts is mandatory before conducting any security assessment.

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

---

## Key Concepts

### Hacker Classifications

| Type | Description |
|------|-------------|
| White Hat | Authorised security professionals testing with permission |
| Black Hat | Malicious attackers operating without authorisation |
| Grey Hat | Operate without permission but do not cause intentional harm |
| Script Kiddie | Use pre-built tools without understanding the underlying technique |
| Hacktivist | Motivated by political or social ideology |
| Nation-State | State-sponsored advanced persistent threat (APT) actors |
| Insider Threat | Malicious or negligent employees with internal access |

### Five Phases of Ethical Hacking

1. **Reconnaissance** — passive and active information gathering
2. **Scanning** — identify live hosts, open ports, running services
3. **Gaining Access** — exploit discovered vulnerabilities
4. **Maintaining Access** — establish persistence (backdoors, rootkits)
5. **Clearing Tracks** — remove logs and indicators of compromise

### CVE and CVSS

**CVE (Common Vulnerabilities and Exposures):** A public identifier for known vulnerabilities, e.g. `CVE-2021-44228` (Log4Shell).

**CVSS (Common Vulnerability Scoring System):** A 0–10 numerical score rating vulnerability severity.

| Score Range | Severity |
|-------------|----------|
| 0.0 | None |
| 0.1 – 3.9 | Low |
| 4.0 – 6.9 | Medium |
| 7.0 – 8.9 | High |
| 9.0 – 10.0 | Critical |

### Legal Frameworks

- **CFAA (Computer Fraud and Abuse Act)** — US federal law criminalising unauthorised computer access
- **GDPR** — EU regulation covering data protection and privacy
- **ECPA** — US law governing electronic communications interception
- **ISO/IEC 27001** — International standard for information security management

> **Legal reminder:** Always obtain written authorisation before testing any system you do not own. Verbal permission is not sufficient.

---

## Methodology / Process

1. **Define scope and objectives** — what systems are in scope, what is the goal?
2. **Obtain written authorisation** — Rules of Engagement (RoE) document signed
3. **Reconnaissance** — gather information without touching the target
4. **Scanning and enumeration** — actively probe the target
5. **Exploitation** — attempt to gain access
6. **Post-exploitation** — assess impact, move laterally if authorised
7. **Reporting** — document findings with evidence and remediation steps

![Pentest Lifecycle](./images/pentest-lifecycle.png)
*Figure 1: The penetration testing lifecycle from scope to report*

---

## Tools & Commands

### Kali Linux — Initial Setup

**Purpose:** Verify the environment is ready for testing
**Install:** Pre-installed on Kali Linux

```bash
# Check IP address and interfaces
ip a

# Check current user
whoami && id

# Update system packages
sudo apt update && sudo apt upgrade -y

# Check installed Kali tools
kali-tools-headless --list 2>/dev/null || dpkg -l | grep kali
```

---

## Attack Techniques (Offensive)

### Technique 1: Understanding the Attack Surface

**Description:** Before exploitation, map every entry point — open ports, web apps, APIs, VPN endpoints, exposed credentials.
**Prerequisites:** Network access or OSINT data on the target.
**MITRE ATT&CK:** [TA0043 — Reconnaissance](https://attack.mitre.org/tactics/TA0043/)

**Steps:**

```bash
# Quick host discovery on a /24 subnet
nmap -sn 192.168.1.0/24

# Identify operating systems and service versions
nmap -sV -O 192.168.1.100
```

---

## Detection & Defence (Defensive)

### Reducing the Attack Surface

**Detection indicators:**
- IDS/IPS alerts on port scan signatures (Snort rule: `scan_detect`)
- Firewall logs showing sequential port access from a single source IP

**Mitigations:**
- Implement a firewall policy denying all inbound traffic except required services
- Enable port knocking or VPN for administrative access
- Disable unused services and close unnecessary ports
- Conduct regular internal vulnerability scans

**CIS Controls:** CIS Control 4 (Secure Configuration), CIS Control 12 (Network Infrastructure Management)

---

## CTF Tips & Tricks

- **Starting point:** Always run `nmap -sV -sC -oA initial_scan <target>` as your first step to capture service versions and default scripts.
- **Low-hanging fruit:** Check for default credentials on any service before attempting exploitation.
- **Flag locations:** In introductory CTF rooms, flags are often in `/home/<user>/user.txt` and `/root/root.txt`.
- **Common rabbit holes:** Don't spend too long on a rabbit hole — if you're stuck for 30 minutes, move to a different attack vector.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| Testing without written permission | Illegal; can result in prosecution even with verbal consent | Get a signed Rules of Engagement document |
| Skipping reconnaissance | Misses critical context like exposed admin panels | Always complete recon before scanning |
| Using CVSS score as the only priority metric | Score doesn't account for your specific environment | Consider exploitability + business impact together |
| Forgetting to save scan output | Lose evidence needed for the report | Always use `-oA <filename>` with Nmap |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| TryHackMe | Starting Out In Cyber Sec | Easy | [Link](https://tryhackme.com/room/startingoutincybersec) |
| TryHackMe | Introduction to Offensive Security | Easy | [Link](https://tryhackme.com/room/introtooffensivesecurity) |
| TryHackMe | Introduction to Defensive Security | Easy | [Link](https://tryhackme.com/room/defensivesecurity) |

---

## References

- [NIST NVD — CVE Database](https://nvd.nist.gov/) — Authoritative CVE and CVSS scoring database
- [MITRE ATT&CK Framework](https://attack.mitre.org/) — Adversarial tactics and techniques matrix
- [EC-Council CEH v13 Courseware](https://www.eccouncil.org/train-certify/certified-ethical-hacker-ceh/) — Module 01
- [CompTIA PenTest+ PT0-003 Study Guide](https://www.comptia.org/certifications/pentest) — Chapter 1

---

*Back to [Repository Root](../)*
