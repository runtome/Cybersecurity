# Certifications Study Paths

## Overview

| Certification | Issuer | Level | Focus | Cost (USD) |
|---------------|--------|-------|-------|-----------|
| eJPT | INE / eLearnSecurity | Entry | Pentesting basics | ~$200 |
| CompTIA PenTest+ | CompTIA | Intermediate | Pentesting methodology | ~$400 |
| CEH (Certified Ethical Hacker) | EC-Council | Intermediate | Ethical hacking concepts | ~$1,200 |
| PNPT | TCM Security | Intermediate | Practical network pentest | ~$400 |
| OSCP | Offensive Security | Advanced | Practical exploitation | ~$1,499 |
| OSED | Offensive Security | Advanced | Windows exploit dev | ~$1,499 |
| CRTP | Altered Security | Advanced | Active Directory attacks | ~$300 |

---

## eJPT — eLearnSecurity Junior Penetration Tester

**Why it matters:** Best entry-level certification for hands-on pentesting. All exam is practical.

**Study resources:**
- [INE Free Starter Pass](https://ine.com/) — covers the full eJPT course
- TryHackMe — Pre-Security and Jr Penetration Tester learning paths
- TCM Security — Practical Ethical Hacking course

**Key topics:** Nmap, Metasploit, web app basics, network attacks, report writing

---

## CompTIA PenTest+ (PT0-003)

**Why it matters:** Vendor-neutral, DoD-approved, covers full pentest lifecycle including reporting.

**Exam:** 85 multiple-choice + performance-based questions, 165 minutes, passing score 750/900

**Study resources:**
- CompTIA Official Study Guide (Mike Chapple / David Seidl)
- Professor Messer — free PT0-003 study notes
- Jason Dion Udemy course
- TryHackMe — PenTest+ learning path

**Key domains:**
1. Planning and Scoping (15%)
2. Information Gathering and Vulnerability Scanning (20%)
3. Attacks and Exploits (35%)
4. Reporting and Communication (20%)
5. Tools and Code Analysis (10%)

---

## CEH v13 — Certified Ethical Hacker

**Why it matters:** Widely recognised in enterprise/government sectors. Knowledge-heavy, less hands-on than OSCP.

**Exam:** 125 multiple-choice questions, 4 hours, passing score 60-85% (varies by form)

**Study resources:**
- EC-Council Official Courseware (20 modules)
- Matt Walker — CEH All-in-One Exam Guide
- Darril Gibson — CEH Certified Ethical Hacker Study Guide

**Key modules:** Footprinting, Scanning, Enumeration, Vulnerability Analysis, System Hacking, Malware, Sniffing, Social Engineering, DoS, Session Hijacking, Evading IDS/Firewalls, Web Server Attacks, SQL Injection, Wireless, Mobile, IoT, Cloud, Cryptography

---

## PNPT — Practical Network Penetration Tester

**Why it matters:** Fully practical exam — 5 days to compromise an AD environment, 2 days to write a report. Great OSCP stepping stone.

**Study resources:**
- [TCM Security Academy](https://academy.tcm-sec.com/) — Practical Ethical Hacking course (Heath Adams)
- Active Directory attacks lab
- TryHackMe — AD rooms (HackPark, AttacktiveDirectory)

**Key topics:** Active Directory attacks, Kerberoasting, BloodHound, internal network pentest, report writing

---

## OSCP — Offensive Security Certified Professional

**Why it matters:** The gold standard for practical penetration testing. 24-hour exam: compromise multiple machines and write a report.

**Prerequisites:** Strong foundation in Linux, networking, web apps, and scripting.

**Study resources:**
- [PEN-200 Course](https://www.offensive-security.com/pwk-oscp/) — included with exam
- [HackTheBox](https://www.hackthebox.com/) — practise with Easy/Medium machines
- TJ Null's OSCP machine list (HackTheBox + VulnHub)
- IppSec YouTube channel — HackTheBox video walkthroughs
- [The Cyber Mentor](https://www.thecybermentor.com/) — Practical AD course

**Tip: OSCP Prep Machine List (TJ Null)**

Focus on these HackTheBox machines: Lame, Legacy, Devel, Grandpa, Granny, Blue, Jerry, Bounty, Bastard, Arctic, Optimum, Beep, Cronos, Nineveh, Solidstate, Node, Valentine, Poison, Sunday, Tartarsauce.

---

## CRTP — Certified Red Team Professional

**Why it matters:** Deep focus on Active Directory attack techniques — best cert for AD pentesting.

**Study resources:**
- [Altered Security CRTP Course](https://www.alteredsecurity.com/adlab)
- PowerView, BloodHound, Rubeus, Mimikatz, Impacket
- HackTheBox — Forest, Active, Sauna, Cascade

**Key topics:** AD enumeration, Kerberoasting, ASREPRoasting, DCSync, Pass-the-Hash, Pass-the-Ticket, Silver/Golden tickets, forest trusts

---

## Study Tips

- **Labs over theory:** Spend 70% of time in hands-on labs, 30% on reading.
- **Build a notes system:** Use this repository structure — active recall from your own notes beats re-reading.
- **Track progress:** Use TryHackMe learning paths or HackTheBox career tracks as progress metrics.
- **Write-ups:** Write a brief write-up for every machine you compromise — it cements the learning.
- **Stay consistent:** 1–2 hours per day beats an occasional 8-hour session.
