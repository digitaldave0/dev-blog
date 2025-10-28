---
layout: post
title: "🔄 Ansible Intermediate: Roles, Variables, and Templates"
categories: [DevOps, Automation, Tutorial]
excerpt: "Take your Ansible skills to the next level with roles, variables, and templates. Learn how to create reusable and flexible automation for complex deployments."
description: "A detailed guide to intermediate Ansible concepts including roles, variables, templates, and handlers. Features a practical example of deploying a load-balanced web application with customizable configurations."
---


# Intermediate Ansible: Beyond the Basics

Building on our previous tutorial, we'll explore intermediate Ansible concepts by creating a more complex deployment: a load-balanced web application with customizable configurations.

## Prerequisites

- Basic Ansible knowledge
- Understanding of YAML syntax
- Familiarity with web servers and load balancing
- Multiple target servers for testing

## Concepts Covered

1. Roles
2. Variables
3. Templates
4. Handlers
5. Conditionals
6. Tags

## Project Structure

```
webapp-deployment/
├── inventory/
│   ├── production
│   └── staging
├── group_vars/
│   ├── all.yml
│   ├── webservers.yml
│   └── loadbalancers.yml
├── roles/
│   ├── common/
│   ├── webapp/
│   └── loadbalancer/
└── site.yml
```

## Working Example: Load Balanced Web App

Let's create a deployment that:
- Sets up multiple web servers
- Configures Nginx as a load balancer
- Uses templates for configuration
- Implements handlers for service restarts

### 1. Inventory Setup

Create `inventory/staging`:
```ini
[webservers]
web1 ansible_host=192.168.1.11
web2 ansible_host=192.168.1.12

[loadbalancers]
lb1 ansible_host=192.168.1.10

[all:vars]
ansible_python_interpreter=/usr/bin/python3
```

### 2. Group Variables

Create `group_vars/all.yml`:
```yaml
---
app_name: mywebapp
app_version: "1.0.0"
app_port: 8080
domain: example.com
```

Create `group_vars/webservers.yml`:
```yaml
---
app_user: webapp
app_path: /var/www/{{ app_name }}
app_config_template: webapp.conf.j2
```

### 3. Role Structure

Create the webapp role:
```bash
ansible-galaxy init roles/webapp
```

### 4. Role Implementation

Create `roles/webapp/tasks/main.yml`:
```yaml
---
- name: Ensure app user exists
  user:
    name: "{{ app_user }}"
    shell: /bin/bash
    createhome: yes

- name: Create application directories
  file:
    path: "{{ item }}"
    state: directory
    owner: "{{ app_user }}"
    mode: '0755'
  with_items:
    - "{{ app_path }}"
    - "{{ app_path }}/config"

- name: Copy application configuration
  template:
    src: "{{ app_config_template }}"
    dest: "{{ app_path }}/config/app.conf"
    owner: "{{ app_user }}"
    mode: '0644'
  notify: restart webapp

- name: Deploy application files
  copy:
    src: files/webapp/
    dest: "{{ app_path }}"
    owner: "{{ app_user }}"
    mode: '0644'
  notify: restart webapp
```

Create `roles/webapp/handlers/main.yml`:
```yaml
---
- name: restart webapp
  service:
    name: "{{ app_name }}"
    state: restarted
```

### 5. Templates

Create `roles/webapp/templates/webapp.conf.j2`:
```jinja
# Application Configuration
app_name = {{ app_name }}
version = {{ app_version }}
port = {{ app_port }}

# Environment specific settings
{% if environment == 'production' %}
debug = false
log_level = ERROR
{% else %}
debug = true
log_level = DEBUG
{% endif %}

# Dynamic server list
servers = [
{% for host in groups['webservers'] %}
  "{{ hostvars[host]['ansible_host'] }}",
{% endfor %}
]
```

### 6. Main Playbook

Create `site.yml`:
```yaml
---
- name: Configure common settings
  hosts: all
  become: yes
  roles:
    - common

- name: Deploy web application
  hosts: webservers
  become: yes
  roles:
    - webapp
  tags:
    - webapp
    - deploy

- name: Configure load balancer
  hosts: loadbalancers
  become: yes
  roles:
    - loadbalancer
  tags:
    - loadbalancer
```

## Running the Deployment

1. Test syntax:
```bash
ansible-playbook -i inventory/staging site.yml --syntax-check
```

2. Dry run:
```bash
ansible-playbook -i inventory/staging site.yml --check
```

3. Deploy to staging:
```bash
ansible-playbook -i inventory/staging site.yml
```

4. Deploy specific roles:
```bash
ansible-playbook -i inventory/staging site.yml --tags webapp
```

## Advanced Features Used

1. **Templates with Conditionals**:
```jinja
{% if environment == 'production' %}
  # Production settings
{% else %}
  # Development settings
{% endif %}
```

2. **Dynamic Inventories**:
```yaml
{% for host in groups['webservers'] %}
  server {{ hostvars[host]['ansible_host'] }};
{% endfor %}
```

3. **Handlers for Service Management**:
```yaml
handlers:
  - name: restart webapp
    service:
      name: "{{ app_name }}"
      state: restarted
```

## Best Practices

1. **Role Organization**:
   - Keep roles focused and single-purpose
   - Use dependencies for shared functionality
   - Document role variables

2. **Variable Management**:
   - Use group_vars for common settings
   - Override variables at multiple levels
   - Use vault for sensitive data

3. **Template Usage**:
   - Keep templates simple
   - Use comments for clarity
   - Test template rendering separately

## Debugging Tips

1. Check template rendering:
```bash
ansible-playbook site.yml --check -vv
```

2. Debug variables:
```yaml
- debug:
    var: some_variable
```

3. Use tags for targeted runs:
```bash
ansible-playbook site.yml --tags "config,deploy"
```

## Conclusion

You've now learned how to create a modular, reusable Ansible deployment using roles, variables, and templates. This foundation will help you tackle more complex automation scenarios.

Stay tuned for our advanced Ansible tutorial where we'll explore custom modules, dynamic inventories, and complex orchestration patterns.
