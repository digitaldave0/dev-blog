#!/usr/bin/env bash
# ==============================================================================
# deliver.sh — Deploy prompt framework into a target repository
# ==============================================================================
# Usage: ./deliver.sh <target_repository_path>
#
# 1. Symlinks prompt-engine/ into the target workspace
# 2. Merges VS Code build task without clobbering existing tasks
# 3. Adds safety rules to .gitignore so nothing leaks to remote
# ==============================================================================
set -euo pipefail

if [ $# -lt 1 ]; then
    echo "Usage: ./deliver.sh <target_repository_path>" >&2
    exit 1
fi

TARGET_DIR=$(realpath "$1")
SRC_DIR=$(dirname "$(realpath "$0")")
PROMPT_ENGINE_SRC="$SRC_DIR/prompt-engine"

# ── Validate ────────────────────────────────────────────────────────────────
[ -d "$TARGET_DIR" ]        || { echo "[-] Target does not exist: $TARGET_DIR" >&2; exit 1; }
[ -d "$PROMPT_ENGINE_SRC" ] || { echo "[-] prompt-engine/ not found at: $PROMPT_ENGINE_SRC" >&2; exit 1; }

echo "[+] Deploying to: $TARGET_DIR"

# ── 1. VS Code tasks merge ─────────────────────────────────────────────────
VSCODE_DIR="$TARGET_DIR/.vscode"
mkdir -p "$VSCODE_DIR"

SRC_TASKS="$SRC_DIR/.vscode/tasks.json"
TGT_TASKS="$VSCODE_DIR/tasks.json"

if [ -f "$TGT_TASKS" ]; then
    python3 -c "
import json, sys
src = json.load(open('$SRC_TASKS'))
tgt = json.load(open('$TGT_TASKS'))
tgt.setdefault('tasks', [])
new = src['tasks'][0]
labels = [t.get('label') for t in tgt['tasks']]
if new['label'] not in labels:
    tgt['tasks'].append(new)
    print(f\"[+] Added task: {new['label']}\")
else:
    for t in tgt['tasks']:
        if t.get('label') == new['label']:
            t['command'] = new['command']
    print(f\"[+] Updated task: {new['label']}\")
json.dump(tgt, open('$TGT_TASKS','w'), indent=4)
"
else
    cp "$SRC_TASKS" "$TGT_TASKS"
    echo "[+] Created tasks.json"
fi

# ── 2. Symlink prompt-engine/ ──────────────────────────────────────────────
ln -sfn "$PROMPT_ENGINE_SRC" "$TARGET_DIR/prompt-engine"
echo "[+] Symlink: prompt-engine -> $PROMPT_ENGINE_SRC"

# ── 3. .gitignore safety rules ─────────────────────────────────────────────
GITIGNORE="$TARGET_DIR/.gitignore"
touch "$GITIGNORE"

for rule in "prompt-engine/" ".vscode/tasks.json"; do
    if ! grep -Fxq "$rule" "$GITIGNORE"; then
        printf "\n# Prompt Framework — local only\n%s\n" "$rule" >> "$GITIGNORE"
        echo "[+] Added '$rule' to .gitignore"
    fi
done

echo "[+] Done."
