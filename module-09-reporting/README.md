# Module 09: Reporting and Communication

> **Curriculum alignment:** CEH v13 Domain 18 / CompTIA PenTest+ PT0-003 — Domain 5.0 Reporting and Communication
> **Difficulty:** Beginner–Intermediate
> **Estimated study time:** 3 hours

---

## Overview

A penetration test is only as valuable as the report it produces. This module covers how to structure professional pentest reports, write clear executive summaries for non-technical stakeholders, score findings using CVSS, provide actionable remediation guidance, and communicate findings effectively. Poor reporting wastes the technical work done during the assessment.

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

### Report Types

| Report Type | Audience | Content |
|-------------|----------|---------|
| Executive Summary | C-suite, board, non-technical | Business risk, overall posture, top findings in plain language |
| Technical Report | Security team, developers, IT | Detailed findings, evidence, reproduction steps, remediation |
| Remediation Report | IT / Dev teams | Prioritised fix list with technical instructions |
| Attestation / Compliance Report | Auditors | Evidence that testing was performed per a compliance standard |

### CVSS v3.1 Scoring

**Base Score Metrics:**

| Metric | Options |
|--------|---------|
| Attack Vector (AV) | Network (N), Adjacent (A), Local (L), Physical (P) |
| Attack Complexity (AC) | Low (L), High (H) |
| Privileges Required (PR) | None (N), Low (L), High (H) |
| User Interaction (UI) | None (N), Required (R) |
| Scope (S) | Unchanged (U), Changed (C) |
| Confidentiality (C) | None (N), Low (L), High (H) |
| Integrity (I) | None (N), Low (L), High (H) |
| Availability (A) | None (N), Low (L), High (H) |

**Score ranges:**

| Score | Severity | Action |
|-------|----------|--------|
| 9.0–10.0 | Critical | Emergency patch within 24–48 hours |
| 7.0–8.9 | High | Remediate within 7–30 days |
| 4.0–6.9 | Medium | Remediate within 90 days |
| 0.1–3.9 | Low | Address in next maintenance cycle |
| 0.0 | Informational | No immediate action required |

### Finding Severity vs Risk Rating

CVSS scores the vulnerability in isolation. Risk rating accounts for:
- **Likelihood** — How exploitable is this in your specific environment?
- **Impact** — What is the business impact if exploited (data loss, downtime, reputation)?
- **Context** — Is sensitive data at risk? Is the system internet-facing?

A CVSS 7.5 (High) vulnerability on an isolated internal test server may have lower **risk** than a CVSS 5.0 (Medium) vulnerability on the public login page of an e-commerce platform.

---

## Methodology / Process

1. **During testing** — take notes continuously; screenshot every finding with evidence
2. **Draft findings** — write each finding immediately after discovery while memory is fresh
3. **Validate** — double-check all findings; remove false positives before reporting
4. **CVSS scoring** — assign base scores for each finding
5. **Risk rating** — contextualise CVSS score with business impact
6. **Remediation guidance** — provide specific, actionable steps to fix each finding
7. **Write executive summary** — translate technical findings into business language
8. **Peer review** — have another person review the report before delivery
9. **Debrief call** — walk the client through findings verbally before sending the written report

![Report Structure](./images/report-structure.png)
*Figure 1: Penetration test report structure*

---

## Tools & Commands

### Note-Taking During Engagement

```bash
# Keep a timestamped log of all commands run
script -a pentest_log.txt
# All terminal output is now recorded

# Create a structured notes file
mkdir -p ~/engagement/notes
touch ~/engagement/notes/recon.md
touch ~/engagement/notes/exploitation.md
touch ~/engagement/notes/postexploit.md

# Screenshot tool for evidence capture (Kali)
scrot ~/engagement/evidence/screenshot_$(date +%Y%m%d_%H%M%S).png
```

---

### Pwndoc / PlexTrac / Dradis

**Purpose:** Pentest report management platforms
- **Pwndoc:** Self-hosted, open-source — [GitHub](https://github.com/pwndoc/pwndoc)
- **Dradis:** Collaboration and report generation — [dradisframework.com](https://dradisframework.com/)
- **PlexTrac:** Commercial platform — centralised finding management

---

## Attack Techniques (Offensive)

This module is primarily about documentation and communication. The "offensive" perspective here is on demonstrating impact clearly in the report.

### Technique 1: Demonstrating Full Attack Chain

**Description:** Link multiple findings together into a complete attack narrative showing how a real attacker could go from no access to full domain compromise. This is the most persuasive content in any pentest report.

**Example attack chain narrative:**

```
1. Passive OSINT identified a credential in a public GitHub repository (Medium)
2. Credential used to authenticate to the VPN (Informational — valid credential)
3. Internal network access revealed an unpatched SMB service (Critical — MS17-010)
4. MS17-010 exploited to gain SYSTEM on a domain member server (Critical)
5. Mimikatz extracted domain admin credentials from LSASS memory (Critical)
6. DCSync performed — full Active Directory hash dump (Critical)

Impact: Complete domain compromise from a single GitHub credential leak.
Remediation: Rotate all credentials, patch SMB, implement secret scanning in CI/CD.
```

---

## Detection & Defence (Defensive)

### Report Quality Controls

**Common reporting pitfalls and how to avoid them:**

| Issue | Problem | Fix |
|-------|---------|-----|
| Vague finding title | "SQL Injection found" tells the reader nothing | "Unauthenticated SQL Injection in /search Parameter Allows Full Database Extraction" |
| Missing reproduction steps | Developers cannot verify or reproduce the finding | Include exact request/response, tool commands, and screenshots |
| Generic remediation | "Sanitise inputs" is not actionable | Provide specific code examples, library references, or configuration changes |
| No business context | Technical findings are dismissed by management | Quantify impact: "attacker could access 50,000 customer records" |
| No re-test guidance | Client doesn't know if their fix worked | Specify exactly what to change and how to verify the fix |

---

## CTF Tips & Tricks

- **Document as you go:** In CTF write-ups, take screenshots of every flag and key step. Reconstructing a solve from memory is error-prone.
- **Write-up structure:** Use the template in `ctf-writeups/template-writeup.md` — it covers all required sections for a publishable write-up.
- **Include failed attempts:** Good write-ups document what didn't work and why — this helps other learners.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| Sending the report without a debrief call | Client may misunderstand findings or priorities | Always schedule a verbal walkthrough before or alongside written delivery |
| CVSS as the only risk metric | Doesn't account for business context | Always include a contextual risk rating alongside CVSS |
| Vague remediation guidance | Developers cannot fix what they cannot understand | Write specific, tested remediation steps; link to official documentation |
| Not redacting sensitive data in evidence | Report may contain passwords or PII that should not be in a document | Review all screenshots and command output before including in the report |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| TryHackMe | Writing Effective CVEs | Easy | [Link](https://tryhackme.com) |
| Pwndoc | Self-hosted report tool | — | [Link](https://github.com/pwndoc/pwndoc) |

---

## References

- [CVSS v3.1 Calculator](https://www.first.org/cvss/calculator/3.1) — Official CVSS scoring tool
- [PTES Technical Guidelines](http://www.pentest-standard.org/index.php/Reporting) — Reporting section
- [TCM Security Sample Report](https://github.com/hmaverickadams/TCM-Security-Sample-Pentest-Report) — Free sample pentest report template
- [NVD CVSS Documentation](https://nvd.nist.gov/vuln-metrics/cvss) — NIST scoring guidance
- CEH v13 Official Courseware — Module 18
- CompTIA PenTest+ PT0-003 Study Guide — Chapter 9

---

*Back to [Repository Root](../README.md)*
