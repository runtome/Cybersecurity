# Google Dorking — Advanced Search Techniques

> **Module:** [03 — Information Gathering and Vulnerability Scanning](./)
> **Technique type:** Passive Reconnaissance (OSINT)
> **Source reference:** [rbcafe.com — Great List of 4,448 Google Dorks](https://www.rbcafe.com/security/google-dorking-great-list-4448-google-dorking/)

> **Legal reminder:** Google Dorking itself is passive and legal — it only reads publicly indexed data. Using a dork to access a system you are not authorised to test may still constitute unauthorised access under the CFAA. Always have written permission before acting on any dork finding.

---

## Table of Contents

- [Operator Reference](#operator-reference)
- [Directory Listings](#directory-listings)
- [Login and Admin Panels](#login-and-admin-panels)
- [Configuration and Credential Files](#configuration-and-credential-files)
- [Database Exposures](#database-exposures)
- [Log Files](#log-files)
- [Backup Files](#backup-files)
- [Private Keys and Certificates](#private-keys-and-certificates)
- [CMS-Specific Dorks](#cms-specific-dorks)
- [Network Devices and Cameras](#network-devices-and-cameras)
- [Error Messages and Stack Traces](#error-messages-and-stack-traces)
- [Version and Software Fingerprinting](#version-and-software-fingerprinting)
- [File Type Quick Reference](#file-type-quick-reference)
- [Combining Dorks — Compound Queries](#combining-dorks--compound-queries)
- [CTF and Bug Bounty Tips](#ctf-and-bug-bounty-tips)

---

## Operator Reference

| Operator | Syntax | Purpose | Example |
|----------|--------|---------|---------|
| `site:` | `site:example.com` | Restrict results to a domain | `site:example.com filetype:pdf` |
| `filetype:` / `ext:` | `filetype:sql` | Find specific file extensions | `filetype:log password` |
| `intitle:` | `intitle:"login"` | Search page `<title>` tag | `intitle:"admin panel"` |
| `allintitle:` | `allintitle:admin login` | All words must be in title | `allintitle:index of backup` |
| `inurl:` | `inurl:wp-admin` | Search URL string | `inurl:config.php` |
| `allinurl:` | `allinurl:admin login` | All words must be in URL | `allinurl:cgi-bin admin` |
| `intext:` | `intext:"powered by"` | Search visible page body text | `intext:"sql syntax"` |
| `allintext:` | `allintext:username password` | All words in page body | `allintext:username password email` |
| `cache:` | `cache:example.com` | Google's cached copy of the page | `cache:example.com/admin` |
| `link:` | `link:example.com` | Pages that link to a URL | — |
| `-` (minus) | `-site:example.com` | Exclude results | `filetype:sql -site:github.com` |
| `" "` (quotes) | `"exact phrase"` | Exact string match | `"Index of /etc"` |
| `*` | `"php * error"` | Wildcard — any word | `"powered by * cms"` |
| `\|` | `password \| passwd` | Boolean OR | `intext:password \| passwd \| pwd` |
| `..` | `2020..2024` | Number range | — |

---

## Directory Listings

Exposed directory listings reveal file structure, configuration files, backups, and source code.

```
intitle:"index of"
intitle:"Index of /"
intitle:"Index of" "parent directory"
intitle:"Index of" ".htpasswd"
intitle:"Index of" "backup"
intitle:"Index of" "config"
intitle:"Index of" ".git"
intitle:"Index of" "password"
intitle:"Index of" "private"
intitle:"Index of" "id_rsa"
intitle:"Index of" ".env"
intitle:"Index of" "database"
intitle:"Index of /backup"
intitle:"Index of /db"
intitle:"Index of /conf"
intitle:"Index of /admin"
intitle:"Index of /logs"
intitle:"Index of /uploads"
intitle:"Index of /secret"
intitle:"Index of" site:example.com
".git" intitle:"Index of"
"index of" "last modified" "parent directory" filetype:sql
"index of" "last modified" "parent directory" filetype:env
```

---

## Login and Admin Panels

```
intitle:"admin login"
intitle:"administrator login"
intitle:"login" inurl:admin
intitle:"login page"
intitle:"Control Panel"
inurl:"/admin/login"
inurl:"/admin/index.php"
inurl:"/administrator/"
inurl:"/wp-admin"
inurl:"/wp-login.php"
inurl:"/user/login"
inurl:"/login.php"
inurl:"/signin"
inurl:"/panel"
inurl:"/cpanel"
inurl:"/phpmyadmin"
inurl:"/webmail"
"Joomla! Administration Login" inurl:"/index.php"
intitle:"phpMyAdmin" "Welcome to phpMyAdmin"
"Welcome to phpMyAdmin" " Create new database"
intitle:"Plesk" inurl:"/login_up.php"
intitle:"cPanel" inurl:":2082"
intitle:"WHM" inurl:":2086"
intitle:"Webmin" inurl:":10000"
intitle:"Grafana" inurl:"/login"
intitle:"Jenkins" inurl:"/login"
intitle:"GitLab" inurl:"/users/sign_in"
```

---

## Configuration and Credential Files

### .env and Config Files

```
filetype:env "DB_PASSWORD"
filetype:env "APP_SECRET"
filetype:env "AWS_SECRET"
filetype:env intext:password
inurl:".env" intext:"DB_PASSWORD"
inurl:".env" intext:"APP_KEY"
filetype:conf intext:password
filetype:conf intext:"password ="
filetype:ini intext:password
filetype:cfg intext:password
filetype:yaml intext:password
filetype:yml intext:password
filetype:toml intext:password
filetype:properties intext:password
ext:conf inurl:"httpd.conf"
ext:conf inurl:"nginx.conf"
ext:xml inurl:"config"
"define('DB_PASSWORD'" filetype:php
"define('DB_USER'" filetype:php
filetype:inc intext:mysql_connect
```

### Exposed Credential Files

```
"# -FrontPage-" ext:pwd
"# -FrontPage-" inurl:service.pwd
filetype:pwd inurl:service
intitle:"Index of" ".htpasswd"
inurl:".htpasswd" filetype:htpasswd
filetype:htpasswd htpasswd
inurl:passwords.txt
inurl:passwd.txt
filetype:txt intext:password
allintext:username password email filetype:txt
ext:txt intext:"username" intext:"password"
```

---

## Database Exposures

### SQL Dumps

```
"# phpMyAdmin MySQL-Dump" filetype:txt
"# phpMyAdmin MySQL-Dump" filetype:sql
filetype:sql "password" | "passwd" | "pass"
filetype:sql intext:username intext:password
filetype:sql "INSERT INTO" "VALUES"
ext:sql intext:password | pass | passwd
ext:sql "CREATE TABLE"
ext:sql "-- phpMyAdmin SQL Dump"
filetype:mdb inurl:"/db/"
filetype:mdb inurl:"accounts"
filetype:mdb inurl:"users"
"phpMyAdmin" "running on" inurl:"/phpmyadmin/main.php"
inurl:mysql filetype:conf intext:password
```

### MongoDB / NoSQL / Redis

```
intitle:"MongoDB Statistics" inurl:_status
inurl:":27017" intitle:"MongoDB"
inurl:":6379" "redis_version"
inurl:":9200" intitle:"Elastic"
intitle:"Elasticsearch" inurl:":9200/_cat"
```

---

## Log Files

Log files frequently contain stack traces, paths, credentials, session tokens, and API keys.

```
filetype:log "PHP Parse error"
filetype:log "PHP Warning"
filetype:log "Fatal error"
filetype:log intext:password
filetype:log intext:"username"
filetype:log intext:"SQL syntax"
filetype:log intext:"mysql_connect"
ext:log inurl:"access.log"
ext:log inurl:"error.log"
ext:log inurl:"debug.log"
ext:log inurl:"application.log"
intitle:"Index of" "access.log"
intitle:"Index of" "error.log"
filetype:log "ConnectionString"
filetype:log "Authorization: Bearer"
filetype:log "api_key"
filetype:log "AWS_ACCESS_KEY"
```

---

## Backup Files

```
intitle:"Index of" "*.bak"
intitle:"Index of" "*.old"
intitle:"Index of" "*.backup"
ext:bak inurl:"config"
ext:bak inurl:"database"
ext:old inurl:"config"
ext:backup inurl:"sql"
filetype:bak inurl:"wp-config"
filetype:bak inurl:"web.config"
filetype:bak inurl:"settings"
"~" filetype:php
filetype:php.bak
filetype:sql.bak
intitle:"Index of" "dump.sql"
intitle:"Index of" "backup.zip"
intitle:"Index of" "site.tar.gz"
```

---

## Private Keys and Certificates

```
"BEGIN RSA PRIVATE KEY" filetype:key -github
"BEGIN DSA PRIVATE KEY" filetype:key -github
"BEGIN EC PRIVATE KEY" filetype:key -github
"BEGIN OPENSSH PRIVATE KEY" filetype:key -github
"BEGIN CERTIFICATE" filetype:pem
filetype:pem intext:"PRIVATE KEY"
filetype:ppk intext:"PRIVATE KEY"
ext:key intext:"-----BEGIN"
inurl:"id_rsa" filetype:key
inurl:".ssh/id_rsa"
intitle:"Index of" "id_rsa"
intitle:"Index of" ".ssh"
filetype:key inurl:ssl
```

---

## CMS-Specific Dorks

### WordPress

```
inurl:"/wp-content/"
inurl:"/wp-includes/"
inurl:"/wp-login.php"
inurl:"/wp-admin/"
inurl:"/wp-config.php" filetype:txt
"wp-config.php" inurl:"/wp-content/backup"
inurl:"/xmlrpc.php"
intext:"Powered by WordPress" inurl:"/wp-admin"
filetype:sql intext:"wp_users" intext:"user_pass"
intitle:"WordPress" inurl:"/wp-admin/install.php"
```

### Joomla

```
inurl:"/administrator/"
"Joomla! Administration Login" inurl:"/index.php"
intext:"Powered by Joomla"
filetype:sql intext:"jos_users"
inurl:"/configuration.php.bak"
```

### Drupal

```
inurl:"/user/login"
intext:"Powered by Drupal"
intitle:"Drupal" inurl:"/install.php"
inurl:"/sites/default/settings.php"
filetype:php inurl:"/sites/default/files/"
```

### phpMyAdmin

```
intitle:"phpMyAdmin" "Welcome to phpMyAdmin"
inurl:"/phpmyadmin/main.php"
inurl:"/phpmyadmin/index.php"
"phpMyAdmin" inurl:"/phpmyadmin/" -demo -examples
```

### Other CMS / Frameworks

```
intext:"Powered by vBulletin"
intext:"Powered by SMF"
intext:"Powered by MyBB"
intext:"Powered by PHPBB"
intitle:"Magento" inurl:"/admin"
intitle:"PrestaShop" inurl:"/admin"
intitle:"OpenCart" inurl:"/admin"
allintext:"Powered by LionMax Software"
```

---

## Network Devices and Cameras

### Routers and Firewalls

```
intitle:"Router" inurl:"/cgi-bin"
intitle:"ADSL Configuration page"
intitle:"D-Link" inurl:"/login.cgi"
intitle:"Netgear" inurl:"/login"
intitle:"pfSense" inurl:"/index.php"
intitle:"FortiGate" inurl:"/login"
intitle:"Cisco" "IOS" inurl:"/exec/show"
inurl:"/HNAP1/"
inurl:"/cgi-bin/webcm"
```

### IP Cameras and Webcams

```
intitle:"Live View / - AXIS"
intitle:"Network Camera" inurl:"/view.shtml"
intitle:"WJ-NT104" inurl:"/login.htm"
inurl:"/view/index.shtml"
inurl:"/mjpg/video.mjpg"
inurl:":8080/video.mjpg"
intitle:"IP Camera" "Enter Password"
intitle:"Hikvision" inurl:"/login"
intitle:"Dahua" inurl:"/login"
```

### SCADA / Industrial

```
intitle:"SCADA" inurl:"/login"
intitle:"Modbus" inurl:"/login"
intitle:"PLC" inurl:"/status"
intitle:"HMI" inurl:"/login"
```

---

## Error Messages and Stack Traces

Error messages leak software versions, file paths, and database structure.

```
intext:"SQL syntax" intext:"mysql_num_rows"
intext:"You have an error in your SQL syntax"
intext:"Warning: mysql_connect()"
intext:"ORA-00933: SQL command not properly ended"
intext:"Microsoft OLE DB Provider for SQL Server"
intext:"PostgreSQL query failed"
intext:"Warning: pg_connect()"
intext:"Fatal error" "on line"
intext:"Parse error" "on line"
intext:"Stack Trace" filetype:log
intext:"Traceback (most recent call last)"
intext:"Exception in thread" filetype:log
intext:"DEBUG=True" filetype:txt
intext:"SQLSTATE" intext:"error"
intext:"[ODBC SQL Server Driver]"
```

---

## Version and Software Fingerprinting

Identify specific software versions to search for matching CVEs.

```
intitle:"Apache Tomcat" intext:"version"
intitle:"Apache2 Ubuntu Default Page"
intitle:"Welcome to nginx"
intitle:"IIS Windows Server"
intext:"Microsoft-IIS" filetype:htm
intext:"Apache/2.2" "Server at"
intext:"Apache/2.4" "Server at"
intext:"PHP/7" "Server at"
intext:"PHP/5" "Server at"
intext:"OpenSSH" intext:"Ubuntu"
intext:"Drupal 7" "powered by"
intext:"WordPress 5." "powered by"
intext:"Joomla 3." "powered by"
intext:"ASP.NET" intext:"version"
intext:"struts" filetype:xml
intext:"spring boot" filetype:properties
```

---

## File Type Quick Reference

| Extension | `filetype:` / `ext:` query | What it may expose |
|-----------|--------------------------|-------------------|
| `.sql` | `filetype:sql password` | Database dumps with credentials |
| `.env` | `filetype:env DB_PASSWORD` | App secrets, API keys, DB credentials |
| `.log` | `filetype:log username` | Error logs with paths and credentials |
| `.bak` | `ext:bak config` | Backup copies of config files |
| `.conf` | `filetype:conf password` | Server and app configuration |
| `.ini` | `filetype:ini password` | PHP and app configuration |
| `.key` | `filetype:key BEGIN` | Private key files |
| `.pem` | `filetype:pem PRIVATE` | SSL/TLS private keys |
| `.csv` | `filetype:csv email password` | Data exports with user records |
| `.xml` | `filetype:xml ConnectionString` | App config with DB strings |
| `.yaml` | `filetype:yaml password` | DevOps config (Docker, k8s) |
| `.sh` | `filetype:sh password` | Shell scripts with hardcoded creds |
| `.py` | `filetype:py password` | Python scripts with hardcoded creds |
| `.pcf` | `ext:pcf enc_UserPassword` | Cisco VPN profiles |
| `.mdb` | `filetype:mdb users` | Microsoft Access database files |
| `.htpasswd` | `filetype:htpasswd htpasswd` | Apache password files |
| `.pwd` | `ext:pwd FrontPage` | FrontPage server extension passwords |

---

## Combining Dorks — Compound Queries

Chain operators to narrow results to a specific organisation or technology stack.

```bash
# Find exposed .env files for a specific domain
site:example.com filetype:env

# Find admin login pages for a specific organisation
site:example.com intitle:"admin login"

# Find SQL dumps excluding GitHub (too noisy)
filetype:sql intext:password -site:github.com -site:gist.github.com

# Find exposed phpMyAdmin instances on a specific TLD
intitle:"Welcome to phpMyAdmin" site:.th

# Find WordPress wp-config.php backups
site:example.com inurl:"wp-config" filetype:txt

# Find Apache Tomcat management consoles
intitle:"Apache Tomcat" inurl:"/manager/html"

# Find exposed AWS credentials in config files
filetype:yml "aws_secret_access_key"
filetype:json "aws_secret_access_key"

# Find Git repositories exposed via HTTP
intitle:"Index of /.git" "config"

# Find debug endpoints left enabled in production
inurl:"/debug" site:example.com
inurl:"/__debug__" site:example.com
inurl:"/actuator" site:example.com    # Spring Boot
inurl:"/api/debug" site:example.com
```

---

## CTF and Bug Bounty Tips

- **Scope first:** Always run `site:example.com` before anything else to map what's indexed for the target.
- **Certificate Transparency + dorks:** After finding subdomains via `crt.sh`, use `site:subdomain.example.com filetype:env` to check each one.
- **-site:github.com:** Add this exclusion to nearly every credential dork — GitHub results are almost always already-revoked test data.
- **Google Cache:** If a sensitive page has since been taken down, `cache:example.com/secret` may still show the cached version.
- **Shodan + dorks:** Combine results — dork for the hostname, then look it up in Shodan for open ports and banners.
- **Bug bounty recon:** `site:*.example.com` (note the wildcard) enumerates subdomains that are indexed by Google — often faster than brute force for finding forgotten dev/staging instances.
- **Automation:** Use tools like `dorkbot` or `pagodo` to run dork lists programmatically against a target scope without manual querying.

```bash
# pagodo — automated Google dorking (respects rate limits)
git clone https://github.com/opsdisk/pagodo
cd pagodo
python3 pagodo.py -d example.com -g dorks.txt -l 50 -s -e 35.0 -j 1.1
```

---

## Defensive Notes

- **Google Search Console:** Monitor what Google has indexed for your domain — check for inadvertently indexed sensitive files.
- **robots.txt:** Add rules to block indexing of admin, config, and backup directories (though this is security-through-obscurity, not a real control).
- **Remove sensitive files from web root:** Configuration, backup, and log files should never be in a publicly accessible directory.
- **`.htaccess` / nginx deny rules:** Block direct access to file types that should never be served (`*.sql`, `*.bak`, `*.log`, `.env`, `.git`).

```nginx
# nginx — block sensitive file types
location ~* \.(sql|bak|log|env|key|pem|cfg|ini|yaml|yml)$ {
    deny all;
    return 404;
}

# Block .git directory
location ~ /\.git {
    deny all;
}
```

```apache
# Apache — .htaccess
<FilesMatch "\.(sql|bak|log|env|key|pem|cfg|ini|yaml|yml)$">
    Order allow,deny
    Deny from all
</FilesMatch>

<DirectoryMatch "\.git">
    Order allow,deny
    Deny from all
</DirectoryMatch>
```

---

## References

- [rbcafe.com — Great List of 4,448 Google Dorks](https://www.rbcafe.com/security/google-dorking-great-list-4448-google-dorking/)
- [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database) — Exploit-DB's searchable dork database
- [OSINT Framework — Google Dorking](https://osintframework.com/)
- [pagodo — automated Google dorking](https://github.com/opsdisk/pagodo)

---

*Back to [Module 03 — Information Gathering](./)*
