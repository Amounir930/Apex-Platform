# Infrastructure Details

## Production Server (ApexProd)

- **Hostname**: 34.102.38.102
- **User**: apex-v2-dev
- **Region**: GCP (General Public)
- **Environment**: Linux Ubuntu 24.04 LTS

## Access Credentials

- **SSH Key (Public)**: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHGipX3mamoOFBpZxFfHVNJEqf6HxAICYqN2xzpruU/1 apex-v2-dev`
- **SSH Key (Private Path)**: `C:\Users\Dell\.ssh\id_ed25519_apex`

## Deployment Protocol

- **Method**: Docker Swarm Stack
- **Sync**: Git Pull (Windows -> GitHub -> Server)
- **Target Container Engine**: Docker Swarm
