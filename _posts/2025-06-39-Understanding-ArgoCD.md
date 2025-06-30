---
layout: post
title: "🚀 Understanding ArgoCD: Installation, Usage, and Troubleshooting"
description: "Learn what ArgoCD is, how to install it, use it effectively, troubleshoot issues, and leverage its CLI commands."
excerpt: "A comprehensive guide to understanding, installing, and using ArgoCD for GitOps workflows, including troubleshooting tips and CLI commands."
---

ArgoCD is a declarative, GitOps continuous delivery tool for Kubernetes. It allows you to manage application deployments using Git repositories as the source of truth. With ArgoCD, you can automate application deployment, lifecycle management, and monitoring.

## What is ArgoCD?

ArgoCD is a Kubernetes-native tool that follows the GitOps methodology. It continuously monitors Git repositories for changes and ensures that the desired state of your applications matches the state defined in Git.

### Key Features:
- **Declarative GitOps**: Define your application state in Git.
- **Continuous Monitoring**: Automatically sync changes from Git to Kubernetes.
- **Multi-Cluster Support**: Manage applications across multiple Kubernetes clusters.
- **Web UI and CLI**: Provides both a web interface and CLI for managing applications.

---

## Installation

### Prerequisites:
- Kubernetes cluster (v1.20+ recommended)
- `kubectl` installed
- Admin access to the cluster

### Steps to Install ArgoCD:

1. **Install ArgoCD in Your Cluster**:
   Run the following command to install ArgoCD using the official manifests:
   ```bash
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
   ```

2. **Expose the ArgoCD Server**:
   By default, the ArgoCD server is not exposed externally. You can expose it using a LoadBalancer or port-forwarding:
   ```bash
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```

3. **Access the Web UI**:
   Open your browser and navigate to `https://localhost:8080`.

4. **Login to ArgoCD**:
   Retrieve the initial admin password:
   ```bash
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
   ```

---

## Using ArgoCD

### Add a Git Repository:
To connect a Git repository to ArgoCD, use the CLI:
```bash
argocd repo add https://github.com/your-repo.git --username <username> --password <password>
```

### Create an Application:
Define an application that ArgoCD will manage:
```bash
argocd app create my-app \
  --repo https://github.com/your-repo.git \
  --path ./manifests \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace default
```

### Sync Applications:
Sync the application state from Git to Kubernetes:
```bash
argocd app sync my-app
```

### Monitor Applications:
Check the status of your applications:
```bash
argocd app get my-app
```

---

## Troubleshooting

### Common Issues:
1. **Application Out of Sync**:
   Run `argocd app diff my-app` to see differences between Git and the cluster.

2. **Authentication Issues**:
   Ensure the correct credentials are used for the Git repository.

3. **Network Issues**:
   Verify that the ArgoCD server can reach the Git repository and Kubernetes API.

### Debugging Commands:
- Check ArgoCD logs:
  ```bash
  kubectl logs -n argocd -l app.kubernetes.io/name=argocd-server
  ```
- Verify cluster connectivity:
  ```bash
  argocd cluster list
  ```

---

## CLI Commands

### Login to ArgoCD:
```bash
argocd login <ARGOCD_SERVER>
```

### List Applications:
```bash
argocd app list
```

### Delete an Application:
```bash
argocd app delete my-app
```

### Update an Application:
```bash
argocd app set my-app --repo https://github.com/new-repo.git
```

---

## Conclusion

ArgoCD simplifies application deployment and management in Kubernetes by leveraging GitOps principles. With its powerful CLI and web UI, you can automate workflows, monitor application states, and troubleshoot issues effectively.

Whether you're deploying a single application or managing multi-cluster environments, ArgoCD is a must-have tool for Kubernetes users.

---
Thanks for reading! 🚀