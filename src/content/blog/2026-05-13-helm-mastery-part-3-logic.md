---
title: 'Helm Chart Mastery Part 3: Advanced Patterns & Control Flow'
description: 'Master logic in your charts. Learn how to use if/else conditionals, range loops, and named templates to reduce duplication.'
pubDate: 2026-05-13T00:00:02.000Z
tags:
  - kubernetes
  - helm
  - automation
  - programming
series: 'Helm Chart Mastery'
heroImage: 'https://picsum.photos/seed/2026-05-13-helm-mastery-part-3/800/400'
---

Static templates are great, but the real power of Helm shines when you need to make decisions. In this third part of the **Helm Chart Mastery** series, we explore logic, iteration, and reusable code snippets.

## Conditionals: If/Else

Conditionals allow you to include or exclude parts of your manifest based on values.

```yaml
{{- if .Values.ingress.enabled -}}
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}-ingress
  annotations:
    {{- toYaml .Values.ingress.annotations | nindent 4 }}
spec:
  rules:
    - host: {{ .Values.ingress.host }}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {{ .Release.Name }}-service
                port:
                  number: 80
{{- end }}
```

### Truthiness in Helm
In the Go template engine, the following are considered **false**:
- A boolean `false`
- A numeric zero (`0`)
- An empty string (`""`)
- A `nil` (null)
- An empty collection (map, slice, etc.)

Everything else is **true**.

## Loops: Range

The `range` action allows you to iterate over a list or a map. This is essential for creating multiple environment variables, secrets, or host rules.

```yaml
# values.yaml
env:
  - name: DATABASE_URL
    value: "postgres://db:5432"
  - name: API_KEY
    value: "secret-key-123"

# templates/deployment.yaml
env:
{{- range .Values.env }}
  - name: {{ .name }}
    value: {{ .value | quote }}
{{- end }}
```

### Handling Scope in Loops
**CRITICAL NOTE**: Inside a `range` block, the context of the "Dot" (`.`) changes to the current item in the loop. If you need to access global values (like `.Release.Name`) from inside a loop, you have two options:
1.  Use the `$` variable: `{{ $.Release.Name }}` (the `$` always refers to the root scope).
2.  Define a variable before the loop: `{{- $relName := .Release.Name -}}`.

## Named Templates (Partials)

If you find yourself repeating the same YAML blocks (like common labels or selectors), you should use **Named Templates**. These are typically defined in `_helpers.tpl`.

### Defining a template:
```yaml
# templates/_helpers.tpl
{{- define "mychart.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
```

### Using a template:
```yaml
metadata:
  labels:
    {{- include "mychart.labels" . | nindent 4 }}
```

**Why `include` instead of `template`?**
The `template` directive is a built-in Go action, but it cannot be used with pipelines. The `include` function (provided by Helm) allows you to pipe the output into other functions like `nindent`, which is vital for maintaining YAML structure.

## Deep Research Insight: The `toYaml` Utility
The `toYaml` function is a lifesaver when you want to take a block of data from `values.yaml` and dump it directly into your template. Combined with `nindent`, it handles complex nested structures with zero manual formatting.

```yaml
# In values.yaml
nodeSelector:
  disktype: ssd
  region: us-east-1

# In template
nodeSelector:
  {{- toYaml .Values.nodeSelector | nindent 2 }}
```

## Conclusion of Part 3

You've moved beyond simple variable substitution. You can now build charts that adapt their entire structure based on user input and reuse logic across multiple files.

In the final installment, **Part 4**, we'll cover **Production-Grade Helm**: managing dependencies, using hooks for database migrations, and best practices for security.

---
_This is Part 3 of the **Helm Chart Mastery** series. Stay tuned for Part 4!_
