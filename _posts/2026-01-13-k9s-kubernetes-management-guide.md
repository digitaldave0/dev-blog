---
layout: post
title: "K9s: The Ultimate Terminal UI for Kubernetes Management"
date: 2026-01-13
categories: [kubernetes, devops, tools]
tags: [kubernetes, k9s, devops, terminal, cli, container-orchestration]
---

## Introduction

Managing Kubernetes clusters from the command line with `kubectl` can be tedious and time-consuming. Enter **k9s** - a powerful terminal-based UI that provides a real-time, interactive way to manage your Kubernetes clusters. Think of it as a "top" command for Kubernetes, but with superpowers.

K9s makes it easier to navigate, observe, and manage your applications running on Kubernetes. It continuously monitors cluster resources and provides a visual, menu-driven interface that significantly reduces the complexity of working with Kubernetes.

## Why Use K9s?

### Key Benefits

- **Real-time Monitoring**: Watch your cluster resources update live
- **Faster Navigation**: Navigate between namespaces and resources with simple key presses
- **Resource Management**: View logs, describe resources, edit manifests, and delete resources without complex kubectl commands
- **Context Switching**: Easily switch between different clusters and namespaces
- **Visual Feedback**: Color-coded status indicators make it easy to spot issues
- **Reduced Typing**: Execute common operations with single key commands
- **Plugin Support**: Extend functionality with custom plugins

## Installation

### macOS
```bash
# Using Homebrew
brew install k9s

# Using MacPorts
sudo port install k9s
```

### Linux
```bash
# Using snap
sudo snap install k9s

# Using pacman (Arch Linux)
sudo pacman -S k9s

# Using apt (Ubuntu/Debian) - from official releases
curl -sL https://github.com/derailed/k9s/releases/latest/download/k9s_Linux_amd64.tar.gz | tar xvz -C /tmp
sudo mv /tmp/k9s /usr/local/bin/
```

### Windows
```powershell
# Using Chocolatey
choco install k9s

# Using Scoop
scoop install k9s
```

### Using Go
```bash
go install github.com/derailed/k9s@latest
```

## Getting Started

Simply run k9s in your terminal:

```bash
k9s
```

K9s will automatically use your current kubectl context. You can also specify a specific context:

```bash
k9s --context my-cluster-context
```

## Essential Commands Reference

### Navigation Commands

| Command | Description |
|---------|-------------|
| `:` | Enter command mode |
| `/` | Filter resources |
| `Esc` | Exit command/filter mode |
| `?` | Show keyboard shortcuts |
| `Ctrl-a` | Show all available resources |
| `Ctrl-c` | Quit k9s |
| `:q` | Quit k9s |
| `0-9` | Select namespace (from recent list) |

### Resource Navigation

| Command | Description |
|---------|-------------|
| `:pods` or `:po` | View pods |
| `:deployments` or `:deploy` | View deployments |
| `:services` or `:svc` | View services |
| `:namespaces` or `:ns` | View namespaces |
| `:nodes` or `:no` | View nodes |
| `:configmaps` or `:cm` | View config maps |
| `:secrets` | View secrets |
| `:ingress` or `:ing` | View ingresses |
| `:jobs` | View jobs |
| `:cronjobs` or `:cj` | View cron jobs |
| `:statefulsets` or `:sts` | View stateful sets |
| `:daemonsets` or `:ds` | View daemon sets |
| `:persistentvolumes` or `:pv` | View persistent volumes |
| `:persistentvolumeclaims` or `:pvc` | View persistent volume claims |

### Resource Actions

| Command | Description |
|---------|-------------|
| `Enter` | View resource details |
| `d` | Describe resource |
| `v` | View resource YAML |
| `e` | Edit resource |
| `l` | View logs (for pods) |
| `Ctrl-l` | Toggle auto-refresh logs |
| `s` | Shell into container |
| `Ctrl-d` | Delete resource |
| `y` | View resource as YAML |
| `f` | Port-forward (for services/pods) |
| `z` | Show last applied configuration |
| `Ctrl-z` | Suspend/Resume resource updates |

### Filtering and Sorting

| Command | Description |
|---------|-------------|
| `/` + text | Filter by name |
| `Ctrl-s` | Save current filter |
| `Ctrl-r` | Toggle auto-refresh |
| `Shift-f` | Toggle fuzzy filter |
| `Ctrl-f` | Toggle full screen |
| `Shift-a` | Sort by age |
| `Shift-n` | Sort by name |

### Context and Namespace Management

| Command | Description |
|---------|-------------|
| `:ctx` | View and switch contexts |
| `:ns` | View and switch namespaces |
| `Shift-0` | View all namespaces |
| `:contexts` | List all available contexts |

### Log Viewing Commands

| Command | Description |
|---------|-------------|
| `0` | Show previous logs |
| `1` | Toggle auto-scroll |
| `2` | Toggle wrap |
| `3` | Toggle timestamps |
| `4` | Download logs |
| `/` | Filter logs |
| `>` | Next match |
| `<` | Previous match |

## Pro Tips and Tricks

### 1. Aliases for Quick Access

k9s supports kubectl-style aliases. You can type shortened versions:

```
:po    → pods
:svc   → services
:deploy → deployments
:ns    → namespaces
:no    → nodes
:cm    → configmaps
```

### 2. Regex Filtering

Use regex patterns when filtering resources:

```
/^app-        # Find resources starting with "app-"
/production$  # Find resources ending with "production"
/nginx|apache # Find resources containing nginx OR apache
```

### 3. Custom Skins

Create a custom skin for k9s by editing `~/.config/k9s/skin.yml`:

```yaml
k9s:
  body:
    fgColor: dodgerblue
  prompt:
    fgColor: cadetblue
  info:
    fgColor: lightskyblue
  title:
    fgColor: aqua
```

### 4. Benchmarking Resources

Press `Shift-b` on a resource to run benchmarks and test performance.

### 5. Xray View

Press `x` on a pod to see an xray view showing all related resources (services, config maps, secrets, etc.).

### 6. Pulse View

Press `p` to see the pulse view - a real-time visualization of cluster metrics and resource utilization.

### 7. Custom Plugins

Create custom plugins in `~/.config/k9s/plugin.yml`:

```yaml
plugin:
  debug:
    shortCut: Shift-D
    description: Debug Pod
    scopes:
      - pods
    command: kubectl
    background: false
    args:
      - debug
      - -it
      - $NAME
      - -n
      - $NAMESPACE
      - --image=busybox
```

### 8. Popeye Integration

K9s can integrate with Popeye (a Kubernetes cluster sanitizer). Press `Shift-p` to run Popeye scans.

### 9. Resource Usage Monitoring

- Press `Shift-t` to toggle CPU/Memory graphs
- Use `:top` to see resource usage across nodes

### 10. Quick Shell Access

When viewing a pod:
1. Press `Enter` to view containers
2. Navigate to desired container
3. Press `s` to shell into it

## Advanced Configuration

### Config File Location

K9s stores its configuration in:
- macOS/Linux: `~/.config/k9s/config.yml`
- Windows: `%AppData%\k9s\config.yml`

### Sample Configuration

```yaml
k9s:
  refreshRate: 2
  maxConnRetry: 5
  enableMouse: true
  headless: false
  logoless: false
  crumbsless: false
  readOnly: false
  noExitOnCtrlC: false
  skipLatestRevCheck: false
  screenDumpDir: /tmp/k9s-screens
```

### Setting Default Namespace

Edit your config to set a default namespace:

```yaml
k9s:
  clusters:
    my-cluster:
      namespace:
        active: production
        favorites:
          - default
          - kube-system
          - production
          - staging
```

## Common Workflows

### Debugging a Failing Pod

1. Launch k9s: `k9s`
2. Navigate to pods: `:po`
3. Filter for your pod: `/your-pod-name`
4. View logs: `l`
5. If needed, describe pod: `Esc` then `d`
6. Check events and conditions
7. Shell into pod if necessary: `s`

### Updating a Deployment

1. Navigate to deployments: `:deploy`
2. Find your deployment
3. Edit it: `e`
4. Make changes in your editor
5. Save and exit
6. Watch the rollout: navigate to pods and observe new pods spinning up

### Monitoring Resource Usage

1. View nodes: `:no`
2. Toggle metrics: `Shift-t`
3. Sort by CPU/Memory
4. Drill into specific node with `Enter`
5. View pods on that node

### Port Forwarding for Local Testing

1. Navigate to service or pod: `:svc` or `:po`
2. Select target resource
3. Press `f` for port-forward
4. Specify local and remote ports
5. Access application on localhost

## Troubleshooting

### K9s Won't Start

Check your kubeconfig:
```bash
kubectl cluster-info
```

Verify k9s can access the cluster:
```bash
k9s info
```

### Performance Issues

Increase refresh rate in config:
```yaml
refreshRate: 5  # Update every 5 seconds instead of 2
```

### Missing Resources

Ensure your RBAC permissions allow viewing resources:
```bash
kubectl auth can-i list pods --all-namespaces
```

## Keyboard Shortcuts Cheatsheet

### Quick Reference Card

```
┌─────────────────────────────────────────────────┐
│            K9s Essential Shortcuts              │
├─────────────────────────────────────────────────┤
│ Navigation                                      │
│  :resource    → Go to resource type             │
│  /            → Filter current view             │
│  Enter        → View details                    │
│  Esc          → Go back/Cancel                  │
│  ?            → Help                            │
├─────────────────────────────────────────────────┤
│ Actions                                         │
│  d            → Describe resource               │
│  e            → Edit resource                   │
│  l            → View logs                       │
│  s            → Shell into container            │
│  y            → View YAML                       │
│  Ctrl-d       → Delete resource                 │
│  f            → Port forward                    │
├─────────────────────────────────────────────────┤
│ Views                                           │
│  x            → Xray view                       │
│  p            → Pulse view                      │
│  Shift-t      → Toggle metrics                  │
├─────────────────────────────────────────────────┤
│ Context                                         │
│  :ctx         → Switch context                  │
│  :ns          → Switch namespace                │
│  Shift-0      → All namespaces                  │
├─────────────────────────────────────────────────┤
│ System                                          │
│  Ctrl-a       → Show all resources              │
│  Ctrl-r       → Toggle auto-refresh             │
│  Ctrl-c/:q    → Quit                            │
└─────────────────────────────────────────────────┘
```

## Comparison with kubectl

| Task | kubectl | k9s |
|------|---------|-----|
| List pods | `kubectl get pods` | `:po` |
| View logs | `kubectl logs pod-name` | Navigate + `l` |
| Describe pod | `kubectl describe pod pod-name` | Navigate + `d` |
| Edit deployment | `kubectl edit deploy deploy-name` | `:deploy` + Navigate + `e` |
| Delete resource | `kubectl delete pod pod-name` | Navigate + `Ctrl-d` |
| Port forward | `kubectl port-forward pod-name 8080:80` | Navigate + `f` |
| Switch namespace | `kubectl config set-context --current --namespace=ns` | `:ns` + select |

## Conclusion

K9s is an indispensable tool for anyone working with Kubernetes regularly. It combines the power of kubectl with the convenience of a visual interface, all within your terminal. By mastering k9s commands and workflows, you can significantly speed up your Kubernetes management tasks and reduce errors.

The learning curve is minimal - start with basic navigation (`:po`, `:svc`, `:deploy`) and gradually incorporate more advanced features like filtering, xray views, and custom plugins. Before long, you'll wonder how you ever managed Kubernetes without it.

## Resources

- [K9s GitHub Repository](https://github.com/derailed/k9s)
- [K9s Documentation](https://k9scli.io/)
- [K9s Plugins Repository](https://github.com/derailed/k9s/tree/master/plugins)
- [Kubectl Command Reference](https://kubernetes.io/docs/reference/kubectl/)

---

*Happy cluster managing! 🚀*
