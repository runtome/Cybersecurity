# Wordlists Reference

## Default Kali Wordlists

```bash
# View all available wordlists
ls /usr/share/wordlists/

# Install SecLists (recommended — install once)
sudo apt install seclists
ls /usr/share/wordlists/SecLists/
```

## Most-Used Wordlists

| Wordlist | Path | Use Case |
|----------|------|---------|
| rockyou.txt | `/usr/share/wordlists/rockyou.txt.gz` | Password cracking |
| directory-list-2.3-medium | `/usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt` | Web directory brute force |
| common.txt | `/usr/share/wordlists/SecLists/Discovery/Web-Content/common.txt` | Web directories (fast) |
| subdomains-top1million-5000 | `/usr/share/wordlists/SecLists/Discovery/DNS/subdomains-top1million-5000.txt` | Subdomain enum |
| top-usernames-shortlist | `/usr/share/wordlists/SecLists/Usernames/top-usernames-shortlist.txt` | Username brute force |
| best1050 | `/usr/share/wordlists/metasploit/password.lst` | Quick password spray |

## Extract rockyou.txt

```bash
# Decompress if gzipped
gunzip /usr/share/wordlists/rockyou.txt.gz
wc -l /usr/share/wordlists/rockyou.txt
# 14,344,391 lines
```

## Custom Wordlist Generation

```bash
# CeWL — crawl a website to build a custom wordlist
cewl -d 2 -m 5 -w custom_wordlist.txt http://target.com
cewl -d 3 -m 5 --with-numbers -w custom.txt http://target.com

# crunch — generate wordlists by pattern
crunch 8 8 0123456789 -o numeric_8char.txt
crunch 6 8 abcdefghijklmnopqrstuvwxyz -o alpha.txt
crunch 8 8 -t @@@@1234  # 4 lowercase letters + 1234

# Hashcat rule-based mutations
# Apply best64 rule to rockyou for mangled passwords
hashcat --stdout -r /usr/share/hashcat/rules/best64.rule wordlist.txt > mutated_wordlist.txt

# Combine two wordlists
hashcat --stdout -a 1 wordlist1.txt wordlist2.txt > combined.txt
```

## Username Wordlists

```bash
# Generate username permutations from a name list
# Given: first.txt (firstnames), last.txt (lastnames)
# Output formats: firstname.lastname, f.lastname, flastname, etc.

# Using username-anarchy
ruby username-anarchy -f /usr/share/wordlists/names/firstnames.txt John Smith

# Using namemash.py
python3 namemash.py names.txt > usernames.txt
```

## Targeted Password Lists

```bash
# OSINT-based: include company name, domain, year, season
# Example base words: Company2024, Company@2024, company123

# cupp — interactive common user password profiler
cupp -i   # interactive mode — enter target personal info
cupp -l   # download wordlists from repository

# Example output: john1990, John1990!, j.smith@company
```

## Online Wordlist Sources

- [SecLists](https://github.com/danielmiessler/SecLists) — Most comprehensive collection
- [CrackStation](https://crackstation.net/crackstation-wordlist-password-cracking-dictionary.htm) — 1.5 billion password list
- [WeakPass](https://weakpass.com/) — Aggregated password lists
- [Kaonashi](https://github.com/kaonashi-passwords/Kaonashi) — Rules and wordlists for hashcat
