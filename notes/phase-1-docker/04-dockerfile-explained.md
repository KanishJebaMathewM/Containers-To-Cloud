# Lesson 04: Dockerfile Deep-Dive & Instruction Breakdown

## 1. The CloudLab Dockerfile
A `Dockerfile` is a plain-text script containing sequential instructions that Docker reads to assemble an automated image.

Here is the exact [Dockerfile](file:///c:/Users/Admin/Desktop/aws-docker/Dockerfile) used in our CloudLab project:

```dockerfile
# Use the official lightweight Node.js 22 Alpine Linux image
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the server application code into the container
# Set ownership to the pre-existing unprivileged 'node' user
COPY --chown=node:node server.js .

# Switch to the non-root 'node' user for security
USER node

# Document that the application listens on port 3000
EXPOSE 3000

# Specify the command to start the application
CMD ["node", "server.js"]
```

---

## 2. Line-by-Line Instruction Breakdown

### 1. `FROM node:22-alpine`
- **What it does**: Defines the **base image** that all subsequent instructions build upon.
- **Why `node:22-alpine`?**:
  - `node`: The official Node.js image maintained by the Node.js Docker team.
  - `22`: Locks the major Node version to 22 (LTS).
  - `alpine`: Based on **Alpine Linux**, an ultra-lightweight, security-oriented Linux distribution (~5MB base). Compared to standard Debian-based images (`node:22`, which is ~1GB uncompressed), Alpine produces an image around ~56MB!
- **Every valid Dockerfile MUST begin with a `FROM` instruction.**

### 2. `WORKDIR /usr/src/app`
- **What it does**: Sets the current working directory inside the container filesystem for any following `COPY`, `RUN`, `CMD`, or `ENTRYPOINT` instructions.
- **Key Behavior**: If `/usr/src/app` does not already exist, Docker automatically creates it.
- **Best Practice**: Prevents dumping application code into the root directory (`/`), keeping system directories clean.

### 3. `COPY --chown=node:node server.js .`
- **What it does**: Copies `server.js` from the host's build context into the current directory (`.` = `/usr/src/app`) inside the image.
- **Why `--chown=node:node`?**:
  - By default, files copied into an image are owned by `root:root`.
  - The official Node.js image includes a pre-configured unprivileged user named `node` (with UID 1000 and GID 1000).
  - By applying `--chown=node:node` during the copy step, the `node` user is granted read/write permissions to the application files without requiring a separate `RUN chown` step.

### 4. `USER node`
- **What it does**: Switches process execution from `root` (UID 0) to the non-root `node` user (UID 1000).
- **Security Principle of Least Privilege**:
  - Containers share the host kernel. If a containerized application running as `root` is compromised via a remote code execution vulnerability, an attacker could potentially escape to the host with root privileges.
  - Running as an unprivileged user drastically narrows the attack surface.

### 5. `EXPOSE 3000`
- **What it does**: Acts as **metadata documentation** signaling that the application inside listens on port 3000.
- **CRITICAL DISTINCTION**:
  > [!WARNING]
  > `EXPOSE 3000` **does NOT publish or open the port on the host machine!** It is an architectural declaration. You must still pass `-p 3000:3000` when executing `docker run` to bind host traffic to the container port.

### 6. `CMD ["node", "server.js"]`
- **What it does**: Defines the default command that runs when the container is started.
- **Exec Form vs Shell Form**:
  - **Exec form (Recommended)**: `CMD ["node", "server.js"]` — executes `node` directly as PID 1 without spawning a shell wrapper (`/bin/sh -c`). This ensures POSIX signals (like `SIGTERM` when running `docker stop`) are received directly by the Node process for graceful shutdown.
  - **Shell form**: `CMD node server.js` — runs within `/bin/sh -c`, which can swallow OS signals.

---

## 3. The `docker-entrypoint.sh` Discovery
When we ran `docker inspect cloudlab-container` in our session, we noticed:
```json
"Path": "docker-entrypoint.sh",
"Args": [
    "node",
    "server.js"
]
```
### Why was `docker-entrypoint.sh` executed when we did not define it?
The official `node:22-alpine` base image comes with an upstream `ENTRYPOINT ["docker-entrypoint.sh"]`.
This script checks if the first argument passed to `CMD` is `node`. If so, it passes execution directly to the `node` binary. If you pass arbitrary bash commands, it executes them safely. This demonstrates how child images inherit settings from their `FROM` base image.

---

## 4. Do All Dockerfile Instructions Create Layers?
A common myth is that "every single line in a Dockerfile creates a new filesystem layer." **This is incorrect.**
- Only instructions that modify the filesystem create physical storage layers:
  - `RUN` (installs packages, compiles files)
  - `COPY` (adds files from host)
  - `ADD` (adds files or extracts archives)
- Instructions such as `WORKDIR`, `USER`, `EXPOSE`, `ENV`, and `CMD` update **image configuration metadata** in the image JSON manifest without creating data layers on disk.

---

## 💡 What We Learned
1. Alpine Linux base images dramatically reduce container image sizes.
2. `--chown=node:node` alongside `USER node` ensures production-grade, non-root security.
3. `EXPOSE` is purely documentation; it does not publish ports to the host network.
4. JSON array exec form `CMD ["node", "server.js"]` is required for proper signal forwarding and process management.

---

## 🛠️ Try It Yourself
1. Review your Dockerfile syntax locally:
   ```bash
   cat Dockerfile
   ```
2. Verify the base image metadata without downloading:
   ```bash
   docker image inspect node:22-alpine --format '{{.Config.WorkingDir}}'
   ```
