---
layout: post
title: "Complete Guide: Setting Up MariaDB/MySQL Server on Docker with Data Management, Backup, and Security"
description: "Comprehensive tutorial for running MariaDB/MySQL on Docker including setup, data management, backup strategies, security hardening, and extensive housekeeping commands."
tags:
  [
    mariadb,
    mysql,
    docker,
    database,
    backup,
    security,
    tutorial,
    data-management,
    docker-compose,
    database-administration,
    mysql-docker,
    mariadb-docker,
  ]
icon: 🐬
excerpt: >
  In-depth guide to running MariaDB/MySQL on Docker containers. Learn container setup, data operations, backup strategies, security best practices, performance tuning, and essential housekeeping commands for database administration.
author: "owner"
date: 2025-10-29 11:00:00 +0000
categories: [Database, Docker, Tutorial]
permalink: /posts/mariadb-mysql-docker-setup/
---

## Introduction

MariaDB and MySQL are powerful relational database management systems widely used in web applications, data analytics, and enterprise systems. Running them in Docker containers provides excellent isolation, portability, and ease of management. This comprehensive guide will walk you through setting up, managing, and securing MariaDB/MySQL databases in Docker containers.

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
docker volume create mariadb_data

# List volumes
docker volume ls

# Inspect volume details
docker volume inspect mariadb_data

# Remove volume (CAUTION: destroys data)
docker volume rm mariadb_data
```

### Docker Networks

For secure communication between containers:

```bash
# Create a custom network
docker network create --driver bridge mariadb_network

# List networks
docker network ls

# Inspect network
docker network inspect mariadb_network
```

## Running MariaDB/MySQL Container

### Basic MariaDB Setup

```bash
# Run MariaDB with basic configuration
docker run --name mariadb-basic \
  -e MYSQL_ROOT_PASSWORD=mysecretpassword \
  -e MYSQL_DATABASE=mydb \
  -e MYSQL_USER=myuser \
  -e MYSQL_PASSWORD=mypassword \
  -p 3306:3306 \
  -d mariadb:latest

# Check if container is running
docker ps

# View container logs
docker logs mariadb-basic
```

### Advanced MariaDB Setup with Volumes

```bash
# Create directories for persistent storage
mkdir -p ~/mariadb/data ~/mariadb/config ~/mariadb/logs

# Run MariaDB with custom configuration and volumes
docker run --name mariadb-advanced \
  -e MYSQL_ROOT_PASSWORD=SuperSecurePass123! \
  -e MYSQL_DATABASE=production_db \
  -e MYSQL_USER=app_user \
  -e MYSQL_PASSWORD=AppPass456! \
  -v ~/mariadb/data:/var/lib/mysql \
  -v ~/mariadb/config:/etc/mysql/conf.d \
  -v ~/mariadb/logs:/var/log/mysql \
  -p 3306:3306 \
  --restart unless-stopped \
  -d mariadb:10.11

# Verify volumes are mounted correctly
docker inspect mariadb-advanced | grep -A 10 "Mounts"
```

### MySQL Alternative

```bash
# Run MySQL instead of MariaDB
docker run --name mysql-server \
  -e MYSQL_ROOT_PASSWORD=MySQLRootPass789! \
  -e MYSQL_DATABASE=testdb \
  -e MYSQL_USER=testuser \
  -e MYSQL_PASSWORD=TestPass101! \
  -v mysql_data:/var/lib/mysql \
  -p 3307:3306 \
  --restart unless-stopped \
  -d mysql:8.0

# Note: MySQL uses port 3307 to avoid conflict with MariaDB on 3306
```

## Docker Compose Setup

Create a `docker-compose.yml` file for easier management:

```yaml
version: "3.8"

services:
  mariadb:
    image: mariadb:10.11
    container_name: mariadb_production
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_CHARSET: utf8mb4
      MYSQL_COLLATION: utf8mb4_unicode_ci
    volumes:
      - mariadb_data:/var/lib/mysql
      - ./config/my.cnf:/etc/mysql/my.cnf
      - ./init:/docker-entrypoint-initdb.d
      - ./logs:/var/log/mysql
    ports:
      - "3306:3306"
    networks:
      - mariadb_network
    command: --default-authentication-plugin=mysql_native_password

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: mariadb_phpmyadmin
    restart: unless-stopped
    environment:
      PMA_HOST: mariadb
      PMA_PORT: 3306
      PMA_USER: ${MYSQL_USER}
      PMA_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "8080:80"
    networks:
      - mariadb_network
    depends_on:
      - mariadb

volumes:
  mariadb_data:
    driver: local

networks:
  mariadb_network:
    driver: bridge
```

Create environment file `.env`:

```bash
MYSQL_ROOT_PASSWORD=UltraSecureRootPass2024!
MYSQL_DATABASE=myapp_production
MYSQL_USER=myapp_user
MYSQL_PASSWORD=SecureAppPass2024!
```

Start the services:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f mariadb

# Stop services
docker-compose down

# Stop and remove volumes (CAUTION: destroys data)
docker-compose down -v
```

## Connecting to the Database

### Using MySQL Client

```bash
# Connect to MariaDB/MySQL from host
mysql -h localhost -P 3306 -u root -p

# Connect to specific database
mysql -h localhost -P 3306 -u myuser -p mydatabase

# Connect using Docker exec
docker exec -it mariadb-basic mysql -u root -p

# Connect to running container
docker exec -it mariadb_production mysql -u root -p
```

### Connection Examples

```bash
# Connect with specific character set
mysql --default-character-set=utf8mb4 -h localhost -u user -p database

# Connect via socket (if using local MySQL)
mysql -u root -p --socket=/var/run/mysqld/mysqld.sock

# Connect with SSL
mysql --ssl-ca=ca.pem --ssl-cert=client-cert.pem --ssl-key=client-key.pem -h host -u user -p
```

### Using MySQL Client in Docker

```bash
# Run MySQL client in a temporary container
docker run -it --rm \
  --network mariadb_network \
  mariadb:10.11 \
  mysql -h mariadb_production -u myapp_user -p

# Or use a dedicated MySQL client container
docker run -it --rm \
  --network mariadb_network \
  mysql:8.0 \
  mysql -h mariadb -u root -p
```

## Database and User Management

### Creating Databases

```sql
-- Connect to MySQL/MariaDB
mysql -u root -p

-- Create a new database
CREATE DATABASE ecommerce_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Create database with specific options
CREATE DATABASE analytics_db
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci
  DEFAULT ENCRYPTION = 'Y';

-- List all databases
SHOW DATABASES;

-- Switch to a database
USE ecommerce_db;

-- Show current database
SELECT DATABASE();
```

### User Management

```sql
-- Create a new user
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'SecurePass123!';

-- Create user with specific host restrictions
CREATE USER 'readonly_user'@'192.168.1.%' IDENTIFIED BY 'ReadOnlyPass456!';
CREATE USER 'admin_user'@'%' IDENTIFIED BY 'AdminPass789!';

-- Grant privileges
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'app_user'@'localhost';
GRANT SELECT, INSERT, UPDATE ON analytics_db.* TO 'readonly_user'@'192.168.1.%';
GRANT REPLICATION SLAVE ON *.* TO 'replica_user'@'%';

-- Grant specific privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON mydb.* TO 'webapp'@'localhost';
GRANT CREATE, ALTER, DROP ON mydb.* TO 'developer'@'localhost';

-- Revoke privileges
REVOKE INSERT ON mydb.* FROM 'readonly_user'@'localhost';

-- Change password
ALTER USER 'app_user'@'localhost' IDENTIFIED BY 'NewSecurePass456!';

-- Rename user
RENAME USER 'old_user'@'localhost' TO 'new_user'@'localhost';

-- Drop user
DROP USER 'temp_user'@'localhost';

-- Show users
SELECT User, Host FROM mysql.user;

-- Show user privileges
SHOW GRANTS FOR 'app_user'@'localhost';
```

### Database Initialization Scripts

Create SQL files in `/docker-entrypoint-initdb.d/`:

```sql
-- 01_create_databases.sql
CREATE DATABASE IF NOT EXISTS app_production
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE DATABASE IF NOT EXISTS app_development
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- 02_create_users.sql
CREATE USER IF NOT EXISTS 'app_prod'@'%' IDENTIFIED BY 'ProdPass123!';
CREATE USER IF NOT EXISTS 'app_dev'@'%' IDENTIFIED BY 'DevPass456!';

GRANT ALL PRIVILEGES ON app_production.* TO 'app_prod'@'%';
GRANT ALL PRIVILEGES ON app_development.* TO 'app_dev'@'%';

FLUSH PRIVILEGES;
```

## Adding and Managing Data

### Creating Tables

```sql
USE ecommerce_db;

-- Create a simple table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create table with indexes
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_category (category_id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB;

-- Create table with partitioning
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB
PARTITION BY RANGE (YEAR(created_at)) (
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
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

-- INSERT with SELECT
INSERT INTO archived_users (id, username, email, archived_at)
SELECT id, username, email, NOW() FROM users WHERE last_login < '2024-01-01';

-- INSERT IGNORE (skip duplicates)
INSERT IGNORE INTO users (username, email) VALUES ('john_doe', 'john2@example.com');

-- INSERT ON DUPLICATE KEY UPDATE
INSERT INTO user_stats (user_id, login_count, last_login)
VALUES (1, 1, NOW())
ON DUPLICATE KEY UPDATE
  login_count = login_count + 1,
  last_login = NOW();

-- Bulk INSERT with LOAD DATA
LOAD DATA LOCAL INFILE '/path/to/users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
(username, email, created_at);
```

### Loading Data from Files

```bash
# Prepare CSV file
cat > users.csv << EOF
username,email,department
john_doe,john@example.com,engineering
jane_smith,jane@example.com,marketing
bob_johnson,bob@example.com,sales
EOF

# Load data into MySQL
mysql -u root -p ecommerce_db << EOF
LOAD DATA LOCAL INFILE 'users.csv'
INTO TABLE users
FIELDS TERMINATED BY ','
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(username, email, department);
EOF
```

### Data Export and Import

```bash
# Export table to CSV
mysql -u root -p -e "SELECT * FROM users INTO OUTFILE '/tmp/users_export.csv' FIELDS TERMINATED BY ',' ENCLOSED BY '\"' LINES TERMINATED BY '\n';"

# Export query results to file
mysql -u root -p -e "SELECT username, email FROM users WHERE department='engineering'" > engineering_users.txt

# Import from SQL file
mysql -u root -p ecommerce_db < backup.sql

# Import large files with progress
pv backup.sql | mysql -u root -p ecommerce_db
```

## Backup Strategies

### Logical Backups with mysqldump

```bash
# Basic database backup
mysqldump -u root -p ecommerce_db > ecommerce_backup.sql

# Backup all databases
mysqldump -u root -p --all-databases > all_databases_backup.sql

# Backup with compression
mysqldump -u root -p ecommerce_db | gzip > ecommerce_backup.sql.gz

# Backup specific tables
mysqldump -u root -p ecommerce_db users products > tables_backup.sql

# Backup with drop table statements
mysqldump -u root -p --add-drop-table ecommerce_db > ecommerce_backup.sql

# Consistent backup (locks tables)
mysqldump -u root -p --lock-tables ecommerce_db > ecommerce_backup.sql

# Consistent backup without locking (uses transactions)
mysqldump -u root -p --single-transaction ecommerce_db > ecommerce_backup.sql
```

### Advanced mysqldump Options

```bash
# Backup with routines and triggers
mysqldump -u root -p --routines --triggers ecommerce_db > full_backup.sql

# Backup with events
mysqldump -u root -p --events ecommerce_db > backup_with_events.sql

# Exclude specific tables
mysqldump -u root -p ecommerce_db --ignore-table=ecommerce_db.logs > backup_no_logs.sql

# Include CREATE DATABASE statement
mysqldump -u root -p --databases ecommerce_db > backup_with_db.sql

# Backup only schema (no data)
mysqldump -u root -p --no-data ecommerce_db > schema_only.sql

# Backup only data (no schema)
mysqldump -u root -p --no-create-info ecommerce_db > data_only.sql
```

### Physical Backups

```bash
# Copy data directory (container must be stopped)
docker stop mariadb_production
docker cp mariadb_production:/var/lib/mysql ~/mariadb_physical_backup
docker start mariadb_production

# Hot backup with MariaDB Backup (for MariaDB)
docker exec mariadb_production mariadb-backup --backup --target-dir=/tmp/backup --user=root --password

# Copy backup from container
docker cp mariadb_production:/tmp/backup ~/mariadb_hot_backup
```

### Incremental Backups

```bash
# Enable binary logging in my.cnf
cat >> ~/mariadb/config/my.cnf << EOF
[mysqld]
log-bin=mysql-bin
binlog-format=ROW
expire_logs_days=7
EOF

# Restart container
docker-compose restart mariadb

# Take incremental backup
mysql -u root -p -e "FLUSH LOGS;"

# Copy binary logs
docker cp mariadb_production:/var/lib/mysql/mysql-bin.000001 ~/backups/

# List binary logs
mysql -u root -p -e "SHOW BINARY LOGS;"
```

### Automated Backup Script

Create a comprehensive backup script:

```bash
#!/bin/bash
# mariadb_backup.sh

BACKUP_DIR="/home/user/mariadb_backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER_NAME="mariadb_production"
DB_NAME="ecommerce_db"
MYSQL_USER="root"
MYSQL_PASSWORD="your_password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Full backup
echo "Starting full backup..."
docker exec $CONTAINER_NAME mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  --all-databases > $BACKUP_DIR/full_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/full_backup_$DATE.sql

# Schema-only backup
docker exec $CONTAINER_NAME mysqldump -u$MYSQL_USER -p$MYSQL_PASSWORD \
  --no-data \
  --all-databases > $BACKUP_DIR/schema_$DATE.sql

# Clean old backups (keep last 7 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/full_backup_$DATE.sql.gz"
```

Make it executable and schedule with cron:

```bash
chmod +x mariadb_backup.sh

# Add to crontab for daily backups at 2 AM
echo "0 2 * * * /home/user/mariadb_backup.sh" | crontab -

# View cron jobs
crontab -l
```

## Restore Procedures

### Restore from mysqldump

```bash
# Restore single database
mysql -u root -p < ecommerce_backup.sql

# Restore all databases
mysql -u root -p < all_databases_backup.sql

# Restore compressed backup
gunzip < ecommerce_backup.sql.gz | mysql -u root -p

# Restore to specific database
mysql -u root -p ecommerce_db < ecommerce_backup.sql

# Restore with progress indicator
pv ecommerce_backup.sql | mysql -u root -p
```

### Point-in-Time Recovery

```bash
# Restore full backup
mysql -u root -p < full_backup.sql

# Apply binary logs up to specific point
mysqlbinlog --stop-datetime="2024-10-29 15:30:00" /var/lib/mysql/mysql-bin.000001 | mysql -u root -p

# Apply specific transaction
mysqlbinlog --start-position=1000 --stop-position=2000 /var/lib/mysql/mysql-bin.000001 | mysql -u root -p
```

### Physical Restore

```bash
# Stop container
docker-compose down

# Remove old volume
docker volume rm mariadb_mariadb_data

# Create new volume
docker volume create mariadb_data

# Copy backup data to new volume
# (This requires mounting the volume to a temporary container)
docker run --rm -v mariadb_data:/data -v ~/mariadb_physical_backup:/backup alpine cp -r /backup/* /data/

# Start container
docker-compose up -d mariadb
```

## Security Best Practices

### Secure Initial Setup

```bash
# Change root password
docker exec -it mariadb_production mysql -u root -p << EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewUltraSecurePass123!';
FLUSH PRIVILEGES;
EOF

# Remove anonymous users
mysql -u root -p -e "DELETE FROM mysql.user WHERE User='';"

# Remove test database
mysql -u root -p -e "DROP DATABASE IF EXISTS test;"

# Disable remote root login
mysql -u root -p -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
```

### User Security

```sql
-- Create users with strong passwords
CREATE USER 'webapp'@'localhost' IDENTIFIED BY 'ComplexPass123!@#';

-- Use password validation
INSTALL PLUGIN validate_password SONAME 'validate_password.so';

-- Configure password policy
SET GLOBAL validate_password.length = 12;
SET GLOBAL validate_password.mixed_case_count = 1;
SET GLOBAL validate_password.number_count = 1;
SET GLOBAL validate_password.special_char_count = 1;

-- Force password change
ALTER USER 'user'@'localhost' PASSWORD EXPIRE;

-- Lock/unlock accounts
ALTER USER 'suspicious_user'@'localhost' ACCOUNT LOCK;
ALTER USER 'suspicious_user'@'localhost' ACCOUNT UNLOCK;
```

### Network Security

```bash
# Bind to localhost only (in my.cnf)
cat >> ~/mariadb/config/my.cnf << EOF
[mysqld]
bind-address = 127.0.0.1
skip-networking
EOF

# Or allow specific IPs
bind-address = 192.168.1.100

# Use SSL/TLS
cat >> ~/mariadb/config/my.cnf << EOF
[mysqld]
ssl-ca = /etc/mysql/ssl/ca.pem
ssl-cert = /etc/mysql/ssl/server-cert.pem
ssl-key = /etc/mysql/ssl/server-key.pem
require_secure_transport = ON
EOF

# Require SSL for specific users
ALTER USER 'secure_user'@'%' REQUIRE SSL;
```

### Firewall Configuration

```bash
# Allow MySQL only from specific IP
sudo ufw allow from 192.168.1.100 to any port 3306

# Or use Docker networks for isolation
docker network create --internal secure_network
```

### Data Encryption

```sql
-- Enable table encryption
CREATE TABLE sensitive_data (
  id INT PRIMARY KEY,
  data TEXT
) ENGINE=InnoDB ENCRYPTION='Y';

-- Encrypt existing table
ALTER TABLE existing_table ENCRYPTION='Y';

-- Create encrypted tablespace
CREATE TABLESPACE encrypted_ts
  ADD DATAFILE 'encrypted_ts.ibd'
  ENCRYPTION='Y';
```

## Performance Tuning

### Memory Configuration

```bash
# Optimize memory settings in my.cnf
cat >> ~/mariadb/config/my.cnf << EOF
[mysqld]
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_log_buffer_size = 16M
query_cache_size = 256M
query_cache_type = ON
max_connections = 100
EOF
```

### Query Optimization

```sql
-- Analyze query performance
EXPLAIN SELECT * FROM users WHERE email LIKE 'john%';

-- Add indexes for better performance
CREATE INDEX idx_email ON users (email);
CREATE INDEX idx_created_at ON users (created_at);

-- Analyze table
ANALYZE TABLE users;

-- Optimize table
OPTIMIZE TABLE users;

-- Check slow queries
SHOW PROCESSLIST;
SHOW ENGINE INNODB STATUS;
```

### Connection Pooling

```bash
# Install ProxySQL for connection pooling
docker run -d \
  --name proxysql \
  --network mariadb_network \
  -p 6033:6033 \
  proxysql/proxysql:latest

# Configure ProxySQL to connect to MariaDB
docker exec -it proxysql mysql -u admin -padmin -h 127.0.0.1 -P 6032 << EOF
INSERT INTO mysql_servers (hostname, port) VALUES ('mariadb', 3306);
INSERT INTO mysql_users (username, password, default_hostgroup) VALUES ('app_user', 'password', 1);
LOAD MYSQL SERVERS TO RUNTIME;
LOAD MYSQL USERS TO RUNTIME;
SAVE MYSQL SERVERS TO DISK;
SAVE MYSQL USERS TO DISK;
EOF
```

## Monitoring and Maintenance

### Health Checks

```bash
# Basic health check
docker exec mariadb_production mysqladmin -u root -p ping

# Check database status
docker exec mariadb_production mysql -u root -p -e "SHOW PROCESSLIST;"

# Monitor disk usage
docker exec mariadb_production du -sh /var/lib/mysql

# Check log files
docker exec mariadb_production tail -f /var/log/mysql/error.log
```

### Monitoring Queries

```sql
-- Show current connections
SHOW PROCESSLIST;

-- Show open tables
SHOW OPEN TABLES;

-- Show engine status
SHOW ENGINE INNODB STATUS;

-- Show global status
SHOW GLOBAL STATUS;

-- Show variables
SHOW VARIABLES LIKE 'max_connections';

-- Monitor slow queries
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;
```

### Log Analysis

```bash
# View error log
docker exec mariadb_production cat /var/log/mysql/error.log

# Search for specific errors
docker exec mariadb_production grep "ERROR" /var/log/mysql/error.log

# Monitor slow queries
docker exec mariadb_production tail -f /var/log/mysql/mysql-slow.log
```

## Essential Housekeeping Commands

### Database Maintenance

```sql
-- Check table integrity
CHECK TABLE users;

-- Repair corrupted tables
REPAIR TABLE users;

-- Analyze tables for optimization
ANALYZE TABLE users;

-- Optimize tables (rebuilds indexes)
OPTIMIZE TABLE users;

-- Flush privileges after user changes
FLUSH PRIVILEGES;

-- Flush query cache
FLUSH QUERY CACHE;

-- Reset query cache
RESET QUERY CACHE;
```

### Index Management

```sql
-- Show indexes on a table
SHOW INDEXES FROM users;

-- Create index
CREATE INDEX idx_username ON users (username);

-- Create unique index
CREATE UNIQUE INDEX idx_unique_email ON users (email);

-- Create composite index
CREATE INDEX idx_name_email ON users (username, email);

-- Drop index
DROP INDEX idx_username ON users;

-- Rebuild all indexes on a table
ALTER TABLE users DROP INDEX idx_username, ADD INDEX idx_username (username);
```

### Table Maintenance

```sql
-- Show table structure
DESCRIBE users;
SHOW CREATE TABLE users;

-- Show table status
SHOW TABLE STATUS LIKE 'users';

-- Show disk usage by tables
SELECT
  table_name,
  round(((data_length + index_length) / 1024 / 1024), 2) 'Size in MB'
FROM information_schema.TABLES
WHERE table_schema = 'ecommerce_db'
ORDER BY (data_length + index_length) DESC;

-- Truncate table (remove all data)
TRUNCATE TABLE temp_data;

-- Rename table
RENAME TABLE old_table TO new_table;

-- Change engine
ALTER TABLE users ENGINE = InnoDB;
```

### User and Privilege Management

```sql
-- Show all users
SELECT user, host FROM mysql.user;

-- Show user grants
SHOW GRANTS FOR 'app_user'@'localhost';

-- Show current user
SELECT CURRENT_USER();

-- Change user password
SET PASSWORD FOR 'user'@'localhost' = PASSWORD('newpassword');

-- Kill connection
SHOW PROCESSLIST;
KILL 123;  -- Replace 123 with connection ID
```

### Backup and Recovery Commands

```bash
# Quick backup script
mysqldump -u root -p --all-databases --single-transaction > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup with compression and progress
mysqldump -u root -p dbname | pv | gzip > backup.sql.gz

# Verify backup integrity
mysql -u root -p < backup.sql

# Export specific data
mysql -u root -p -e "SELECT * FROM users WHERE created_at > '2024-01-01'" > recent_users.csv

# Import with error handling
mysql -u root -p --force dbname < backup.sql 2> import_errors.log
```

### Log Management

```sql
-- Enable general log
SET GLOBAL general_log = 'ON';
SET GLOBAL general_log_file = '/var/lib/mysql/mysql.log';

-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL slow_query_log_file = '/var/lib/mysql/mysql-slow.log';
SET GLOBAL long_query_time = 1;

-- Rotate binary logs
FLUSH LOGS;

-- Purge old binary logs
PURGE BINARY LOGS BEFORE '2024-10-01 00:00:00';

-- Show binary logs
SHOW BINARY LOGS;
```

### Performance Monitoring

```sql
-- Show running queries
SELECT * FROM information_schema.PROCESSLIST WHERE COMMAND != 'Sleep';

-- Show lock waits
SELECT * FROM information_schema.INNODB_LOCK_WAITS;

-- Show buffer pool status
SHOW ENGINE INNODB STATUS;

-- Show query cache status
SHOW STATUS LIKE 'Qcache%';

-- Show connection status
SHOW STATUS LIKE 'Connections';
SHOW STATUS LIKE 'Max_used_connections';
```

### Disk Space Management

```bash
# Check disk usage inside container
docker exec mariadb_production df -h

# Check MySQL data directory size
docker exec mariadb_production du -sh /var/lib/mysql

# Clean up binary logs
docker exec mariadb_production mysql -u root -p -e "PURGE BINARY LOGS BEFORE NOW() - INTERVAL 7 DAY;"

# Optimize InnoDB tablespace
docker exec mariadb_production mysql -u root -p -e "SET GLOBAL innodb_file_per_table = 1;"
```

### Replication Management (Advanced)

```sql
-- Show slave status
SHOW SLAVE STATUS;

-- Start slave
START SLAVE;

-- Stop slave
STOP SLAVE;

-- Reset slave
RESET SLAVE ALL;

-- Change master
CHANGE MASTER TO
  MASTER_HOST='master.example.com',
  MASTER_USER='replica',
  MASTER_PASSWORD='password',
  MASTER_LOG_FILE='mysql-bin.000001',
  MASTER_LOG_POS=100;
```

## Troubleshooting Common Issues

### Connection Issues

```bash
# Test connection
mysql -h localhost -P 3306 -u root -p -e "SELECT 1;"

# Check if MySQL is listening
netstat -tlnp | grep 3306

# Check MySQL error log
docker logs mariadb_production 2>&1 | tail -20

# Reset root password (if forgotten)
docker exec -it mariadb_production mysql -u root -e "ALTER USER 'root'@'%' IDENTIFIED BY 'newpassword';"
```

### Performance Issues

```sql
-- Find slow queries
SELECT * FROM information_schema.PROCESSLIST WHERE TIME > 60;

-- Show query execution plan
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- Check for table locks
SHOW OPEN TABLES WHERE In_use > 0;

-- Check InnoDB status
SHOW ENGINE INNODB STATUS\G
```

### Data Corruption

```sql
-- Check table for errors
CHECK TABLE users EXTENDED;

-- Repair table
REPAIR TABLE users;

-- Force repair (use with caution)
REPAIR TABLE users USE_FRM;
```

### Memory Issues

```sql
-- Check memory usage
SHOW STATUS LIKE 'Innodb_buffer_pool%';

-- Reduce buffer pool size if needed
SET GLOBAL innodb_buffer_pool_size = 536870912;  -- 512MB

-- Check for memory leaks
SHOW PROCESSLIST;
```

## Advanced Topics

### Read Replicas

```yaml
# docker-compose.yml with replica
version: "3.8"

services:
  mariadb-master:
    image: mariadb:10.11
    environment:
      MYSQL_ROOT_PASSWORD: masterpass
      MYSQL_DATABASE: mydb
    volumes:
      - master_data:/var/lib/mysql
    command: --server-id=1 --log-bin=mysql-bin --binlog-format=ROW

  mariadb-replica:
    image: mariadb:10.11
    environment:
      MYSQL_ROOT_PASSWORD: replicapass
    volumes:
      - replica_data:/var/lib/mysql
    command: --server-id=2 --log-bin=mysql-bin --binlog-format=ROW
    depends_on:
      - mariadb-master
```

### Clustering with Galera

```yaml
version: "3.8"

services:
  mariadb-node1:
    image: mariadb:10.11
    environment:
      MYSQL_ROOT_PASSWORD: galera
      MYSQL_DATABASE: mydb
    volumes:
      - node1_data:/var/lib/mysql
    command: --wsrep-cluster-name=mycluster --wsrep-node-name=node1 --wsrep-cluster-address=gcomm://

  mariadb-node2:
    image: mariadb:10.11
    environment:
      MYSQL_ROOT_PASSWORD: galera
    volumes:
      - node2_data:/var/lib/mysql
    command: --wsrep-cluster-name=mycluster --wsrep-node-name=node2 --wsrep-cluster-address=gcomm://mariadb-node1
    depends_on:
      - mariadb-node1
```

## Conclusion

Running MariaDB/MySQL in Docker containers provides excellent flexibility, portability, and isolation for database operations. This comprehensive guide covered everything from basic setup to advanced administration, including data management, backup strategies, security hardening, and extensive housekeeping commands.

Key takeaways:

- Use Docker volumes for data persistence
- Implement comprehensive backup strategies
- Secure your database with proper user management and SSL
- Monitor performance and maintain regular housekeeping
- Use Docker Compose for complex setups
- Always test backups and restore procedures

With these practices, you'll have a robust, secure, and maintainable MariaDB/MySQL setup in Docker that can handle production workloads effectively.

## Resources

- [MariaDB Docker Documentation](https://hub.docker.com/_/mariadb)
- [MySQL Docker Documentation](https://hub.docker.com/_/mysql)
- [MariaDB Knowledge Base](https://mariadb.com/kb/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

Remember to regularly update your containers, monitor performance, and maintain backups. Database administration requires ongoing attention to ensure reliability and security.
