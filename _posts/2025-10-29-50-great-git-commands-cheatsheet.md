---
layout: post
title: "50 Great Git Commands: Complete Cheatsheet with Examples"
date: 2025-10-29
categories: [git, development, cheatsheet, commands, version-control]
tags:
  [
    git,
    git-commands,
    cheatsheet,
    version-control,
    development-tools,
    command-line,
    tutorial,
  ]
description: "Comprehensive cheatsheet of 50 essential Git commands with examples. From basic operations to advanced techniques, this guide covers everything you need to master Git version control."
image: /assets/images/git-commands-cheatsheet.jpg
---

# 50 Great Git Commands: Complete Cheatsheet with Examples

Git is the most widely used version control system in software development. This comprehensive cheatsheet covers 50 essential Git commands, starting with the basics and progressing to advanced techniques. Each command includes a practical example to help you understand its usage.

## Getting Started & Configuration

### 1. git init
Initialize a new Git repository in the current directory.
```bash
git init
# Example: Initialize a new project
git init
```

### 2. git config --global user.name
Set your name for Git commits.
```bash
git config --global user.name "Your Name"
# Example: Set username
git config --global user.name "John Doe"
```

### 3. git config --global user.email
Set your email for Git commits.
```bash
git config --global user.email "your.email@example.com"
# Example: Set email
git config --global user.email "john.doe@example.com"
```

### 4. git config --list
Show all Git configuration settings.
```bash
git config --list
# Example: View current configuration
git config --list
```

### 5. git config --global core.editor
Set your preferred text editor for Git.
```bash
git config --global core.editor "code --wait"
# Example: Set VS Code as default editor
git config --global core.editor "code --wait"
```

## Basic Operations

### 6. git status
Show the current status of the working directory and staging area.
```bash
git status
# Example: Check repository status
git status
```

### 7. git add
Add files to the staging area.
```bash
git add <filename>
# Example: Add a specific file
git add index.html
# Add all files
git add .
```

### 8. git commit
Commit staged changes to the repository.
```bash
git commit -m "Commit message"
# Example: Commit with message
git commit -m "Add user authentication feature"
```

### 9. git log
Show commit history.
```bash
git log
# Example: View recent commits
git log --oneline -5
```

### 10. git diff
Show differences between working directory and staging area.
```bash
git diff
# Example: See unstaged changes
git diff
# See staged changes
git diff --staged
```

## Branching & Merging

### 11. git branch
List all branches or create a new branch.
```bash
git branch
# Example: List branches
git branch
# Create new branch
git branch feature-login
```

### 12. git checkout
Switch to a different branch or restore files.
```bash
git checkout <branch-name>
# Example: Switch to feature branch
git checkout feature-login
# Create and switch to new branch
git checkout -b feature-signup
```

### 13. git merge
Merge a branch into the current branch.
```bash
git merge <branch-name>
# Example: Merge feature branch
git merge feature-login
```

### 14. git branch -d
Delete a branch.
```bash
git branch -d <branch-name>
# Example: Delete merged branch
git branch -d feature-login
# Force delete unmerged branch
git branch -D feature-experimental
```

### 15. git stash
Temporarily store uncommitted changes.
```bash
git stash
# Example: Stash current changes
git stash
# Stash with message
git stash save "Work in progress on login"
```

## Remote Repositories

### 16. git remote add
Add a remote repository.
```bash
git remote add <name> <url>
# Example: Add origin remote
git remote add origin https://github.com/user/repo.git
```

### 17. git remote -v
List all remote repositories.
```bash
git remote -v
# Example: View remotes
git remote -v
```

### 18. git push
Push commits to a remote repository.
```bash
git push <remote> <branch>
# Example: Push to origin master
git push origin main
# Push all branches
git push --all origin
```

### 19. git pull
Fetch and merge changes from a remote repository.
```bash
git pull <remote> <branch>
# Example: Pull from origin
git pull origin main
```

### 20. git fetch
Download objects and refs from a remote repository.
```bash
git fetch <remote>
# Example: Fetch from origin
git fetch origin
```

### 21. git clone
Clone a repository into a new directory.
```bash
git clone <url>
# Example: Clone a repository
git clone https://github.com/user/repo.git
# Clone with custom directory name
git clone https://github.com/user/repo.git my-project
```

## Undoing Changes

### 22. git reset
Reset current HEAD to a specified state.
```bash
git reset <mode> <commit>
# Example: Soft reset (keep changes staged)
git reset --soft HEAD~1
# Hard reset (discard changes)
git reset --hard HEAD~1
```

### 23. git revert
Create a new commit that undoes changes from a previous commit.
```bash
git revert <commit>
# Example: Revert specific commit
git revert abc123
```

### 24. git checkout -- <file>
Discard changes in working directory for a file.
```bash
git checkout -- <file>
# Example: Discard changes to file
git checkout -- index.html
```

### 25. git clean
Remove untracked files from working directory.
```bash
git clean <options>
# Example: Remove untracked files
git clean -f
# Remove directories too
git clean -fd
```

## Advanced Operations

### 26. git rebase
Reapply commits on top of another base commit.
```bash
git rebase <branch>
# Example: Rebase current branch onto main
git rebase main
# Interactive rebase
git rebase -i HEAD~3
```

### 27. git cherry-pick
Apply changes from specific commits.
```bash
git cherry-pick <commit>
# Example: Apply specific commit
git cherry-pick abc123
```

### 28. git bisect
Use binary search to find the commit that introduced a bug.
```bash
git bisect start
git bisect bad
git bisect good <good-commit>
# Example: Start bisect
git bisect start
git bisect bad HEAD
git bisect good v1.0
```

### 29. git blame
Show what revision and author last modified each line of a file.
```bash
git blame <file>
# Example: See file history
git blame index.html
```

### 30. git reflog
Show a log of all ref updates.
```bash
git reflog
# Example: View reference log
git reflog
```

## Tagging

### 31. git tag
Create, list, or delete tags.
```bash
git tag <tag-name>
# Example: Create lightweight tag
git tag v1.0
# Create annotated tag
git tag -a v1.0 -m "Version 1.0 release"
```

### 32. git tag -l
List all tags.
```bash
git tag -l
# Example: List tags with pattern
git tag -l "v1.*"
```

### 33. git push --tags
Push all tags to remote repository.
```bash
git push --tags
# Example: Push tags
git push --tags
```

### 34. git tag -d
Delete a tag.
```bash
git tag -d <tag-name>
# Example: Delete tag
git tag -d v1.0-old
```

## Submodules

### 35. git submodule add
Add a submodule to the current repository.
```bash
git submodule add <url> <path>
# Example: Add submodule
git submodule add https://github.com/user/library.git libs/library
```

### 36. git submodule init
Initialize submodules.
```bash
git submodule init
# Example: Initialize submodules
git submodule init
```

### 37. git submodule update
Update submodules to the latest commit.
```bash
git submodule update
# Example: Update submodules
git submodule update --remote
```

## Advanced Log & History

### 38. git log --oneline
Show commit history in compact format.
```bash
git log --oneline
# Example: Compact log
git log --oneline -10
```

### 39. git log --graph
Show commit history as a graph.
```bash
git log --graph --oneline
# Example: Graph view
git log --graph --oneline --all
```

### 40. git log --author
Filter commits by author.
```bash
git log --author="<name>"
# Example: Commits by specific author
git log --author="John Doe"
```

### 41. git log --grep
Search commit messages.
```bash
git log --grep="<pattern>"
# Example: Search for "fix"
git log --grep="fix"
```

### 42. git shortlog
Summarize git log output.
```bash
git shortlog
# Example: Summary by author
git shortlog -sn
```

## Working with Patches

### 43. git format-patch
Create patches from commits.
```bash
git format-patch <commit>
# Example: Create patch for last commit
git format-patch HEAD~1
```

### 44. git apply
Apply a patch to the working directory.
```bash
git apply <patch-file>
# Example: Apply patch
git apply 0001-fix-bug.patch
```

### 45. git am
Apply patches from email.
```bash
git am <patch-file>
# Example: Apply mail patch
git am 0001-fix-bug.patch
```

## Advanced Branching

### 46. git worktree
Manage multiple working trees.
```bash
git worktree add <path> <branch>
# Example: Add worktree
git worktree add ../project-feature feature-branch
```

### 47. git switch
Switch branches (newer alternative to checkout).
```bash
git switch <branch>
# Example: Switch branch
git switch main
# Create and switch
git switch -c new-feature
```

### 48. git restore
Restore working tree files.
```bash
git restore <file>
# Example: Discard changes
git restore index.html
# Restore from specific commit
git restore --source=HEAD~1 index.html
```

## Repository Maintenance

### 49. git gc
Clean up unnecessary files and optimize repository.
```bash
git gc
# Example: Garbage collect
git gc --aggressive
```

### 50. git fsck
Verify the connectivity and validity of objects in the database.
```bash
git fsck
# Example: Check repository integrity
git fsck
```

## Bonus: Useful Git Aliases

Create shortcuts for commonly used commands:

```bash
# Add aliases to ~/.gitconfig
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
```

## Quick Reference Table

| Command | Description | Example |
|---------|-------------|---------|
| `git init` | Initialize repository | `git init` |
| `git add` | Stage files | `git add .` |
| `git commit` | Commit changes | `git commit -m "message"` |
| `git status` | Check status | `git status` |
| `git log` | View history | `git log --oneline` |
| `git branch` | Manage branches | `git branch feature` |
| `git checkout` | Switch branches | `git checkout feature` |
| `git merge` | Merge branches | `git merge feature` |
| `git push` | Push to remote | `git push origin main` |
| `git pull` | Pull from remote | `git pull origin main` |

This cheatsheet covers the most essential Git commands you'll need for effective version control. Start with the basic commands and gradually incorporate the more advanced ones as you become more comfortable with Git. Remember, practice is key to mastering Git!

---

*This cheatsheet is designed to be a quick reference guide. For detailed explanations, refer to the official Git documentation at [git-scm.com](https://git-scm.com/doc).*