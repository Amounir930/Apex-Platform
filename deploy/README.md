# Apex Platform v3.1 - Swarm Deployment Guide

This directory contains the core infrastructure definition for the Apex Platform. Follow these steps to rebuild or migrate the stack to a new server.

## 1. Prerequisites

- Docker & Docker Swarm initialized (`docker swarm init`).
- SSH access to the target server.

## 2. Mandatory Secrets (One-time setup)

Run these commands on the manager node before deploying the stack:

```bash
echo "YOUR_DB_PASSWORD" | docker secret create db_password -
echo "minio_admin" | docker secret create minio_root_user -
echo "MINIO_SECURE_PASS" | docker secret create minio_root_password -
```

## 3. Deployment

Deploy the stack using the provided configuration:

```bash
docker stack deploy -c docker-stack.yml apex
```

## 4. Post-Deployment (Manual DB Setup)

Certain databases must be provisioned manually inside the `apex_db` container for all services to start:

```bash
# Connect to the DB container
docker exec -it $(docker ps -q -f name=apex_db) psql -U postgres

# Run these commands inside psql:
CREATE DATABASE unleash;
CREATE DATABASE apex_db;
\q
```

## 5. Network & Firewall

Ensure the following ports are open on your cloud provider:

- **80/443**: Web Traffic (Traefik)
- **9001**: MinIO Console
- **3301**: SigNoz Dashboard
- **22**: SSH Management
