# Networking Basics Cheatsheet

## OSI Model

| Layer | Name | Protocols / Examples |
|-------|------|---------------------|
| 7 | Application | HTTP, HTTPS, FTP, SMTP, DNS, SSH |
| 6 | Presentation | TLS/SSL, JPEG, ASCII encoding |
| 5 | Session | NetBIOS, RPC, NFS |
| 4 | Transport | TCP, UDP |
| 3 | Network | IP, ICMP, ARP |
| 2 | Data Link | Ethernet, 802.11 (Wi-Fi), MAC addresses |
| 1 | Physical | Cables, radio waves, electrical signals |

## TCP vs UDP

| Feature | TCP | UDP |
|---------|-----|-----|
| Connection | Connection-oriented (3-way handshake) | Connectionless |
| Reliability | Guaranteed delivery, ordering, error checking | Best effort |
| Speed | Slower | Faster |
| Use cases | HTTP, SSH, FTP, SMTP | DNS, SNMP, TFTP, VoIP, gaming |

## TCP 3-Way Handshake

```
Client → SYN     → Server
Client ← SYN-ACK ← Server
Client → ACK     → Server
```

## IP Addressing

### IPv4 Classes (historic, CIDR is now used)

| Class | Range | Default Subnet |
|-------|-------|----------------|
| A | 1.0.0.0 – 126.255.255.255 | /8 |
| B | 128.0.0.0 – 191.255.255.255 | /16 |
| C | 192.0.0.0 – 223.255.255.255 | /24 |

### Private IP Ranges (RFC 1918)

```
10.0.0.0    – 10.255.255.255    (/8)
172.16.0.0  – 172.31.255.255   (/12)
192.168.0.0 – 192.168.255.255  (/16)
127.0.0.1   – loopback
169.254.0.0 – APIPA / link-local
```

### CIDR Quick Reference

| CIDR | Subnet Mask | Hosts |
|------|-------------|-------|
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /29 | 255.255.255.248 | 6 |
| /30 | 255.255.255.252 | 2 |

## DNS Record Types

| Record | Purpose |
|--------|---------|
| A | Hostname → IPv4 |
| AAAA | Hostname → IPv6 |
| MX | Mail server |
| NS | Name server |
| CNAME | Alias |
| TXT | SPF, DKIM, domain verification |
| PTR | Reverse DNS (IP → hostname) |
| SOA | Zone authority |

## Network Commands (Quick Reference)

```bash
# Interface info
ip a                        # Linux
ipconfig /all               # Windows

# Routing
ip route                    # Linux
route print                 # Windows

# DNS lookup
nslookup target.com
dig target.com A
dig target.com MX
host -t NS target.com

# Connectivity
ping -c 4 IP
traceroute IP               # Linux
tracert IP                  # Windows

# Port/socket state
ss -tulpn                   # Linux
netstat -ano                # Windows
```
