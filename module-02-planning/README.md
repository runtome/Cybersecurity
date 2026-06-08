# Module 02: Planning and Scoping a Penetration Testing Assessment

> **Curriculum alignment:** CEH v13 Domain 2 / CompTIA PenTest+ PT0-003 — Domain 1.0 Planning & Scoping
> **Difficulty:** Beginner
> **Estimated study time:** 2 hours

---

## Overview

Before any technical work begins, a penetration test must be carefully planned and scoped. This module covers how to define the scope, establish rules of engagement, classify the type of assessment, understand compliance requirements, and manage risk throughout the engagement. Poor planning is the most common reason penetration tests fail to deliver value.

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

### Types of Penetration Tests

| Type | Description |
|------|-------------|
| Black Box | No prior knowledge of the target — simulates an external attacker |
| White Box | Full knowledge (source code, network diagrams, credentials) |
| Grey Box | Partial knowledge — simulates a privileged insider or partner |

### Assessment Categories

- **Network Pentest** — external perimeter, internal network, wireless
- **Web Application Pentest** — OWASP-based assessment of web apps and APIs
- **Social Engineering Assessment** — phishing, vishing, physical intrusion
- **Red Team Exercise** — full-scope adversary simulation with stealth requirements
- **Purple Team Exercise** — collaborative red/blue team with shared telemetry

### Rules of Engagement (RoE)

The RoE is a legally binding document that defines:
- **Scope** — IP ranges, domains, applications, and physical locations that are in scope
- **Out-of-scope** — systems explicitly excluded (e.g., production databases, third-party systems)
- **Timing** — allowed testing windows (business hours vs. 24/7)
- **Emergency contacts** — who to call if testing causes unintended damage
- **Evidence handling** — how captured data is stored, transmitted, and destroyed

### Compliance Frameworks

| Framework | Sector | Relevance to Pentesting |
|-----------|--------|------------------------|
| PCI-DSS | Payment cards | Requires annual external pentest of cardholder data environments |
| HIPAA | Healthcare | Risk assessments required; pentests are best practice |
| SOC 2 | SaaS/Cloud | Penetration testing is part of security audit evidence |
| ISO 27001 | All sectors | Requires regular vulnerability and penetration testing |
| NIST SP 800-115 | US Federal | Technical guide for information security testing |

### Threat Modelling

**STRIDE** is a threat modelling framework:

| Letter | Threat | Example |
|--------|--------|---------|
| S | Spoofing | ARP spoofing, IP spoofing |
| T | Tampering | Modifying packets in transit |
| R | Repudiation | Deleting logs to deny actions |
| I | Information Disclosure | Exposing sensitive data via misconfiguration |
| D | Denial of Service | Flooding a service to cause downtime |
| E | Elevation of Privilege | Exploiting a SUID binary to get root |

---

## Methodology / Process

1. **Statement of Work (SoW)** — define objectives, deliverables, and timeline
2. **Scope definition** — list all in-scope and out-of-scope targets
3. **Rules of Engagement** — draft and sign the RoE document
4. **Threat modelling** — identify likely attacker profiles and attack scenarios
5. **Resource planning** — tools, team roles, lab environment
6. **Legal review** — ensure all authorisation documents are signed
7. **Kick-off meeting** — align with client stakeholders before testing begins

![Scoping Process](./images/scoping-process.png)
*Figure 1: Planning and scoping workflow from SoW to kick-off*

---

## Tools & Commands

### Passive Scope Validation

**Purpose:** Verify what assets belong to the client before testing

```bash
# WHOIS lookup — verify domain ownership
whois example.com

# Reverse DNS on an IP range to identify hosts
for i in $(seq 1 254); do host 192.168.1.$i 2>/dev/null | grep "domain name pointer"; done

# Identify ASN and IP ranges owned by an organisation
whois -h whois.radb.net -- '-i origin AS12345'
```

---

## Attack Techniques (Offensive)

### Technique 1: Scope Creep Detection

**Description:** During testing, attackers may inadvertently reach out-of-scope systems via trust relationships. Documenting these paths is valuable.
**Prerequisites:** Active testing underway.
**MITRE ATT&CK:** [T1590 — Gather Victim Network Information](https://attack.mitre.org/techniques/T1590/)

```bash
# Map network neighbours to detect out-of-scope assets
nmap --traceroute -sn 10.0.0.0/8

# Enumerate trust relationships from a compromised Windows host
net view /domain
nltest /domain_trusts
```

---

## Detection & Defence (Defensive)

### Scoping Controls to Protect Out-of-Scope Systems

**Detection indicators:**
- Network traffic from pentester IPs reaching out-of-scope VLANs
- Firewall logs showing unexpected lateral traffic

**Mitigations:**
- Enforce network segmentation so pentesters cannot reach out-of-scope VLANs by accident
- Provide the pentest team with a network diagram showing segment boundaries
- Set up an emergency stop process: one call to halt all testing immediately
- Include a "get-out-of-jail letter" for the pentest team to carry during physical assessments

**CIS Controls:** CIS Control 12 (Network Infrastructure Management), CIS Control 18 (Penetration Testing)

---

## CTF Tips & Tricks

- **Read the room description carefully** — CTF scope is defined by the room; going outside it wastes time.
- **Note all discovered IPs** — lateral movement in CTF labs often requires enumerating all reachable hosts.
- **Track your progress** — keep a notes file (e.g., `notes.md`) with timestamps, commands run, and findings.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| Starting testing before the RoE is signed | Exposes tester to legal liability | Wait for all signatures before running a single scan |
| Assuming verbal scope expansion mid-engagement | Scope changes without documentation are legally unprotected | Get written approval for any scope change |
| No emergency contacts defined | Cannot stop testing quickly if unintended damage occurs | Always include a 24/7 emergency stop contact |
| Ignoring compliance requirements | Client may need specific evidence formats for audit purposes | Review applicable compliance frameworks at scoping |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| TryHackMe | Pentesting Fundamentals | Easy | [Link](https://tryhackme.com/room/pentestingfundamentals) |
| TryHackMe | Red Team Fundamentals | Easy | [Link](https://tryhackme.com/room/redteamfundamentals) |

---

## References

- [NIST SP 800-115 — Technical Guide to Information Security Testing](https://csrc.nist.gov/publications/detail/sp/800-115/final)
- [PTES — Penetration Testing Execution Standard](http://www.pentest-standard.org/)
- [OWASP Testing Guide v4](https://owasp.org/www-project-web-security-testing-guide/)
- CEH v13 Official Courseware — Module 02
- CompTIA PenTest+ PT0-003 Study Guide — Chapter 1

---

*Back to [Repository Root](../README.md)*
