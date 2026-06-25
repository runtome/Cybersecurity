# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## What This Repo Is

A structured, pure-Markdown knowledge base for penetration testing study and CTF competition reference. There is no build system, no code to compile, and no tests to run — all content is `.md` files rendered on GitHub.

---

## Content Architecture

```
module-XX-<topic>/
  README.md          ← primary notes file (always present)
  <topic-name>.md    ← supplementary deep-dives (e.g. google-dorking.md, kali-lab.md)
  images/            ← screenshots referenced in the README

cheatsheets/         ← standalone quick-reference files, no module dependency
ctf-writeups/        ← solved challenge write-ups, one folder per platform (htb/ thm/ picoctf/ other/)
resources/           ← setup guides, wordlists, certification paths, tools index
```

The 10 module folders follow the **CEH v13 / CompTIA PenTest+ PT0-003** curriculum order (01 = ethics/intro → 10 = tools/code analysis). Each module README uses this fixed section order:

> Overview → Key Concepts → Methodology / Process → Tools & Commands → Attack Techniques (Offensive) → Detection & Defence (Defensive) → CTF Tips & Tricks → Common Mistakes → Practice Labs → References

Supplementary files (e.g. `kali-lab.md`) sit inside the module folder and are linked from the README's **Supplementary Files** table and **Practice Labs** table.

---

## Conventions to Follow

### Module README sections

- **Tools & Commands** — each tool gets a `### ToolName` heading with **Purpose:**, **Install:**, and fenced `bash` code blocks.
- **Attack Techniques** — each technique includes a MITRE ATT&CK link in the format `[T1234.001 — Name](https://attack.mitre.org/techniques/T1234/001/)`.
- **Common Mistakes** — always a 3-column table: `| Mistake | Why it matters | Correct approach |`.
- **Practice Labs** — always a 4-column table: `| Platform | Lab / Room Name | Difficulty | Link |`.

### Kali lab files (like `kali-lab.md`)

Each section is numbered (`## 1. Topic`), uses a `### Subsection` for variants (e.g. different tools doing the same job), and includes real terminal output in fenced code blocks immediately below the command that produced it.

### CTF write-ups

Follow `ctf-writeups/template-writeup.md` exactly — frontmatter block, then sections: Summary → Tools Used → Enumeration → Foothold / Initial Access → Privilege Escalation → Flags → Failed Attempts → Lessons Learned → References.

### Images

Referenced as `![Alt text](./images/filename.png)` with an italicised caption on the next line: `*Figure N: description*`. The `images/` directory is module-local.

### Commit message convention

```
add: <topic>         ← new content
update: <topic>      ← editing existing content
fix: <description>   ← broken links, typos, wrong commands
```

---

## Linking Between Files

- Module READMEs link back to repo root: `*Back to [Repository Root](../README.md)*`
- Supplementary files link back to their module: `*Back to [Module XX README](./README.md)*`
- The root `README.md` Module Index table must be kept in sync when new modules or supplementary files are added.
- When adding a supplementary file to a module, update **both** the **Supplementary Files** table and the **Practice Labs** table in that module's README.
