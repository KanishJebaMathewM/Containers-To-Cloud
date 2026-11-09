# Lesson 08: Container Inspection & Low-Level JSON Metadata

## 1. The Power of `docker inspect`
When managing containers, `docker ps` gives a high-level summary, but `docker inspect` provides the complete, authoritative source of truth. It outputs a comprehensive JSON array describing everything about the container's state, environment, networking, and filesystem mounts.

In our session, we executed:
```bash
docker inspect cloudlab-container
```

---

## 2. Key Metadata Sections Dissected

Here are the critical sections observed from our real container inspection:

### A. Container Execution State (`.State`)
```json
"State": {
    "Status": "running",
    "Running": true,
    "Paused": false,
    "Restarting": false,
    "OOMKilled": false,
    "Dead": false,
    "Pid": 417,
    "ExitCode": 0,
    "StartedAt": "2026-11-09T09:59:14.467244992Z"
}
```
- **`Pid: 417`**: The actual Linux process ID assigned to the container by the host kernel inside WSL2.
- **`OOMKilled: false`**: Out-Of-Memory indicator. If your application exceeds container memory limits, the Linux kernel terminates it, and this flag turns `true`.
- **`ExitCode: 0`**: Reports the exit status code of the primary process.

### B. Configuration Metadata (`.Config`)
```json
"Config": {
    "User": "node",
    "WorkingDir": "/usr/src/app",
    "ExposedPorts": {
        "3000/tcp": {}
    },
    "Env": [
        "PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
        "NODE_VERSION=22.23.4",
        "YARN_VERSION=1.22.22"
    ],
    "Cmd": [
        "node",
        "server.js"
    ],
    "Image": "cloudlab:v1",
    "Entrypoint": [
        "docker-entrypoint.sh"
    ]
}
```
- **`User: node`**: Proves our Dockerfile instruction `USER node` took effect! The container is running safely as non-root.
- **`WorkingDir: /usr/src/app`**: Confirms the process directory.
- **`Entrypoint` & `Cmd`**: Shows the full invocation: `docker-entrypoint.sh node server.js`.

### C. Host & Port Configuration (`.HostConfig`)
```json
"HostConfig": {
    "NetworkMode": "bridge",
    "PortBindings": {
        "3000/tcp": [
            {
                "HostIp": "",
                "HostPort": "3000"
            }
        ]
    },
    "RestartPolicy": {
        "Name": "no",
        "MaximumRetryCount": 0
    }
}
```
- **`PortBindings`**: Confirms that container port `3000/tcp` is bound to host port `3000`.
- **`RestartPolicy: no`**: Default policy; the container will not automatically restart if it crashes or if the host reboots.

### D. Internal Networking (`.NetworkSettings`)
```json
"NetworkSettings": {
    "Ports": {
        "3000/tcp": [
            {
                "HostIp": "0.0.0.0",
                "HostPort": "3000"
            }
        ]
    },
    "Networks": {
        "bridge": {
            "Gateway": "172.17.0.1",
            "IPAddress": "172.17.0.2",
            "MacAddress": "4a:0d:a7:ed:a8:bd"
        }
    }
}
```
- **`Gateway: 172.17.0.1`**: The virtual default gateway router created by Docker.
- **`IPAddress: 172.17.0.2`**: The private IP address assigned to `cloudlab-container`.

> [!NOTE]
> **Can you browse directly to `http://172.17.0.2:3000`?**
> On Linux, yes, because the bridge network is directly routable from the host. However, on Windows and macOS, Docker runs inside an isolated VM (WSL2 / HyperKit), so `172.17.0.2` is internal to that VM. To reach the container from Windows, you must route through host port forwarding (`http://localhost:3000`).

---

## 3. Formatting `docker inspect` with Go Templates
Instead of scrolling through hundreds of lines of raw JSON, you can query specific fields using `--format`:

| Goal | Command | Example Output |
| :--- | :--- | :--- |
| **Get Container IP** | `docker inspect -f '{{.NetworkSettings.IPAddress}}' <name>` | `172.17.0.2` |
| **Get Process ID** | `docker inspect -f '{{.State.Pid}}' <name>` | `417` |
| **Get Running User** | `docker inspect -f '{{.Config.User}}' <name>` | `node` |
| **Get Health Status** | `docker inspect -f '{{.State.Status}}' <name>` | `running` |

---

## 💡 What We Learned
1. `docker inspect` exposes the underlying state, network allocations, and configurations of any container or image.
2. The internal container IP (`172.17.0.2`) is isolated within the Docker bridge network.
3. The `--format` flag allows extracting specific values for scripts and debugging.
4. The running user and entrypoint defined in the Dockerfile can be audited and verified via inspect.

---

## 🛠️ Try It Yourself
1. Query just the IP address of your running container:
   ```bash
   docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' cloudlab-container
   ```
2. Query the exact command executed inside:
   ```bash
   docker inspect --format '{{.Config.Cmd}}' cloudlab-container
   ```
