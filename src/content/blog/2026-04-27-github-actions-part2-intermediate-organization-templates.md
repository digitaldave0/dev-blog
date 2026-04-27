---
title: >-
  GitHub Actions Masterclass Part 2: Custom Organization Templates
description: >-
  Scale your DevOps practices by creating custom workflow templates for your 
  entire organization. Ensure consistency, security, and best practices across 
  every repository in your fleet.
pubDate: 2026-04-27T00:00:00.000Z
tags:
  - github-actions
  - automation
  - organization
  - devops
  - series
heroImage: 'https://picsum.photos/seed/github-actions-intermediate/800/400'
---

# GitHub Actions Masterclass Part 2: Custom Organization Templates

In [Part 1](./2026-04-27-github-actions-part1-basics-workflow-templates), we learned how to use GitHub's built-in templates. But what if your company has specific security requirements, or you want every project to use a specific internal deployment tool?

This is where **Custom Organization Templates** come in. They allow you to define "golden paths" for your developers, ensuring that every new project starts with the right foundation.

---

## 1. Setting Up the `.github` Repository

To share templates across an entire organization, you need a special repository named `.github`. This repository acts as a central hub for organization-wide settings, including profile pages, default issue templates, and—most importantly—workflow templates.

### The Directory Structure
Templates must be stored in a specific directory within your `.github` repository:
```text
.github (repository root)
└── workflow-templates/
    ├── ci-standard.yml
    ├── ci-standard.json
    ├── deployment-gateway.yml
    └── deployment-gateway.json
```

---

## 2. Creating the Template Metadata

Every YAML template in the `workflow-templates` directory requires a corresponding `.json` metadata file. This file tells GitHub how to display the template in the UI.

### Example: `ci-standard.json`
```json
{
    "name": "Enterprise Standard CI",
    "description": "Standard CI pipeline with security scanning and internal artifact storage.",
    "iconName": "shield",
    "categories": ["Go", "Security"]
}
```

- **`name`:** The title displayed in the template gallery.
- **`description`:** A brief summary of what the workflow does.
- **`iconName`:** An icon from GitHub's internal library (e.g., `shield`, `rocket`, `package`).

---

## 3. Using Placeholders for Dynamic Configuration

Templates often need to be customized for each repository they are added to. You can use placeholders that GitHub will automatically replace when a developer selects the template.

- `$default-branch`: Replaced with the repo's default branch (e.g., `main`).
- `$project-name`: Replaced with the repo's name.

### Example Template with Placeholders
```yaml
name: CI for $project-name

on:
  push:
    branches: [ "$default-branch" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # Internal security scan required by the CISO
      - uses: our-org/security-scan-action@v1
```

---

## 4. Why This Matters for DevOps Teams

Creating custom templates is a core part of **Platform Engineering**. Instead of developers "copy-pasting" YAML from old projects (and bringing outdated dependencies or insecure patterns with them), they pull from a centralized, version-controlled source of truth.

### Benefits:
1.  **Security by Default:** Bake in secrets scanning and linting.
2.  **Compliance:** Ensure every repo follows the same deployment gates.
3.  **Onboarding:** New hires can deploy a "Hello World" app in minutes using company-approved patterns.

---

## Conclusion

By mastering organization templates, you've moved from "using tools" to "building systems." But even templates can become repetitive if you have 100 repositories. In the final part of our series, we’ll explore **Reusable Workflows** and advanced security hardening to make your pipelines truly professional.

**Ready for the final step?** Move on to [Part 3: Reusable Workflows and Advanced Logic](./2026-04-27-github-actions-part3-advanced-reusable-workflows).
