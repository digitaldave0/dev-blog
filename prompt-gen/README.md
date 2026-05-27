# DevOps Ask-Mode Prompt Generator

A dependency-free CLI tool that assembles context-rich DevOps prompts from
templates, auto-discovers your workspace, scrubs secrets, and copies the
result straight to your clipboard.

---

## Quick Start

Run it from the `prompt-engine/` directory:

```bash
cd prompt-engine
python3 prompt_injector.py
```

Or from the project root using a flag to jump straight to a template:

```bash
python3 prompt-engine/prompt_injector.py --list
python3 prompt-engine/prompt_injector.py -t 3
```

> **Requires Python 3.10+. No external dependencies.**

---

## CLI Flags

| Flag | Short | Description |
|---|---|---|
| `--list` | `-l` | Print all available templates and exit |
| `--history` | `-H` | Browse previously saved prompts and re-copy one |
| `--template KEY` | `-t` | Jump to a template by key, number, or key prefix |
| `--cloud NAME` | `-c` | Pre-fill `[CLOUD_PROVIDER]` |
| `--tool NAME` | | Pre-fill `[TOOL_STACK]` |
| `--objective TEXT` | `-o` | Pre-fill `[OBJECTIVE]` |
| `--help` | `-h` | Show help and exit |

### Examples

```bash
# See all templates
python3 prompt_injector.py --list

# Jump to template 3 (Troubleshooting RCA) by number
python3 prompt_injector.py -t 3

# Jump by key prefix — 'sec' matches security_compliance_audit
python3 prompt_injector.py -t sec

# Pre-fill what you already know
python3 prompt_injector.py -t code_review -c AWS --tool Terraform \
  -o "Review IaC for security misconfigurations"

# Re-open a past session
python3 prompt_injector.py --history
```

---

## Interactive Flow

When you run the tool without all variables pre-filled, it walks you through
each placeholder in the selected template:

```
──────────────────────────────────────────────────────────────────────
Which cloud provider are you using?
Detected: AWS — press Enter to accept
> 
```

- **Press Enter** to accept an auto-detected value or skip an optional field.
- **Type anything** to override the detected value or fill in a required one.
- For `EXISTING_KNOWLEDGE` (logs, configs, notes), paste multiline text freely,
  then type `EOF` on its own line when done.

### Skipping optional fields

Variables like `[CONSTRAINTS]`, `[SEVERITY]`, and `[TIMELINE]` are optional.
Pressing Enter on them removes their line from the compiled prompt entirely —
no orphaned labels like `Severity:` with nothing after them.

---

## Context Auto-Discovery

When you run the tool, it scans your **current working directory** for
infrastructure signals and pre-fills variable defaults automatically:

| What it finds | Pre-fills |
|---|---|
| `.aws/` directory | `CLOUD_PROVIDER = AWS` |
| `.azure/` directory | `CLOUD_PROVIDER = Azure` |
| `*.tf` files | `TOOL_STACK += Terraform` |
| `Dockerfile` | `TOOL_STACK += Docker` |
| `docker-compose.yml` | `TOOL_STACK += Docker Compose` |
| `Chart.yaml` / `helmfile.yaml` | `TOOL_STACK += Helm` |
| `.github/` directory | `TOOL_STACK += GitHub Actions` |
| `Jenkinsfile` | `TOOL_STACK += Jenkins` |
| `package.json` | `TOOL_STACK += Node.js` |
| `requirements.txt` / `pyproject.toml` | `TOOL_STACK += Python` |
| `Makefile` | `TOOL_STACK += Make` |

You can always override a detected value by typing at the prompt.

> **Tip:** Run from inside your project root for the best auto-detection results.

---

## PII & Secret Protection

Before copying to clipboard, the tool scans the compiled prompt for sensitive
data and **warns you** if it finds anything:

```
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  ⚠  PII / SECRET WARNING
!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
Potential sensitive data detected in your compiled prompt:

  • AWS Access Key ID — 1 match(es)
  • Private IP Address — 2 match(es)

Proceed anyway? [y/N]:
```

The prompt **defaults to N** — you must explicitly type `y` to proceed.

**Patterns detected:**

| Pattern | Example |
|---|---|
| AWS Access Key ID | `AKIA…` |
| Generic Bearer Token | `Bearer eyJ…` |
| Private Key Block | `-----BEGIN RSA PRIVATE KEY-----` |
| Generic API Key | `api_key = "abc123…"` |
| Private IP Address | `192.168.x.x`, `10.x.x.x`, `172.16–31.x.x` |

---

## Preview Before Copy

After filling in all variables, the tool shows you the first 20 lines of the
compiled prompt before asking if you want to copy it:

```
══════════════════════════════════════════════════════════════════════
  PROMPT PREVIEW
══════════════════════════════════════════════════════════════════════
Role: Act as an elite Principal DevOps & Cloud Infrastructure Architect...
Context: I am a Senior DevOps Engineer working on a project involving AWS...
... [8 more lines — full prompt saved to file]
══════════════════════════════════════════════════════════════════════

Copy to clipboard? [Y/n]:
```

Pressing **Enter or Y** copies and saves. Pressing **N** exits cleanly —
nothing is saved and nothing is copied.

---

## History

Every accepted prompt is saved to `prompt-engine/data/` as a dated Markdown
file (e.g. `2026-05-27-AWS-Terraform.md`).

Browse and re-copy any past session:

```bash
python3 prompt_injector.py --history
```

```
══════════════════════════════════════════════════════════════════════
  PROMPT HISTORY  (3 sessions)
══════════════════════════════════════════════════════════════════════
   1) 2026-05-27-AWS-Terraform              2026-05-27 11:03
   2) 2026-05-27-GCP-Kubernetes             2026-05-27 10:41
   3) 2026-05-26-general-misc               2026-05-26 16:22
══════════════════════════════════════════════════════════════════════

Select to view/copy (1-3) or Enter to quit:
```

Select a session to preview the first 20 lines and optionally copy it back to
clipboard.

---

## Available Templates

| # | Name | Key | Best for |
|---|---|---|---|
| 1 | Master Ask-Mode Senior Advisor | `master_ask_mode_advisor` | Open-ended architectural questions |
| 2 | Architecture Deep Dive | `architecture_deep_dive` | HA design + threat modelling |
| 3 | Troubleshooting & Failure RCA | `troubleshooting_and_failure` | Production incident diagnosis |
| 4 | Code & IaC Review Advisor | `code_review_advisor` | Terraform, Helm, pipeline code review |
| 5 | Obsidian Synthesis & Formatter | `obsidian_synthesis_formatter` | Turning raw notes into a vault page |
| 6 | CI/CD Pipeline Design | `cicd_pipeline_design` | Pipeline design and bottleneck audit |
| 7 | Security & Compliance Audit | `security_compliance_audit` | CIS / SOC2 / NIST compliance review |
| 8 | Cost Optimisation Audit | `cost_optimisation_audit` | FinOps spend reduction |
| 9 | Incident Postmortem Writer | `incident_postmortem` | Structured postmortem for leadership |

---

## Deploying to Another Project

Use `deliver.sh` to deploy the prompt engine into any other repository on your
machine. It creates a symlink (not a copy), so templates stay in sync.

```bash
# From the prompt-gen root
./deliver.sh /path/to/your/other/project
```

This will:

1. **Symlink** `prompt-engine/` into the target project directory.
2. **Merge** the VS Code build task into `.vscode/tasks.json` without
   overwriting any existing tasks.
3. **Add safety rules** to the target project's `.gitignore` so the
   prompt engine and VS Code task are never accidentally committed.

After delivery, run the tool from inside that project:

```bash
cd /path/to/your/other/project
python3 prompt-engine/prompt_injector.py
```

Auto-discovery will then scan *that* project's files for context signals.

---

## Adding or Editing Templates

Templates live in `prompt-engine/prompts.json`. To add a new one, append an
entry to the `prompts` object:

```json
"my_template": {
  "name": "My Custom Template",
  "description": "One line shown in the menu.",
  "template": "Role: ...\nTask: ...\n\nObjective: [OBJECTIVE]\n\n[EXISTING_KNOWLEDGE]"
}
```

Use `[VARIABLE_NAME]` (uppercase, underscores) as placeholders.
Any placeholder automatically becomes an interactive prompt.
Variables defined in `variable_prompts` get human-friendly question text;
undefined ones fall back to `Enter value for [VAR_NAME]`.

### Built-in variables

| Placeholder | Question shown to user |
|---|---|
| `[CLOUD_PROVIDER]` | Which cloud provider are you using? |
| `[TOOL_STACK]` | What tools or frameworks are you using? |
| `[OBJECTIVE]` | What is the primary technical objective? |
| `[CONSTRAINTS]` | Any constraints (budget, compliance, team)? |
| `[SEVERITY]` | What is the incident severity? |
| `[TIMELINE]` | When did the issue start? |
| `[EXISTING_KNOWLEDGE]` | Paste logs, configs, or notes (multiline) |

---

## Running Tests

```bash
python3 -m unittest discover -s tests -v
```

All three tests should pass:

```
test_context_auto_discovery    ... ok
test_exact_string_replacement  ... ok
test_pii_scrubber_detection    ... ok
----------------------------------------------------------------------
Ran 3 tests in 0.001s
OK
```

---

## Project Structure

```
prompt-gen/
├── deliver.sh               # Deploy engine into another repo via symlink
├── README.md                # This file
├── prompt-engine/
│   ├── prompt_injector.py   # Main CLI engine
│   ├── prompt_injector.sh   # Thin bash wrapper (for VS Code tasks)
│   ├── prompts.json         # All templates and variable definitions
│   └── data/                # Saved prompt history (auto-created)
└── tests/
    └── test_injector.py     # Unit tests
```
