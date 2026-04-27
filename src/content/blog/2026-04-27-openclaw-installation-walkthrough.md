---
title: "Installing OpenClaw: From Binary to Container"
description: "A step-by-step walkthrough of the OpenClaw installation process, covering containerized deployment and local source builds for advanced customization."
pubDate: 2026-04-27
tags: ["openclaw", "installation", "devops"]
---

# Installing OpenClaw: From Binary to Container

Now that your environment is prepared, it's time to pull the trigger on the installation. OpenClaw supports multiple deployment strategies depending on your needs.

## Option 1: Docker (Recommended)

The fastest way to get started is using the official Docker image. This ensures all dependencies are perfectly isolated.

```bash
docker pull openclaw/core:latest
docker run -d \
  --name openclaw \
  -p 8080:8080 \
  --env-file .env \
  -v $(pwd)/workspace:/app/workspace \
  openclaw/core:latest
```

## Option 2: Source Build (For Developers)

If you plan on contributing to OpenClaw or need to modify the core agent logic, a source build is the way to go.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/openclaw/openclaw.git
   cd openclaw
   ```

2. **Install dependencies:**
   ```bash
   npm install && pip install -r requirements.txt
   ```

3. **Initialize the core:**
   ```bash
   python setup.py develop
   ```

## Verifying the Installation

Once the installation is complete, verify that the OpenClaw CLI is responsive:

```bash
openclaw --version
```

You should see the current version string. If you encounter any "Command Not Found" errors, ensure your `PATH` includes the local bin directory.

In our next article, we will tackle the critical task of securing your OpenClaw deployment.
