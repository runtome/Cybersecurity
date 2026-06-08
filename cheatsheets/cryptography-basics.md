# Cryptography Basics Cheatsheet

## Encoding (NOT Encryption — No Key)

| Encoding | Identifier | Decode |
|----------|-----------|--------|
| Base64 | Ends in `=` or `==`; a-z A-Z 0-9 +/ | `echo "..." \| base64 -d` |
| Base32 | Uppercase A-Z 2-7, ends in `=` | `echo "..." \| base32 -d` |
| Hex | 0-9 a-f only, even length | `echo "..." \| xxd -r -p` |
| URL encoding | `%XX` format | `python3 -c "import urllib.parse; print(urllib.parse.unquote('...'))"` |
| HTML entities | `&amp;` `&lt;` `&#x41;` | CyberChef |
| ROT13 | Letter-only rotation | `echo "..." \| tr 'A-Za-z' 'N-ZA-Mn-za-m'` |

## Hash Identification

| Length | Algorithm |
|--------|-----------|
| 32 hex | MD5 |
| 40 hex | SHA-1 |
| 56 hex | SHA-224 |
| 64 hex | SHA-256 |
| 96 hex | SHA-384 |
| 128 hex | SHA-512 |
| `$1$` | MD5crypt |
| `$2y$` / `$2b$` | bcrypt |
| `$5$` | SHA-256crypt |
| `$6$` | SHA-512crypt |
| `$y$` | yescrypt |

```bash
# Identify hash type automatically
hash-identifier
hashid "HASH"
```

## Hash Cracking

```bash
# Hashcat — common modes
hashcat -m 0    hash.txt wordlist.txt   # MD5
hashcat -m 100  hash.txt wordlist.txt   # SHA-1
hashcat -m 1400 hash.txt wordlist.txt   # SHA-256
hashcat -m 1800 hash.txt wordlist.txt   # SHA-512crypt
hashcat -m 3200 hash.txt wordlist.txt   # bcrypt
hashcat -m 1000 hash.txt wordlist.txt   # NTLM
hashcat -m 5600 hash.txt wordlist.txt   # NTLMv2
hashcat -m 13100 hash.txt wordlist.txt  # Kerberoast TGS
hashcat -m 18200 hash.txt wordlist.txt  # ASREPRoast

# Rules
hashcat -m 0 hash.txt wordlist.txt -r /usr/share/hashcat/rules/best64.rule

# John the Ripper
john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt
john hash.txt --format=NT --wordlist=wordlist.txt
john --show hash.txt
```

## Symmetric Encryption

| Algorithm | Key Size | Notes |
|-----------|----------|-------|
| AES-128 | 128-bit | Secure if correctly implemented |
| AES-256 | 256-bit | Current standard for sensitive data |
| DES | 56-bit | Broken — do not use |
| 3DES | 112/168-bit | Deprecated; vulnerable to Sweet32 |
| RC4 | Variable | Broken; used in old WEP/WPA |
| Blowfish | 32–448-bit | Legacy; replaced by bcrypt for passwords |

**Block cipher modes:**
- **ECB** — insecure; identical plaintext blocks → identical ciphertext blocks (penguin problem)
- **CBC** — uses IV; more secure; IV must be random and unpredictable
- **CTR** — turns block cipher into stream cipher
- **GCM** — authenticated encryption; preferred for modern protocols

## Asymmetric Encryption

| Algorithm | Key Size | Use Case |
|-----------|----------|----------|
| RSA-2048 | 2048-bit | TLS, email encryption, signatures |
| RSA-4096 | 4096-bit | High-security contexts |
| ECDSA | 256-bit (P-256) | TLS certificates, SSH keys |
| Ed25519 | 256-bit | SSH keys (preferred over RSA) |
| Diffie-Hellman | 2048+ bits | Key exchange in TLS |

## CTF Crypto Quick Hits

```python
# Python — XOR decode
def xor_decode(data, key):
    return bytes(b ^ key for b in data)

# Python — Caesar cipher bruteforce
ciphertext = "KHOOR"
for shift in range(26):
    print(shift, ''.join(chr((ord(c) - shift - 65) % 26 + 65) if c.isalpha() else c for c in ciphertext))
```

```bash
# CyberChef (browser tool) — Swiss Army knife for crypto
# https://gchq.github.io/CyberChef/

# Detect encoding/cipher type
# Try: Magic operation in CyberChef → auto-detects encoding

# Frequency analysis (Caesar/Vigenere)
# dcode.fr — online cipher identifier and solver
```

## Common CTF Cipher Identifiers

| Ciphertext Pattern | Likely Cipher |
|-------------------|---------------|
| Only letters, length multiple of block size | Transposition or Vigenere |
| Numbers separated by spaces, values < 128 | ASCII decimal |
| `.. --- .-.` style | Morse code |
| `01000001` style | Binary |
| Only uppercase A-Z with spaces | Playfair or Polybius |
| All symbols like `+][{` | Brainfuck or Malbolge |
| `-----BEGIN RSA PRIVATE KEY-----` | RSA private key (PEM format) |
