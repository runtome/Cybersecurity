# [Machine / Challenge Name]

**Platform:** HackTheBox / TryHackMe / picoCTF / Other
**Category:** Pwn / Web / Crypto / Forensics / Rev / Misc / Machine
**Difficulty:** Easy / Medium / Hard / Insane
**OS:** Linux / Windows / N/A
**Date Solved:** YYYY-MM-DD
**Points:** XXX

---

## Summary

<!-- 2-3 sentences: what was the challenge, what was the intended path, what key technique was required -->

---

## Tools Used

- Tool 1 — purpose
- Tool 2 — purpose

---

## Enumeration

### Port Scan

```bash
nmap -sV -sC -p- -oA nmap/initial TARGET_IP
```

```
# Paste key nmap output here
```

### Service Enumeration

<!-- Document each interesting service found -->

**HTTP (Port 80):**

```bash
gobuster dir -u http://TARGET_IP -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
```

![HTTP homepage](./images/http-homepage.png)
*Figure 1: Homepage of the web application*

---

## Foothold / Initial Access

<!-- Describe the vulnerability and how you identified it -->

**Vulnerability:** [e.g., SQL Injection in /login endpoint]

**Proof of concept:**

```bash
# Command used to gain initial access
```

![Initial shell](./images/initial-shell.png)
*Figure 2: Initial shell obtained as user www-data*

---

## Privilege Escalation

### Enumeration

```bash
sudo -l
find / -perm -4000 2>/dev/null
```

### Exploitation

<!-- Describe the privesc vector and steps -->

```bash
# Commands used to escalate
```

![Root shell](./images/root-shell.png)
*Figure 3: Root shell achieved*

---

## Flags

**User Flag:**

```
[paste flag here or describe location]
```

![User flag](./images/user-flag.png)
*Figure 4: User flag at /home/username/user.txt*

**Root Flag:**

```
[paste flag here or describe location]
```

![Root flag](./images/root-flag.png)
*Figure 5: Root flag at /root/root.txt*

---

## Failed Attempts

<!-- This section is important — document what you tried and why it didn't work -->

- **[Attempt 1]:** Tried X because Y, but it failed because Z.
- **[Attempt 2]:** Tried to exploit A, but the binary had ASLR enabled.

---

## Lessons Learned

<!-- What did you learn from this machine? What would you do differently next time? -->

1. Always check for [X] when you see [Y service].
2. [Tool/technique] is faster for this type of challenge than [other approach].
3. The key insight was [non-obvious thing].

---

## References

- [Link to CVE or technique](URL) — description
- [Tool documentation](URL) — description

---

*Back to [Write-Ups Index](../)*
