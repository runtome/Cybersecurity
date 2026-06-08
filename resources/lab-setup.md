# Lab Setup Guide

Build a local penetration testing lab environment with Kali Linux and vulnerable target VMs.

## Recommended Setup

```
Host Machine (Windows/macOS/Linux)
└── Hypervisor (VirtualBox or VMware)
    ├── Kali Linux VM  (attacker)
    ├── Metasploitable 2  (Linux target)
    ├── DVWA on Ubuntu  (web app target)
    └── VulnHub VMs  (various targets)
```

All VMs on a **Host-Only** or **Internal** network adapter — never expose vulnerable VMs to the internet.

---

## Kali Linux Setup

### Download

Official download: [kali.org/get-kali](https://www.kali.org/get-kali/)

- **VM image** (fastest): Pre-built VirtualBox/VMware `.ova` — just import and run
- **ISO installer**: Full control over partitioning

### Initial Configuration

```bash
# Update package list and upgrade all packages
sudo apt update && sudo apt full-upgrade -y

# Install all Kali tool metapackages
sudo apt install kali-linux-default -y

# Install additional tools
sudo apt install seclists gobuster feroxbuster evil-winrm bloodhound neo4j -y

# Configure IP address (if static needed)
sudo nano /etc/network/interfaces

# Enable SSH
sudo systemctl enable ssh --now
```

### Useful Kali Tweaks

```bash
# Set terminal default shell to zsh
chsh -s /bin/zsh

# Install Oh My Zsh for better terminal
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# Add Kali to PATH permanently
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.zshrc

# Configure proxychains for routing through Burp or SOCKS
sudo nano /etc/proxychains4.conf
# Add at bottom: socks5 127.0.0.1 9050
```

---

## Vulnerable Target VMs

### Metasploitable 2

A deliberately vulnerable Linux VM — ideal for practising Nmap, Metasploit, and web app attacks.

- **Download:** [SourceForge](https://sourceforge.net/projects/metasploitable/)
- **Default credentials:** `msfadmin` / `msfadmin`
- **Services:** FTP, SSH, Telnet, HTTP, SMB, MySQL, PostgreSQL, VNC, and more

### DVWA (Damn Vulnerable Web Application)

```bash
# Install on Kali or a separate Ubuntu VM
sudo apt install dvwa
sudo dvwa-start
# Access at http://localhost/dvwa

# Or run via Docker
docker run --rm -it -p 80:80 vulnerables/web-dvwa
```

### VulnHub

Download free vulnerable VMs for offline practice:

- [VulnHub.com](https://www.vulnhub.com/)
- Recommended beginner machines: **Kioptrix 1**, **Mr-Robot**, **DC-1**, **Basic Pentesting**

### HackTheBox / TryHackMe (Online Labs)

For practice with a VPN connection to their lab networks:

```bash
# Download the OpenVPN configuration file from each platform
# Connect to TryHackMe
sudo openvpn tryhackme.ovpn

# Connect to HackTheBox
sudo openvpn hackthebox.ovpn

# Verify VPN connection
ip a  # Check for tun0 interface
```

---

## Network Configuration

### VirtualBox — Host-Only Network

1. File > Host Network Manager > Create a new host-only adapter
2. Set all target VMs to use this adapter (internal traffic only)
3. Set Kali VM to use the same adapter
4. Verify with `ip a` — all VMs should be in the same `/24` subnet

### VMware — Host-Only Network

1. Edit > Virtual Network Editor > VMnet1 (Host-only)
2. Set all VMs to VMnet1 adapter
3. Kali and target VMs will communicate on this isolated network

---

## Useful Lab Scripts

```bash
# Quick host discovery on the lab network
nmap -sn 192.168.56.0/24

# Save lab IPs to /etc/hosts for easy reference
echo "192.168.56.101 target1 metasploitable" | sudo tee -a /etc/hosts
echo "192.168.56.102 target2 dvwa" | sudo tee -a /etc/hosts
```
