---
layout: post
title: "Bandit: Python-Specific Static Security Analysis Tool"
description: "Master Bandit for comprehensive Python code security analysis. Learn to detect common security issues, integrate with development workflows, and write custom security rules for your Python projects."
tags:
  [
    python,
    security,
    static-analysis,
    bandit,
    code-security,
    vulnerabilities,
    devsecops,
    best-practices,
  ]
icon: 🐍
excerpt: >
  Discover Bandit, the specialized static security analyzer for Python. This comprehensive guide covers detecting security vulnerabilities, integrating with CI/CD, and enforcing secure coding practices in Python development.
author: "owner"
date: 2025-11-10 14:00:00 +0000
---

# Bandit: Python-Specific Static Security Analysis Tool

Python's popularity in web development, data science, and automation makes it a prime target for security vulnerabilities. While general-purpose static analysis tools exist, **Bandit** offers Python-specific security analysis that understands the language's nuances and common security pitfalls. As part of the PyCQA (Python Code Quality Authority), Bandit provides targeted security scanning designed specifically for Python codebases.

## What is Bandit?

Bandit is a static analysis tool designed to find common security issues in Python code. Unlike general security scanners, Bandit is built specifically for Python, understanding its AST (Abstract Syntax Tree) and common security patterns. It processes each file, builds an AST, and runs appropriate plugins against the AST nodes to detect security issues.

Bandit is maintained by the Python Code Quality Authority and integrates seamlessly with Python development workflows, making it an essential tool for secure Python development.

## When to Use Bandit

Bandit should be integrated at key points in your Python development lifecycle:

- **Code Reviews**: Automated security checks during pull request reviews
- **Pre-commit Hooks**: Prevent insecure code from being committed
- **CI/CD Pipelines**: Security gates in automated testing
- **Security Audits**: Comprehensive codebase security assessments
- **Code Quality Gates**: Enforce security standards across teams
- **Legacy Code Migration**: Identify security issues in existing codebases
- **Open Source Contributions**: Ensure contributed code meets security standards

## How to Use Bandit

### Installation

Bandit is available via pip and most package managers:

```bash
# Via pip
pip install bandit

# Via conda
conda install -c conda-forge bandit

# Via Docker
docker run --rm -v $(pwd):/code secdev/bandit /code
```

### Basic Usage

#### Scanning a File or Directory

```bash
# Scan a single file
bandit my_script.py

# Scan a directory
bandit /path/to/python/project

# Scan current directory
bandit .
```

#### Output Formats

Bandit supports multiple output formats:

```bash
# Default terminal output
bandit .

# JSON output for automation
bandit -f json .

# XML output for CI systems
bandit -f xml .

# Custom format with specific fields
bandit -f custom .
```

#### Severity Levels

Control which issues to report:

```bash
# Report all issues (default)
bandit .

# Only high-severity issues
bandit -l high .

# Medium and high severity
bandit -l medium .

# All severities
bandit -l low .
```

### Advanced Usage

#### Configuration Files

Create a `.bandit` configuration file for project-specific settings:

```yaml
# .bandit
[bandit]
exclude_dirs = test,tests,.git
skips = B101,B601  # Skip specific test IDs
```

#### Custom Plugins

Bandit supports custom security rules:

```python
# custom_plugin.py
import bandit
from bandit.core import test_properties as test

@test.test_id('C001')
@test.checks('Call')
def check_dangerous_function(context):
    """Check for dangerous function calls"""
    if context.call_function_name == 'dangerous_function':
        return bandit.Issue(
            severity=bandit.HIGH,
            confidence=bandit.HIGH,
            text="Dangerous function call detected",
            lineno=context.node.lineno,
        )
```

#### Baseline Scanning

For existing codebases, create a baseline to ignore current issues:

```bash
# Generate baseline
bandit -f json . > baseline.json

# Scan against baseline
bandit --baseline baseline.json .
```

#### CI/CD Integration

GitHub Actions example:

```yaml
name: Security Scan
on: [push, pull_request]

jobs:
  bandit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v4
        with:
          python-version: "3.11"
      - name: Install Bandit
        run: pip install bandit
      - name: Run Bandit
        run: bandit -r . -f json -o bandit-report.json
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: bandit-results
          path: bandit-report.json
```

## Examples

### Example 1: Basic Security Scan

```bash
$ bandit example.py
[main]  INFO    Using config file .bandit
[main]  INFO    profiling bandit took 0.01s
[main]  INFO    running on Python 3.11.0
Files skipped (0):
Run started:2025-11-10 14:00:00.000000
Run metrics:
  Total lines of code: 50
  Total lines skipped (#nosec): 0
  Total potential issues: 2

Test results:
  Code scanned:
    Total lines of code: 50
    Total lines skipped (#nosec): 0
    Total potential issues: 2
>> Issue: [B506:yaml_load] Use of unsafe yaml load. Allows instantiation of arbitrary objects. Consider yaml.safe_load().
   Severity: Medium   Confidence: High
   Location: example.py:15
   More Info: https://bandit.readthedocs.io/en/latest/plugins/b506_yaml_load.html

>> Issue: [B105:hardcoded_password] Possible hardcoded password: 'admin'
   Severity: Low   Confidence: Medium
   Location: example.py:20
   More Info: https://bandit.readthedocs.io/en/latest/plugins/b105_hardcoded_password.html
```

### Example 2: Scanning with Configuration

```yaml
# .bandit
[bandit]
exclude_dirs = tests,__pycache__
skips = B101  # Skip assert checks in tests
```

```bash
$ bandit -c .bandit .
# Scans excluding test directories and assert checks
```

### Example 3: JSON Output for Automation

```bash
$ bandit -f json example.py
{
  "results": {
    "example.py": [
      {
        "code": "yaml.load(input)",
        "filename": "example.py",
        "issue_confidence": "HIGH",
        "issue_severity": "MEDIUM",
        "issue_text": "Use of unsafe yaml load. Allows instantiation of arbitrary objects. Consider yaml.safe_load().",
        "line_number": 15,
        "line_range": [15],
        "more_info": "https://bandit.readthedocs.io/en/latest/plugins/b506_yaml_load.html",
        "test_id": "B506",
        "test_name": "yaml_load"
      }
    ]
  },
  "metrics": {
    "lines": 50,
    "nosec": 0,
    "skipped_tests": 0
  }
}
```

### Example 4: Custom Plugin Example

```python
# plugins/custom_check.py
import bandit
from bandit.core import test_properties as test

@test.test_id('C001')
@test.checks('Str')
def check_api_key_leak(context):
    """Check for potential API key leaks"""
    api_key_patterns = ['sk-', 'pk_', 'api_key', 'secret_key']

    if any(pattern in context.string_val.lower() for pattern in api_key_patterns):
        return bandit.Issue(
            severity=bandit.HIGH,
            confidence=bandit.MEDIUM,
            text="Potential API key leak detected",
            lineno=context.node.lineno,
        )
```

## What Bandit Helps Mitigate

Bandit detects a wide range of Python-specific security issues:

### 1. Injection Vulnerabilities

- **SQL Injection**: Unsafe SQL query construction
- **Command Injection**: Unsafe shell command execution
- **Code Injection**: Unsafe code execution patterns

### 2. Authentication and Authorization

- **Hardcoded Credentials**: Passwords and API keys in source code
- **Weak Cryptography**: Insecure encryption algorithms
- **Improper Authentication**: Weak authentication mechanisms

### 3. Data Handling Issues

- **Unsafe Deserialization**: Pickle and YAML loading vulnerabilities
- **Insecure Random**: Use of predictable random number generators
- **Information Disclosure**: Leaking sensitive information

### 4. Web Security

- **Cross-Site Scripting (XSS)**: Unsafe HTML generation
- **Cross-Site Request Forgery (CSRF)**: Missing CSRF protection
- **Insecure HTTP**: Use of HTTP instead of HTTPS

### 5. General Security Issues

- **Race Conditions**: File handling vulnerabilities
- **Path Traversal**: Directory traversal attacks
- **Denial of Service**: Resource exhaustion vulnerabilities

## Integration with Government Cybersecurity Frameworks

Bandit's Python-specific security analysis aligns well with the Australian Government's Cybersecurity Assessment Framework (CAF), particularly in the area of secure software development.

### CAF Strategy 1: Patch Applications

Bandit helps identify vulnerabilities that require patching and ensures secure coding practices prevent future issues.

### CAF Essential Eight Alignment

Bandit supports several Essential Eight mitigation strategies:

- **E1: Application Whitelisting**: Ensures secure coding practices in approved applications
- **E2: Patching Applications**: Identifies vulnerabilities requiring immediate attention
- **E3: Restrict Administrative Privileges**: Detects privilege escalation vulnerabilities
- **E4: Multi-Factor Authentication**: Identifies weak authentication implementations

### Additional CAF Benefits

- **Secure Development**: Enforces secure coding standards from development
- **Early Detection**: Catches security issues during development, not production
- **Compliance Automation**: Automated security checks reduce manual efforts
- **Risk Reduction**: Prevents common vulnerabilities from entering production

## Best Practices

### 1. Configuration Management

- Create project-specific `.bandit` configuration files
- Exclude test directories and generated code
- Customize severity levels based on project needs

### 2. CI/CD Integration

- Run Bandit on every pull request
- Fail builds on high-severity issues
- Generate reports for security dashboards

### 3. Custom Rules Development

- Write rules for organization-specific security policies
- Test custom rules against known vulnerable code
- Share rules across teams and projects

### 4. Baseline Management

- Establish baselines for legacy codebases
- Regularly update baselines as issues are resolved
- Track baseline reduction over time

### 5. Team Training

- Use Bandit findings to educate developers
- Create coding guidelines based on common issues
- Integrate security training with development workflows

## Advanced Features

### Plugin Architecture

Bandit's plugin system allows for extensive customization:

```python
# Advanced custom plugin
@test.checks('Call', 'Import', 'ImportFrom')
def comprehensive_check(context):
    """Multi-type check for comprehensive security analysis"""
    # Check function calls
    if context.check_call:
        # Function call analysis
        pass

    # Check imports
    if context.check_import:
        # Import analysis
        pass

    return issues
```

### Integration with Other Tools

Bandit works well with complementary security tools:

```bash
# Combine with safety for dependency scanning
bandit . && safety scan

# Use with pre-commit hooks
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.5
    hooks:
      - id: bandit
```

### Performance Optimization

For large codebases:

```bash
# Parallel processing
bandit -p 4 .

# Target specific files
bandit --include "*.py" --exclude "test_*" .

# Incremental scanning
bandit --baseline baseline.json --incremental .
```

## Troubleshooting

### Common Issues

**False Positives**:

```python
# Use # nosec comments for known safe code
yaml.safe_load(data)  # nosec B506
```

**Performance Problems**:

- Use `--exclude` to skip unnecessary directories
- Configure appropriate `--include` patterns
- Use parallel processing with `-p`

**Configuration Issues**:

- Validate YAML syntax in `.bandit` files
- Check file permissions and paths
- Use `--debug` for detailed error information

**Plugin Loading Errors**:

- Ensure custom plugins are in Python path
- Check plugin syntax and imports
- Use `--plugin-dir` to specify plugin locations

## Conclusion

Bandit represents the gold standard for Python-specific security analysis. Its deep understanding of Python's AST and security patterns makes it far more effective than general-purpose security scanners for Python codebases.

By integrating Bandit into your development workflow, you establish a strong foundation for secure Python development that catches security issues early and enforces best practices across your team. When aligned with frameworks like the Australian Government's CAF, Bandit helps organizations build more secure Python applications and maintain robust cybersecurity postures.

Start using Bandit today to elevate your Python code security and develop with confidence.
