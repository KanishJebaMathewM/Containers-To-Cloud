# Lesson 15: The CloudLab Docker Commands Cheatsheet

A task-oriented reference sheet summarizing all the Docker CLI commands executed and mastered during Phase 1.

---

## 🛠️ 1. System & Engine Diagnostics

| Command | Purpose | CloudLab Example |
| :--- | :--- | :--- |
| `docker --version` | Verify Docker CLI installation and build version | `docker --version` |
| `docker info` | Inspect client, engine daemon, WSL2 kernel, CPUs, and memory | `docker info` |
| `docker context ls` | List Docker connection endpoints (local vs cloud) | `docker context ls` |

---

## 📦 2. Building & Managing Images

| Command | Purpose | CloudLab Example |
| :--- | :--- | :--- |
| `docker build` | Build an image from a Dockerfile and context path | `docker build -t cloudlab:v1 .` |
| `docker images` | List all cached images on the local machine | `docker images` |
| `docker history` | Show the layer creation history of an image | `docker history cloudlab:v1` |
| `docker tag` | Create a new tag pointer for an existing image | `docker tag cloudlab:v1 kanishjebamathewm/cloudlab:v1` |
| `docker rmi` | Remove an image tag or layer from local disk | `docker rmi cloudlab:v1` |
| `docker image prune` | Delete unused/dangling image layers | `docker image prune -f` |

---

## 🚀 3. Running & Operating Containers

| Command | Purpose | CloudLab Example |
| :--- | :--- | :--- |
| `docker run` | Create and start a container in one step | `docker run -d -p 3000:3000 --name cloudlab-container cloudlab:v1` |
| `docker ps` | List currently active running containers | `docker ps` |
| `docker ps -a` | List all containers (running, stopped, exited) | `docker ps -a` |
| `docker logs` | Fetch stdout and stderr logs from a container | `docker logs cloudlab-container` |
| `docker logs -f` | Follow/stream container log output live | `docker logs -f cloudlab-container` |
| `docker port` | List port mappings for a specific container | `docker port cloudlab-container` |

---

## 🔍 4. Inspection & Shell Access

| Command | Purpose | CloudLab Example |
| :--- | :--- | :--- |
| `docker inspect` | Return low-level JSON configuration and runtime state | `docker inspect cloudlab-container` |
| `docker inspect -f` | Query a specific metadata field using Go templates | `docker inspect -f '{{.NetworkSettings.IPAddress}}' cloudlab-container` |
| `docker exec -it` | Open an interactive terminal shell inside a running container | `docker exec -it cloudlab-container sh` |
| `docker exec` | Execute a non-interactive one-off command inside | `docker exec cloudlab-container node --version` |

---

## 🔄 5. Lifecycle Management

| Command | Purpose | CloudLab Example |
| :--- | :--- | :--- |
| `docker stop` | Send SIGTERM (and SIGKILL if needed) to stop a container | `docker stop cloudlab-container` |
| `docker start` | Resume execution of an existing stopped container | `docker start cloudlab-container` |
| `docker restart` | Stop and immediately restart a running container | `docker restart cloudlab-container` |
| `docker pause` | Suspend container processes using cgroups | `docker pause cloudlab-container` |
| `docker unpause` | Unfreeze paused container processes | `docker unpause cloudlab-container` |
| `docker rm` | Permanently delete a stopped container from disk | `docker rm cloudlab-container` |
| `docker rm -f` | Force stop and remove a running container | `docker rm -f cloudlab-container` |

---

## 🌐 6. Registries & Distribution

| Command | Purpose | CloudLab Example |
| :--- | :--- | :--- |
| `docker login` | Authenticate CLI with Docker Hub or AWS ECR | `docker login` |
| `docker push` | Upload image layers and manifests to remote registry | `docker push kanishjebamathewm/cloudlab:v1` |
| `docker pull` | Download image layers from remote registry | `docker pull kanishjebamathewm/cloudlab:latest` |
| `docker logout` | Clear registry credential session from local machine | `docker logout` |

---

## 💡 What We Learned
1. All Docker CLI commands follow a consistent pattern: `docker <subcommand> [options] <arguments>`.
2. Inspect and logs provide complete transparency into container operations.
3. Keeping a cheatsheet of verified commands accelerates daily DevOps workflows.

---

## 🛠️ Try It Yourself
Run a health check on your local Docker setup by executing this diagnostic chain:
```bash
docker --version && docker ps && docker images
```
