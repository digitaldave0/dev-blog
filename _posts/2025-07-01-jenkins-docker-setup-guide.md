---
layout: post
title: "🐳 Running Jenkins in Docker: A Complete Setup Guide"
categories: [DevOps, Docker, Jenkins, Tutorial]
description: "Learn how to run Jenkins in Docker with a complete setup guide including a custom installation script, best practices, and common troubleshooting tips."
excerpt: "A comprehensive guide to running Jenkins in Docker, with a focus on easy setup, security, and maintainability. Includes a custom installation script and best practices for DevOps teams."
---


# Running Jenkins in Docker: A Complete Setup Guide

Running Jenkins in Docker provides numerous benefits: easy setup, consistent environments, simple upgrades, and better resource isolation. In this guide, I'll show you how to get Jenkins running in Docker with a custom installation script that handles all the complexity for you.

## Why Jenkins in Docker?

- **Isolation**: Keep Jenkins separate from your host system
- **Portability**: Easy to move between environments
- **Version Control**: Simple version management
- **Backup**: Easy to backup and restore
- **Scaling**: Ready for distributed builds

## Quick Start

I've created a script that automates the entire setup process. Download and run it:

```bash
curl -O https://blog.digitaldevops.xyz/assets/scripts/install-jenkins-docker.sh
chmod +x install-jenkins-docker.sh
./install-jenkins-docker.sh
```

The script will:
1. Create necessary directories
2. Set up Docker network
3. Create Docker Compose file
4. Start Jenkins
5. Display the initial admin password

## Understanding the Setup

### The Docker Compose File

The script creates this Docker Compose configuration:

```yaml
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    restart: unless-stopped
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    environment:
      - TZ=UTC
    volumes:
      - ${JENKINS_HOME}:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - jenkins-network

networks:
  jenkins-network:
    external: true
```

Let's break down the important parts:

- **image**: Uses official LTS (Long Term Support) Jenkins image
- **restart**: Automatically restarts unless explicitly stopped
- **privileged/root**: Required for Docker-in-Docker operations
- **ports**: 
  - 8080: Web interface
  - 50000: Agent communication
- **volumes**: 
  - Jenkins home persistence
  - Docker socket for Docker-in-Docker

## Security Considerations

### 1. Permissions

The setup runs Jenkins as root, which isn't ideal. For production, consider:

```yaml
user: jenkins
group_add:
  - docker
```

### 2. Network Isolation

Create separate networks for different pipelines:

```bash
# Create network for specific pipeline
docker network create pipeline-network

# Add to docker-compose.yml
networks:
  pipeline-network:
    external: true
```

### 3. Secrets Management

Use Docker secrets for sensitive data:

```yaml
secrets:
  jenkins-admin-password:
    external: true
```

## Advanced Configuration

### 1. Custom Jenkins Configuration

Create a `jenkins.yaml` for Configuration as Code:

```yaml
jenkins:
  securityRealm:
    local:
      allowsSignup: false
  authorizationStrategy:
    roleBased:
      roles:
        global:
          - name: "admin"
            permissions:
              - "Overall/Administer"
          - name: "developer"
            permissions:
              - "Job/Build"
              - "Job/Read"
```

### 2. Pre-installing Plugins

Create a `plugins.txt`:

```text
workflow-aggregator:latest
git:latest
docker-workflow:latest
kubernetes:latest
configuration-as-code:latest
```

Add to Dockerfile:

```dockerfile
FROM jenkins/jenkins:lts
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli -f /usr/share/jenkins/ref/plugins.txt
```

## Maintenance and Upgrades

### Updating Jenkins

```bash
# Pull new image
docker-compose pull jenkins

# Restart container
docker-compose up -d
```

### Backup Strategy

```bash
# Backup Jenkins home
tar -czf jenkins_backup_$(date +%Y%m%d).tar.gz $JENKINS_HOME

# Backup container config
docker-compose config > docker-compose.backup.yml
```

## Troubleshooting

### 1. Permission Issues

If you see permission errors:

```bash
# Fix jenkins_home permissions
chown -R 1000:1000 $JENKINS_HOME
```

### 2. Docker-in-Docker Issues

If Docker commands fail inside Jenkins:

```bash
# Check Docker socket permissions
ls -l /var/run/docker.sock
# Should be: srw-rw---- 1 root docker

# Add jenkins user to docker group
usermod -aG docker jenkins
```

### 3. Memory Issues

Add memory limits to Docker Compose:

```yaml
services:
  jenkins:
    mem_limit: 2g
    mem_reservation: 1g
```

## Monitoring

### 1. Container Health

Add healthcheck to Docker Compose:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/login"]
  interval: 30s
  timeout: 10s
  retries: 3
```

### 2. Resource Usage

Monitor container resources:

```bash
# View resource usage
docker stats jenkins

# Check logs
docker logs -f jenkins
```

## Conclusion

Running Jenkins in Docker provides flexibility and ease of maintenance. The provided script makes setup simple, while the configuration options allow for customization based on your needs.

Remember to:
- Regularly backup Jenkins data
- Keep the Docker image updated
- Monitor resource usage
- Follow security best practices

## Resources

- [Jenkins Docker Hub](https://hub.docker.com/r/jenkins/jenkins)
- [Jenkins Configuration as Code](https://www.jenkins.io/projects/jcasc/)
- [Docker Documentation](https://docs.docker.com/)
- [Jenkins Security Best Practices](https://www.jenkins.io/doc/book/security/)

The installation script is available at:
[https://blog.digitaldevops.xyz/assets/scripts/install-jenkins-docker.sh](/assets/scripts/install-jenkins-docker.sh)

Happy automating! 🚀
