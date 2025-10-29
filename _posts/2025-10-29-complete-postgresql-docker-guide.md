---
layout: post
title: "Complete Guide: Setting Up PostgreSQL Server on Docker with Data Management, Backup, and Security"
description: "Comprehensive tutorial for running PostgreSQL on Docker including setup, data management, backup strategies, security hardening, and extensive housekeeping commands."
tags:
  [
    postgresql,
    postgres,
    docker,
    database,
    backup,
    security,
    tutorial,
    data-management,
    docker-compose,
    database-administration,
    postgresql-docker,
    psql,
    pgadmin,
  ]
icon: 🐘
excerpt: >
  In-depth guide to running PostgreSQL on Docker containers. Learn container setup, data operations, backup strategies, security best practices, performance tuning, and essential housekeeping commands for database administration.
author: "owner"
date: 2025-10-29 12:00:00 +0000
categories: [Database, Docker, Tutorial]
permalink: /posts/postgresql-docker-setup/
---

## Introduction

PostgreSQL is a powerful, open-source object-relational database management system known for its robustness, extensibility, and standards compliance. Running PostgreSQL in Docker containers provides excellent isolation, portability, and ease of management. This comprehensive guide will walk you through setting up, managing, and securing PostgreSQL databases in Docker containers.

We'll cover everything from basic setup to advanced administration, including data operations, backup strategies, security hardening, and extensive housekeeping commands that every database administrator should know.

## Prerequisites

Before we begin, ensure you have:

- Docker installed and running
- Docker Compose (recommended)
- Basic command-line knowledge
- At least 2GB free RAM
- 10GB free disk space for data and backups

```bash
# Verify Docker installation
docker --version
docker-compose --version

# Check available resources
docker system info
```

## Basic Docker Concepts for Databases

### Understanding Docker Volumes

Docker containers are ephemeral by default. For databases, we need persistent storage:

```bash
# Create a named volume for data persistence
docker volume create postgres_data

# List volumes
docker volume ls

# Inspect volume details
docker volume inspect postgres_data

# Remove volume (CAUTION: destroys data)
docker volume rm postgres_data
```

### Docker Networks

For secure communication between containers:

```bash
# Create a custom network
docker network create --driver bridge postgres_network

# List networks
docker network ls

# Inspect network
docker network inspect postgres_network
```

## Running PostgreSQL Container

### Basic PostgreSQL Setup

```bash
# Run PostgreSQL with basic configuration
docker run --name postgres-basic \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=mydb \
  -e POSTGRES_USER=myuser \
  -p 5432:5432 \
  -d postgres:latest

# Check if container is running
docker ps

# View container logs
docker logs postgres-basic
```

### Advanced PostgreSQL Setup with Volumes

```bash
# Create directories for persistent storage
mkdir -p ~/postgres/data ~/postgres/config ~/postgres/logs

# Run PostgreSQL with custom configuration and volumes
docker run --name postgres-advanced \
  -e POSTGRES_PASSWORD=SuperSecurePass123! \
  -e POSTGRES_DB=production_db \
  -e POSTGRES_USER=app_user \
  -v ~/postgres/data:/var/lib/postgresql/data \
  -v ~/postgres/config:/etc/postgresql \
  -v ~/postgres/logs:/var/log/postgresql \
  -p 5432:5432 \
  --restart unless-stopped \
  -d postgres:15

# Verify volumes are mounted correctly
docker inspect postgres-advanced | grep -A 10 "Mounts"
```

### PostgreSQL with Custom Configuration

```bash
# Create custom postgresql.conf
cat > ~/postgres/config/postgresql.conf << EOF
# Custom PostgreSQL configuration
listen_addresses = '*'
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
EOF

# Run with custom config
docker run --name postgres-custom \
  -e POSTGRES_PASSWORD=SecurePass123! \
  -v ~/postgres/data:/var/lib/postgresql/data \
  -v ~/postgres/config/postgresql.conf:/etc/postgresql/postgresql.conf \
  -p 5432:5432 \
  -d postgres:15 \
  -c 'config_file=/etc/postgresql/postgresql.conf'
```

## Docker Compose Setup

Create a `docker-compose.yml` file for easier management:

```yaml
version: "3.8"

services:
  postgres:
    image: postgres:15
    container_name: postgres_production
    restart: unless-stopped
    environment:
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./config/postgresql.conf:/etc/postgresql/postgresql.conf
      - ./init:/docker-entrypoint-initdb.d
      - ./logs:/var/log/postgresql
    ports:
      - "5432:5432"
    networks:
      - postgres_network
    command:
      - "postgres"
      - "-c"
      - "config_file=/etc/postgresql/postgresql.conf"

  pgadmin:
    image: dpage/pgadmin4
    container_name: postgres_pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: adminpass
    ports:
      - "8081:80"
    networks:
      - postgres_network
    depends_on:
      - postgres

volumes:
  postgres_data:
    driver: local

networks:
  postgres_network:
    driver: bridge
```

Create environment file `.env`:

```bash
POSTGRES_PASSWORD=UltraSecurePostgresPass2024!
POSTGRES_DB=myapp_production
POSTGRES_USER=myapp_user
```

Start the services:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f postgres

# Stop services
docker-compose down

# Stop and remove volumes (CAUTION: destroys data)
docker-compose down -v
```

## Connecting to the Database

### Using psql Client

```bash
# Connect to PostgreSQL from host
psql -h localhost -p 5432 -U myuser -d mydb

# Connect to default database
psql -h localhost -p 5432 -U postgres

# Connect using Docker exec
docker exec -it postgres-basic psql -U postgres

# Connect to running container
docker exec -it postgres_production psql -U postgres -d myapp_production
```

### Connection Examples

```bash
# Connect with specific database
psql postgresql://myuser:mypassword@localhost:5432/mydb

# Connect via socket (if using local PostgreSQL)
psql -U postgres -d mydb

# Connect with SSL
psql "postgresql://user:password@host:5432/db?sslmode=require"

# Connect as superuser
psql -U postgres -h localhost -d postgres
```

### Using psql in Docker

```bash
# Run psql client in a temporary container
docker run -it --rm \
  --network postgres_network \
  postgres:15 \
  psql -h postgres_production -U myapp_user -d myapp_production

# Or use a dedicated PostgreSQL client container
docker run -it --rm \
  --network postgres_network \
  postgres:15 \
  psql -h postgres -U postgres -d postgres
```

## Database and User Management

### Creating Databases

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create a new database
CREATE DATABASE ecommerce_db
  WITH OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;

-- Create database with specific options
CREATE DATABASE analytics_db
  WITH OWNER = analytics_user
  ENCODING = 'UTF8'
  CONNECTION LIMIT = 50;

-- List all databases
\l
SELECT datname FROM pg_database;

-- Switch to a database
\c ecommerce_db

-- Show current database
SELECT current_database();
```

### User Management

```sql
-- Create a new user/role
CREATE USER app_user WITH PASSWORD 'SecurePass123!';

-- Create user with specific options
CREATE ROLE readonly_user WITH
  LOGIN
  PASSWORD 'ReadOnlyPass456!'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

-- Create superuser
CREATE USER admin_user WITH
  SUPERUSER
  PASSWORD 'AdminPass789!'
  CREATEDB
  CREATEROLE;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO app_user;
GRANT CONNECT ON DATABASE analytics_db TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Grant specific privileges
GRANT SELECT, INSERT, UPDATE ON users TO webapp;
GRANT CREATE ON SCHEMA public TO developer;

-- Revoke privileges
REVOKE INSERT ON users FROM readonly_user;

-- Change password
ALTER USER app_user PASSWORD 'NewSecurePass456!';

-- Rename user
ALTER USER old_user RENAME TO new_user;

-- Drop user
DROP USER temp_user;

-- Show users/roles
\du
SELECT * FROM pg_roles;
```

### Database Initialization Scripts

Create SQL files in `/docker-entrypoint-initdb.d/`:

```sql
-- 01_create_databases.sql
CREATE DATABASE IF NOT EXISTS app_production
  WITH OWNER = postgres
  ENCODING = 'UTF8';

CREATE DATABASE IF NOT EXISTS app_development
  WITH OWNER = postgres
  ENCODING = 'UTF8';

-- 02_create_users.sql
CREATE USER IF NOT EXISTS app_prod WITH PASSWORD 'ProdPass123!';
CREATE USER IF NOT EXISTS app_dev WITH PASSWORD 'DevPass456!';

GRANT ALL PRIVILEGES ON DATABASE app_production TO app_prod;
GRANT ALL PRIVILEGES ON DATABASE app_development TO app_dev;

-- 03_create_schema.sql
\c app_production

CREATE SCHEMA IF NOT EXISTS app AUTHORIZATION app_prod;

-- Grant schema privileges
GRANT USAGE ON SCHEMA app TO app_prod;
GRANT CREATE ON SCHEMA app TO app_prod;
```

## Adding and Managing Data

### Creating Tables

```sql
-- Connect to database
\c ecommerce_db

-- Create a simple table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create table with constraints and indexes
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  category_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(name),
  CONSTRAINT positive_price CHECK (price > 0)
);

-- Create table with partitioning
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE orders_2024 PARTITION OF orders
  FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

CREATE TABLE orders_2025 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');
```

### Inserting Data

```sql
-- Basic INSERT
INSERT INTO users (username, email) VALUES ('john_doe', 'john@example.com');

-- Multiple rows INSERT
INSERT INTO users (username, email) VALUES
  ('jane_smith', 'jane@example.com'),
  ('bob_johnson', 'bob@example.com'),
  ('alice_williams', 'alice@example.com');

-- INSERT with RETURNING
INSERT INTO users (username, email) VALUES ('charlie_brown', 'charlie@example.com')
RETURNING id, username;

-- INSERT with ON CONFLICT
INSERT INTO user_stats (user_id, login_count, last_login)
VALUES (1, 1, CURRENT_TIMESTAMP)
ON CONFLICT (user_id) DO UPDATE SET
  login_count = user_stats.login_count + 1,
  last_login = CURRENT_TIMESTAMP;

-- Bulk INSERT with COPY
COPY users (username, email, created_at)
FROM '/tmp/users.csv'
WITH CSV HEADER;
```

### Data Export and Import

```bash
# Export table to CSV
psql -U postgres -d ecommerce_db -c "COPY users TO '/tmp/users_export.csv' WITH CSV HEADER;"

# Export query results
psql -U postgres -d ecommerce_db -c "COPY (SELECT username, email FROM users WHERE created_at > '2024-01-01') TO '/tmp/recent_users.csv' WITH CSV;"

# Import from CSV
psql -U postgres -d ecommerce_db -c "COPY users (username, email) FROM '/tmp/new_users.csv' WITH CSV HEADER;"

# Export entire database
pg_dump -U postgres -h localhost ecommerce_db > ecommerce_backup.sql

# Import database
psql -U postgres -d ecommerce_db < ecommerce_backup.sql
```

### Advanced Data Operations

```sql
-- Upsert with CTE
WITH upsert AS (
  UPDATE users SET email = 'newemail@example.com' WHERE username = 'john_doe'
  RETURNING *
)
INSERT INTO users (username, email) SELECT 'john_doe', 'newemail@example.com'
WHERE NOT EXISTS (SELECT 1 FROM upsert);

-- Insert with generated columns
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) GENERATED ALWAYS AS ('PRD-' || id::text) STORED,
  price DECIMAL(10,2) NOT NULL
);

-- JSON data handling
CREATE TABLE user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  profile_data JSONB
);

INSERT INTO user_profiles (user_id, profile_data)
VALUES (1, '{"name": "John Doe", "preferences": {"theme": "dark", "notifications": true}}');

-- Query JSON data
SELECT profile_data->>'name' as name,
       profile_data->'preferences'->>'theme' as theme
FROM user_profiles;
```

## Backup Strategies

### Logical Backups with pg_dump

```bash
# Basic database backup
pg_dump -U postgres -h localhost ecommerce_db > ecommerce_backup.sql

# Backup all databases
pg_dumpall -U postgres > all_databases_backup.sql

# Backup with compression
pg_dump -U postgres ecommerce_db | gzip > ecommerce_backup.sql.gz

# Backup specific tables
pg_dump -U postgres ecommerce_db -t users -t products > tables_backup.sql

# Backup schema only
pg_dump -U postgres -s ecommerce_db > schema_only.sql

# Backup data only
pg_dump -U postgres -a ecommerce_db > data_only.sql

# Backup with custom format (compressed)
pg_dump -U postgres -Fc ecommerce_db > ecommerce_backup.dump
```

### Advanced pg_dump Options

```bash
# Backup with verbose output
pg_dump -U postgres -v ecommerce_db > backup_verbose.sql

# Backup excluding specific tables
pg_dump -U postgres ecommerce_db --exclude-table=logs_* > backup_no_logs.sql

# Backup with column inserts (slower but more compatible)
pg_dump -U postgres --column-inserts ecommerce_db > backup_column_inserts.sql

# Backup with parallel processing
pg_dump -U postgres -j 4 ecommerce_db > backup_parallel.sql

# Backup specific schema
pg_dump -U postgres -n public ecommerce_db > public_schema_backup.sql
```

### Physical Backups

```bash
# Stop container for consistent backup
docker stop postgres_production

# Copy data directory
docker cp postgres_production:/var/lib/postgresql/data ~/postgres_physical_backup

# Start container
docker start postgres_production

# Create base backup (hot backup)
docker exec postgres_production psql -U postgres -c "SELECT pg_start_backup('backup_label');"
docker cp postgres_production:/var/lib/postgresql/data ~/postgres_hot_backup
docker exec postgres_production psql -U postgres -c "SELECT pg_stop_backup();"
```

### Continuous Archiving (WAL Archiving)

```bash
# Enable WAL archiving in postgresql.conf
cat >> ~/postgres/config/postgresql.conf << EOF
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/archive/%f'
EOF

# Create archive directory
docker exec postgres_production mkdir -p /var/lib/postgresql/archive

# Restart container
docker-compose restart postgres

# Monitor archiving
docker exec postgres_production psql -U postgres -c "SELECT * FROM pg_stat_archiver;"
```

### Automated Backup Script

Create a comprehensive backup script:

```bash
#!/bin/bash
# postgres_backup.sh

BACKUP_DIR="/home/user/postgres_backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="postgres_production"
DB_NAME="ecommerce_db"
PG_USER="postgres"
PG_PASSWORD="your_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Logical backup
echo "Starting logical backup..."
docker exec $CONTAINER_NAME pg_dump -U $PG_USER $DB_NAME > $BACKUP_DIR/logical_backup_$DATE.sql

# Schema-only backup
docker exec $CONTAINER_NAME pg_dump -U $PG_USER -s $DB_NAME > $BACKUP_DIR/schema_$DATE.sql

# Compress backups
gzip $BACKUP_DIR/logical_backup_$DATE.sql
gzip $BACKUP_DIR/schema_$DATE.sql

# Physical backup (requires stopping container)
echo "Starting physical backup..."
docker stop $CONTAINER_NAME
docker cp $CONTAINER_NAME:/var/lib/postgresql/data $BACKUP_DIR/physical_backup_$DATE
docker start $CONTAINER_NAME

# Compress physical backup
tar -czf $BACKUP_DIR/physical_backup_$DATE.tar.gz -C $BACKUP_DIR physical_backup_$DATE
rm -rf $BACKUP_DIR/physical_backup_$DATE

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR"
```

Make it executable and schedule with cron:

```bash
chmod +x postgres_backup.sh

# Add to crontab for daily backups at 2 AM
echo "0 2 * * * /home/user/postgres_backup.sh" | crontab -

# View cron jobs
crontab -l
```

## Restore Procedures

### Restore from pg_dump

```bash
# Restore single database
psql -U postgres -d ecommerce_db < ecommerce_backup.sql

# Restore to new database
createdb -U postgres -T template0 restored_db
psql -U postgres -d restored_db < ecommerce_backup.sql

# Restore compressed backup
gunzip < ecommerce_backup.sql.gz | psql -U postgres -d ecommerce_db

# Restore custom format backup
pg_restore -U postgres -d ecommerce_db ecommerce_backup.dump

# Restore with verbose output
pg_restore -U postgres -v -d ecommerce_db ecommerce_backup.dump
```

### Point-in-Time Recovery

```bash
# Restore base backup
tar -xzf base_backup.tar.gz -C /var/lib/postgresql/data

# Create recovery.conf
cat > /var/lib/postgresql/data/recovery.conf << EOF
restore_command = 'cp /path/to/archive/%f %p'
recovery_target_time = '2024-10-29 15:30:00'
recovery_target_action = 'promote'
EOF

# Start PostgreSQL in recovery mode
docker start postgres_production
```

### Physical Restore

```bash
# Stop container
docker-compose down

# Remove old volume
docker volume rm postgres_postgres_data

# Create new volume
docker volume create postgres_data

# Copy backup data to new volume
docker run --rm -v postgres_data:/data -v ~/postgres_physical_backup:/backup alpine cp -r /backup/* /data/

# Start container
docker-compose up -d postgres
```

## Security Best Practices

### Secure Initial Setup

```sql
-- Change default passwords
ALTER USER postgres PASSWORD 'NewUltraSecurePass123!';

-- Remove default public schema privileges
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

-- Create specific schemas with restricted access
CREATE SCHEMA app AUTHORIZATION app_user;
GRANT USAGE ON SCHEMA app TO app_user;
```

### User Security

```sql
-- Create users with strong passwords and restrictions
CREATE USER webapp WITH
  PASSWORD 'ComplexPass123!@#'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION
  CONNECTION LIMIT 10;

-- Create read-only user
CREATE USER readonly_user WITH
  PASSWORD 'ReadOnlyPass456!'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

-- Grant minimal privileges
GRANT CONNECT ON DATABASE mydb TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Force password change
ALTER USER temp_user PASSWORD 'TempPass123!' VALID UNTIL '2024-11-01';

-- Lock/unlock accounts
ALTER USER suspicious_user NOLOGIN;
ALTER USER suspicious_user LOGIN;
```

### Network Security

```bash
# Configure pg_hba.conf for host-based authentication
cat > ~/postgres/config/pg_hba.conf << EOF
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             192.168.1.0/24          md5
host    all             app_user        10.0.0.0/8              md5
hostssl all             all             0.0.0.0/0               cert
EOF

# Bind to specific addresses
echo "listen_addresses = 'localhost,192.168.1.100'" >> ~/postgres/config/postgresql.conf
```

### SSL/TLS Configuration

```bash
# Generate SSL certificates
openssl req -new -x509 -days 365 -nodes -text -out server.crt -keyout server.key -subj "/CN=postgres.example.com"
chmod 600 server.key
chown postgres:postgres server.key

# Configure SSL in postgresql.conf
cat >> ~/postgres/config/postgresql.conf << EOF
ssl = on
ssl_cert_file = '/etc/ssl/certs/server.crt'
ssl_key_file = '/etc/ssl/private/server.key'
ssl_ca_file = '/etc/ssl/certs/ca.crt'
EOF

# Require SSL for specific users
# In pg_hba.conf
hostssl all app_user 0.0.0.0/0 cert
```

### Data Encryption

```sql
-- Enable pgcrypto extension
CREATE EXTENSION pgcrypto;

-- Encrypt sensitive data
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  encrypted_ssn BYTEA,
  email VARCHAR(100)
);

-- Insert encrypted data
INSERT INTO users (username, encrypted_ssn, email)
VALUES (
  'john_doe',
  pgp_sym_encrypt('123-45-6789', 'encryption_key'),
  'john@example.com'
);

-- Query decrypted data
SELECT username,
       pgp_sym_decrypt(encrypted_ssn, 'encryption_key') as ssn,
       email
FROM users WHERE username = 'john_doe';
```

## Performance Tuning

### Memory Configuration

```bash
# Optimize memory settings in postgresql.conf
cat >> ~/postgres/config/postgresql.conf << EOF
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
EOF
```

### Query Optimization

```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email LIKE 'john%';

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_created_at ON users (created_at);
CREATE INDEX idx_products_category_price ON products (category_id, price);

-- Create partial index
CREATE INDEX idx_active_users ON users (email) WHERE active = true;

-- Analyze tables
ANALYZE users;
ANALYZE products;

-- View index usage
SELECT * FROM pg_stat_user_indexes WHERE relname = 'users';

-- View slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### Connection Pooling with PgBouncer

```yaml
# docker-compose.yml with PgBouncer
version: "3.8"

services:
  postgres:
    image: postgres:15
    # ... postgres config ...

  pgbouncer:
    image: edoburu/pgbouncer
    container_name: postgres_pgbouncer
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: pgbouncer
      DB_PASSWORD: pgbouncerpass
      POOL_MODE: transaction
      MAX_CLIENT_CONN: 1000
      DEFAULT_POOL_SIZE: 20
    ports:
      - "6432:6432"
    networks:
      - postgres_network
    depends_on:
      - postgres
```

## Monitoring and Maintenance

### Health Checks

```bash
# Basic health check
docker exec postgres_production psql -U postgres -c "SELECT 1;"

# Check database status
docker exec postgres_production psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Monitor disk usage
docker exec postgres_production du -sh /var/lib/postgresql/data

# Check log files
docker exec postgres_production tail -f /var/log/postgresql/postgresql.log
```

### Monitoring Queries

```sql
-- Show current connections
SELECT * FROM pg_stat_activity;

-- Show database statistics
SELECT * FROM pg_stat_database;

-- Show table statistics
SELECT * FROM pg_stat_user_tables;

-- Show index usage
SELECT * FROM pg_stat_user_indexes;

-- Show locks
SELECT * FROM pg_locks;

-- Show running queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active'
ORDER BY duration DESC;
```

### Log Analysis

```bash
# View PostgreSQL logs
docker exec postgres_production cat /var/log/postgresql/postgresql.log

# Search for specific errors
docker exec postgres_production grep "ERROR" /var/log/postgresql/postgresql.log

# Monitor slow queries (requires pg_stat_statements)
docker exec postgres_production psql -U postgres -c "SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 5;"

# Enable query logging
docker exec postgres_production psql -U postgres -c "ALTER SYSTEM SET log_statement = 'all';"
docker exec postgres_production psql -U postgres -c "SELECT pg_reload_conf();"
```

## Essential Housekeeping Commands

### Database Maintenance

```sql
-- Analyze database statistics
ANALYZE;

-- Analyze specific table
ANALYZE users;

-- Vacuum table to reclaim space
VACUUM users;

-- Vacuum full (reclaims more space but locks table)
VACUUM FULL users;

-- Reindex table
REINDEX TABLE users;

-- Reindex database
REINDEX DATABASE ecommerce_db;

-- Check table for corruption
SELECT * FROM pg_stat_user_tables WHERE n_dead_tup > 0;

-- Show database size
SELECT pg_size_pretty(pg_database_size('ecommerce_db'));

-- Show table sizes
SELECT schemaname, tablename, pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Index Management

```sql
-- Show indexes on a table
\di users*

-- Create index
CREATE INDEX idx_users_email ON users (email);

-- Create unique index
CREATE UNIQUE INDEX idx_users_username ON users (username);

-- Create composite index
CREATE INDEX idx_orders_user_date ON orders (user_id, created_at);

-- Create partial index
CREATE INDEX idx_active_users ON users (email) WHERE active = true;

-- Create functional index
CREATE INDEX idx_users_lower_email ON users (lower(email));

-- Drop index
DROP INDEX idx_users_email;

-- Rebuild index
REINDEX INDEX idx_users_email;

-- Show index usage statistics
SELECT * FROM pg_stat_user_indexes WHERE relname = 'users';
```

### Table Maintenance

```sql
-- Show table structure
\d users
\d+ users

-- Show table size
SELECT pg_size_pretty(pg_total_relation_size('users'));

-- Show disk usage by tables
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Truncate table (remove all data)
TRUNCATE TABLE temp_data;

-- Rename table
ALTER TABLE old_table RENAME TO new_table;

-- Add column
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Drop column
ALTER TABLE users DROP COLUMN old_column;

-- Change column type
ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(150);

-- Add constraint
ALTER TABLE users ADD CONSTRAINT chk_age CHECK (age >= 0);

-- Rename column
ALTER TABLE users RENAME COLUMN old_name TO new_name;
```

### User and Privilege Management

```sql
-- Show all users/roles
\du
SELECT * FROM pg_roles;

-- Show user grants
\dp users

-- Show current user
SELECT current_user;

-- Change user password
ALTER USER app_user PASSWORD 'newpassword';

-- Grant privileges
GRANT SELECT ON users TO readonly_user;
GRANT ALL PRIVILEGES ON DATABASE mydb TO app_user;

-- Revoke privileges
REVOKE INSERT ON users FROM readonly_user;

-- Show current connections
SELECT * FROM pg_stat_activity;

-- Terminate connection
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = 12345;
```

### Backup and Recovery Commands

```bash
# Quick logical backup
pg_dump -U postgres ecommerce_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression and progress
pg_dump -U postgres ecommerce_db | pv | gzip > backup.sql.gz

# Verify backup integrity
psql -U postgres -f backup.sql -d postgres

# Export specific data
psql -U postgres -c "COPY users TO '/tmp/users.csv' WITH CSV HEADER;"

# Import with error handling
psql -U postgres -f backup.sql -d ecommerce_db --set ON_ERROR_STOP=on 2> import_errors.log

# Point-in-time recovery setup
psql -U postgres -c "SELECT pg_start_backup('my_backup');"
# Copy WAL files
psql -U postgres -c "SELECT pg_stop_backup();"
```

### Log Management

```sql
-- Enable logging
ALTER SYSTEM SET logging_collector = 'on';
ALTER SYSTEM SET log_directory = 'log';
ALTER SYSTEM SET log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log';
SELECT pg_reload_conf();

-- Rotate logs
SELECT pg_rotate_logfile();

-- View current log file
SELECT pg_current_logfile();

-- Archive old logs
SELECT name FROM pg_ls_logdir() WHERE modification < now() - interval '7 days';
```

### Performance Monitoring

```sql
-- Show running queries
SELECT pid, age(now(), query_start), usename, query
FROM pg_stat_activity
WHERE state = 'active' AND pid <> pg_backend_pid()
ORDER BY query_start;

-- Show table bloat
SELECT schemaname, tablename,
       n_dead_tup,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_stat_user_tables
WHERE n_dead_tup > 0
ORDER BY n_dead_tup DESC;

-- Show cache hit ratio
SELECT sum(blks_hit)*100/sum(blks_hit+blks_read) as cache_hit_ratio
FROM pg_stat_database;

-- Show index hit ratio
SELECT sum(idx_blks_hit)*100/sum(idx_blks_hit+idx_blks_read) as idx_hit_ratio
FROM pg_stat_database;

-- Show WAL statistics
SELECT * FROM pg_stat_wal;
```

### Replication Management (Advanced)

```sql
-- Show replication status (on master)
SELECT * FROM pg_stat_replication;

-- Show recovery status (on replica)
SELECT * FROM pg_stat_wal_receiver;

-- Create replication slot
SELECT * FROM pg_create_physical_replication_slot('replica1');

-- Drop replication slot
SELECT pg_drop_replication_slot('replica1');

-- Promote standby to master
psql -U postgres -c "SELECT pg_promote();"
```

## Troubleshooting Common Issues

### Connection Issues

```bash
# Test connection
psql -h localhost -p 5432 -U postgres -c "SELECT version();"

# Check if PostgreSQL is listening
netstat -tlnp | grep 5432

# Check PostgreSQL status
docker logs postgres_production

# Reset user password
docker exec -it postgres_production psql -U postgres -c "ALTER USER myuser PASSWORD 'newpassword';"
```

### Performance Issues

```sql
-- Find long-running queries
SELECT pid, now() - query_start as duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '1 minute';

-- Check for locks
SELECT * FROM pg_locks WHERE NOT granted;

-- Analyze slow query
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Check table bloat
SELECT schemaname, tablename, n_dead_tup
FROM pg_stat_user_tables
WHERE n_dead_tup > 1000;
```

### Disk Space Issues

```sql
-- Check disk usage
df -h

-- Check PostgreSQL data directory size
du -sh /var/lib/postgresql/data

-- Find largest tables
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename))
FROM pg_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;

-- Vacuum to reclaim space
VACUUM FULL large_table;
```

### Replication Issues

```sql
-- Check replication lag
SELECT client_addr, state, sent_lsn, write_lsn, flush_lsn, replay_lsn
FROM pg_stat_replication;

-- Check WAL files
SELECT * FROM pg_ls_waldir();

-- Force WAL switch
SELECT pg_switch_wal();
```

## Advanced Topics

### Streaming Replication

```yaml
# Master configuration
version: "3.8"

services:
  postgres-master:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: masterpass
      POSTGRES_DB: mydb
    volumes:
      - master_data:/var/lib/postgresql/data
    command:
      - "postgres"
      - "-c"
      - "wal_level=replica"
      - "-c"
      - "max_wal_senders=10"
      - "-c"
      - "wal_keep_size=1GB"

  postgres-replica:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: replicapass
    volumes:
      - replica_data:/var/lib/postgresql/data
    command:
      - "postgres"
      - "-c"
      - "hot_standby=on"
    depends_on:
      - postgres-master
```

### Connection Pooling with PgPool-II

```yaml
version: "3.8"

services:
  pgpool:
    image: pgpool/pgpool:4.4
    container_name: postgres_pgpool
    environment:
      PGPOOL_BACKEND_HOSTNAME: postgres
      PGPOOL_BACKEND_PORT: 5432
      PGPOOL_BACKEND_WEIGHT: 1
      PGPOOL_ENABLE_LOAD_BALANCING: 1
      PGPOOL_NUM_INIT_CHILDREN: 32
      PGPOOL_MAX_POOL: 4
    ports:
      - "9999:9999"
    networks:
      - postgres_network
    depends_on:
      - postgres
```

### Partitioning

```sql
-- Create partitioned table
CREATE TABLE sales (
  id SERIAL,
  sale_date DATE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  customer_id INTEGER
) PARTITION BY RANGE (sale_date);

-- Create partitions
CREATE TABLE sales_2024_q1 PARTITION OF sales
  FOR VALUES FROM ('2024-01-01') TO ('2024-04-01');

CREATE TABLE sales_2024_q2 PARTITION OF sales
  FOR VALUES FROM ('2024-04-01') TO ('2024-07-01');

-- Automatic partition creation
CREATE OR REPLACE FUNCTION create_partition_if_not_exists(
  partition_date DATE
) RETURNS VOID AS $$
DECLARE
  partition_name TEXT;
  start_date DATE;
  end_date DATE;
BEGIN
  partition_name := 'sales_' || to_char(partition_date, 'YYYY_MM');
  start_date := date_trunc('month', partition_date);
  end_date := start_date + INTERVAL '1 month';

  IF NOT EXISTS (SELECT 1 FROM pg_class c JOIN pg_namespace n ON c.relnamespace = n.oid
                 WHERE c.relname = partition_name AND n.nspname = 'public') THEN
    EXECUTE format('CREATE TABLE %I PARTITION OF sales FOR VALUES FROM (%L) TO (%L)',
                   partition_name, start_date, end_date);
  END IF;
END;
$$ LANGUAGE plpgsql;
```

## Conclusion

PostgreSQL running in Docker containers provides a robust, scalable, and feature-rich database solution. This comprehensive guide covered everything from basic setup to advanced administration, including data operations, backup strategies, security hardening, and extensive housekeeping commands.

Key takeaways:

- Use Docker volumes for data persistence and Docker Compose for complex setups
- Implement comprehensive backup strategies with both logical and physical backups
- Secure your database with proper user management, SSL/TLS, and access controls
- Monitor performance and maintain regular housekeeping routines
- Use connection pooling for high-traffic applications
- Consider replication for high availability

With these practices, you'll have a production-ready PostgreSQL setup in Docker that can handle demanding workloads while maintaining data integrity and security.

## Resources

- [PostgreSQL Docker Documentation](https://hub.docker.com/_/postgres)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgAdmin Documentation](https://www.pgadmin.org/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Wiki](https://wiki.postgresql.org/)

Remember to regularly update your containers, monitor performance, and maintain backups. Database administration requires ongoing attention to ensure reliability and security.
