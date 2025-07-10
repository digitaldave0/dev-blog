---
layout: post
title: "🐧 Linux Commands Cheatsheet: Essential Commands for DevOps"
categories: [Linux, DevOps, System Administration, Cheatsheet]
excerpt: "Master the most important Linux commands for DevOps and system administration. A comprehensive guide covering file operations, process management, networking, monitoring, and automation."
description: "Complete Linux command reference for DevOps engineers and system administrators. Includes 100+ essential commands with practical examples, common use cases, and best practices for daily operations."
---

<style>
pre, code {
    background-color: #2d2d2d !important;
    color: #ffffff !important;
}
pre {
    padding: 15px !important;
    border-radius: 5px !important;
    border: 1px solid #444 !important;
}
code {
    padding: 2px 5px !important;
    border-radius: 3px !important;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}
th, td {
    padding: 12px;
    border: 1px solid #ddd;
    text-align: left;
}
th {
    background-color: #2d2d2d;
    color: white;
}
tr:nth-child(even) {
    background-color: #f9f9f9;
}
tr:hover {
    background-color: #f5f5f5;
}
</style>

# Linux Commands Cheatsheet for DevOps Engineers

A comprehensive collection of essential Linux commands organized by category, with practical examples and common DevOps use cases.

## System Information & Monitoring

### System Status Commands

| Command | Example | Use Case |
|---------|---------|----------|
| `top` | `top -c -p $(pgrep nginx \| tr "\\n" "," \| sed 's/,$/\\n/')` | Monitor nginx process resources |
| `htop` | `htop -u www-data` | Interactive process monitoring for web server |
| `free` | `free -h --seconds 5` | Monitor memory usage in real-time |
| `df` | `df -h --output=source,fstype,size,used,avail,pcent,target` | Check disk space across mounts |
| `vmstat` | `vmstat 1 100` | Monitor system performance |

### Hardware Information

| Command | Example | Use Case |
|---------|---------|----------|
| `lscpu` | `lscpu --json` | CPU information for automation |
| `dmidecode` | `dmidecode --type memory` | Hardware inventory |
| `lsblk` | `lsblk --json --output NAME,SIZE,MOUNTPOINT` | Storage device mapping |
| `iostat` | `iostat -xz 1` | Monitor disk I/O performance |

## Process Management

### Process Control

| Command | Example | Use Case |
|---------|---------|----------|
| `ps` | `ps aux --sort=-%cpu \| head -10` | Find CPU-intensive processes |
| `kill` | `kill -9 $(lsof -t -i:8080)` | Kill process on specific port |
| `nice` | `nice -n 10 ./backup-script.sh` | Run backup with lower priority |
| `pgrep` | `pgrep -f "java.*production.*" \| xargs kill` | Find and kill Java processes |

### Service Management

| Command | Example | Use Case |
|---------|---------|----------|
| `systemctl` | `systemctl list-units --type=service --state=running` | Monitor running services |
| `journalctl` | `journalctl -u nginx -f --since "5m ago"` | Real-time service logs |
| `service` | `service --status-all \| grep "+"` | List active services |

## File Operations

### File Management

| Command | Example | Use Case |
|---------|---------|----------|
| `find` | `find /var/log -type f -mtime +30 -delete` | Clean old log files |
| `tar` | `tar czf "backup-$(date +%F).tar.gz" /var/www/` | Create dated backups |
| `rsync` | `rsync -avz --progress /src/ user@remote:/dest/` | Incremental file sync |
| `dd` | `dd if=/dev/zero of=/swapfile bs=1M count=1024 status=progress` | Create swap file |

### File Monitoring

| Command | Example | Use Case |
|---------|---------|----------|
| `tail` | `tail -f /var/log/nginx/error.log \| grep -i error` | Monitor logs for errors |
| `watch` | `watch -n 1 'ls -l /var/log \| grep "$(date +%Y-%m-%d)"'` | Monitor file changes |
| `inotifywait` | `inotifywait -m /var/www -e create -e modify` | Monitor directory changes |

## Network Operations

### Network Monitoring

| Command | Example | Use Case |
|---------|---------|----------|
| `netstat` | `netstat -tulpn \| grep LISTEN` | Check listening ports |
| `ss` | `ss -tuln \| grep ":80"` | Modern socket statistics |
| `iftop` | `iftop -i eth0 -P` | Monitor network bandwidth |
| `tcpdump` | `tcpdump -i any port 80 -w capture.pcap` | Capture HTTP traffic |

### Network Configuration

| Command | Example | Use Case |
|---------|---------|----------|
| `ip` | `ip -br addr show` | Quick network interface status |
| `curl` | `curl -w "%{http_code}" -o /dev/null -s http://localhost` | HTTP endpoint monitoring |
| `dig` | `dig +short mx example.com` | DNS troubleshooting |
| `nmap` | `nmap -sS -p- localhost` | Security port scanning |

## User Management

### User Operations

| Command | Example | Use Case |
|---------|---------|----------|
| `useradd` | `useradd -m -s /bin/bash -G docker,sudo newdev` | Create developer account |
| `usermod` | `usermod -aG docker jenkins` | Add service account to group |
| `chown` | `chown -R www-data:www-data /var/www/` | Fix web folder permissions |
| `chmod` | `chmod -R u=rwX,g=rX,o= /etc/ssl/private/` | Secure SSL keys |

### Access Control

| Command | Example | Use Case |
|---------|---------|----------|
| `sudo` | `sudo -l -U jenkins` | Audit user privileges |
| `last` | `last -10` | Check recent logins |
| `who` | `who -a` | Show active users |

## Storage Management

### Disk Operations

| Command | Example | Use Case |
|---------|---------|----------|
| `fdisk` | `fdisk -l \| grep "Disk /dev"` | List available disks |
| `parted` | `parted -l \| grep "Disk /dev"` | Modern partition management |
| `mount` | `mount -o remount,rw /` | Remount filesystem RW |
| `lvm` | `lvextend -l +100%FREE -r /dev/mapper/vg-root` | Extend LVM volume |

### File System

| Command | Example | Use Case |
|---------|---------|----------|
| `du` | `du -sh /* \| sort -hr` | Find large directories |
| `ncdu` | `ncdu /var` | Interactive disk usage |
| `xfs_repair` | `xfs_repair -v /dev/sda1` | Repair XFS filesystem |

## Performance Tuning

### Resource Limits

| Command | Example | Use Case |
|---------|---------|----------|
| `ulimit` | `ulimit -n 65535` | Increase file descriptors |
| `sysctl` | `sysctl -w vm.swappiness=10` | Adjust kernel parameters |
| `nice` | `nice -n -10 ./critical-service` | Increase process priority |

### Performance Monitoring

| Command | Example | Use Case |
|---------|---------|----------|
| `sar` | `sar -q 1 60` | Monitor system load |
| `pidstat` | `pidstat -d 1` | Monitor per-process I/O |
| `strace` | `strace -f -p $(pidof nginx)` | Debug process syscalls |

## Text Processing

### Log Analysis

| Command | Example | Use Case |
|---------|---------|----------|
| `grep` | `grep -R "ERROR" /var/log/ --include="*.log"` | Find errors in logs |
| `awk` | `awk '$9 >= 500 {print $7}' access.log \| sort \| uniq -c` | Analyze HTTP 5xx errors |
| `sed` | `sed -i 's/DEBUG/INFO/g' application.properties` | Bulk text replacement |

### Text Manipulation

| Command | Example | Use Case |
|---------|---------|----------|
| `cut` | `cut -d',' -f1,3 data.csv` | Extract CSV columns |
| `sort` | `sort -k2 -n data.txt` | Sort numerical data |
| `uniq` | `sort access.log \| uniq -c \| sort -nr` | Count unique entries |

## System Maintenance

### Package Management

| Command | Example | Use Case |
|---------|---------|----------|
| `apt` | `apt list --upgradable` | Check available updates |
| `dpkg` | `dpkg -l \| grep security` | List security packages |
| `snap` | `snap list --all \| grep disabled` | Clean old snap versions |

### System Updates

| Command | Example | Use Case |
|---------|---------|----------|
| `apt-get` | `apt-get update && apt-get upgrade -y` | System update |
| `do-release-upgrade` | `do-release-upgrade -d` | Distribution upgrade |
| `needrestart` | `needrestart -r a` | Check required restarts |

## Automation Tips

### Scripting Helpers

| Command | Example | Use Case |
|---------|---------|----------|
| `cron` | `(crontab -l 2>/dev/null; echo "0 2 * * * /backup.sh") \| crontab -` | Add backup schedule |
| `at` | `echo "./deploy.sh" \| at midnight` | Schedule one-time task |
| `expect` | `expect -c 'spawn ssh user@host; expect "password:"; send "pass\n"'` | Automate interactive |

### One-liners

```bash
# Find and kill memory-hungry processes
ps aux | awk 'NR>1{if($4>5.0) print $2}' | xargs kill

# Clean old Docker resources
docker system prune --volumes -af

# Find large files
find / -type f -size +100M -exec ls -lh {} \;

# Monitor failed SSH attempts
tail -f /var/log/auth.log | grep --line-buffered "Failed password"
```

## Best Practices

1. **Always Use Version Control**
```bash
# Create timestamped backups
cp config.ini{,.$(date +%Y%m%d_%H%M%S).bak}
```

2. **Secure Sensitive Operations**
```bash
# Set secure permissions
umask 077; echo "secret" > credentials.txt
```

3. **Monitor Resource Usage**
```bash
# Custom PS1 with load average
export PS1='[\l] \u@\h:\w\$ '
```

## Video Resources

### Linux Administration
- [Linux Administration Tutorial](https://www.youtube.com/watch?v=v_1zB2WNN14)
- [Linux Performance Tuning](https://www.youtube.com/watch?v=bYfSV_PqPDk)

### DevOps Specific
- [Linux for DevOps](https://www.youtube.com/watch?v=HX-ZXWr4HvE)
- [Shell Scripting for DevOps](https://www.youtube.com/watch?v=2hN7uTDkR0Y)

## Additional Resources

- [Linux Documentation Project](https://tldp.org/)
- [Linux Performance](http://www.brendangregg.com/linuxperf.html)
- [Shell Scripting Guide](https://google.github.io/styleguide/shellguide.html)
