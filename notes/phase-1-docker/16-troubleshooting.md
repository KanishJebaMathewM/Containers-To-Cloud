# Lesson 16: The CloudLab Troubleshooting & Post-Mortem Guide

Real-world engineering is largely about diagnosing and resolving unexpected failures. This guide documents the actual issues, errors, and misconceptions we navigated during Phase 1, along with the diagnostic tools and fixes.

---

## 🛑 Issue 1: Docker CLI Works, but Docker Engine Cannot Be Reached

### The Symptom:
Running `docker --version` returns `29.4.0`, but running `docker info` or `docker build` crashes with:
```text
failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine; 
check if the path is correct and if the daemon is running: 
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

### The Root Cause:
The Docker CLI (`docker.exe`) is just a client. It requires the background **Docker Engine daemon** (running inside a WSL2 Linux VM on Windows) to be actively listening. Docker Desktop was closed.

### The Fix & Diagnostic:
1. Launch **Docker Desktop** from your Start menu or taskbar.
2. Wait until the status indicator in the bottom-left corner turns **green ("Engine running")**.
3. Verify with:
   ```bash
   docker info
   ```
   If the `Server:` section displays kernel and CPU metrics, the engine is healthy.

---

## 🛑 Issue 2: Host Port Collision (`bind: address already in use`)

### The Symptom:
Attempting to run a container with `-p 3000:3000` fails with:
```text
Error response from daemon: driver failed programming external connectivity on endpoint: 
Bind for 0.0.0.0:3000 failed: port is already allocated.
```

### The Root Cause:
In our session, we had started `node server.js` directly on Windows before running Docker. Both processes attempted to bind to host port `3000`.

### The Fix & Diagnostic:
1. Identify which process is holding the port:
   - On Windows PowerShell:
     ```powershell
     Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
     ```
   - On Linux/macOS:
     ```bash
     lsof -i :3000
     ```
2. Stop the conflicting host process or terminate the background task.
3. Alternatively, map CloudLab to an alternative host port:
   ```bash
   docker run -d -p 8080:3000 --name cloudlab-container cloudlab:v1
   ```

---

## 🛑 Issue 3: The `EXPOSE` Port Misconception

### The Symptom:
A developer includes `EXPOSE 3000` in the Dockerfile and runs `docker run -d cloudlab:v1` (without the `-p` flag). When opening `http://localhost:3000` in the browser, the page fails to load with `ERR_CONNECTION_REFUSED`.

### The Root Cause:
`EXPOSE 3000` is purely internal documentation. It does **not** publish or expose the port to the host network interface.

### The Fix:
Always provide explicit port mapping when running containers:
```bash
docker run -d -p 3000:3000 cloudlab:v1
```

---

## 🛑 Issue 4: Container Exits with Status 137 (`Exited (137)`)

### The Symptom:
Running `docker stop cloudlab-container` causes `docker ps -a` to show:
```text
STATUS: Exited (137)
```

### The Root Cause:
Exit code 137 equals $128 + 9$ (`SIGKILL`). The Node.js application did not register a `SIGTERM` listener, or the container's configured `StopTimeout` (1 second) elapsed before Node could shut down gracefully, forcing Docker to send a hard kill signal.

### The Fix:
For production applications, add a POSIX signal listener to your HTTP server:
```javascript
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server gracefully...');
  server.close(() => {
    console.log('Server closed. Exiting process.');
    process.exit(0);
  });
});
```

---

## 🛑 Issue 5: Misinterpreting Docker Hub Artifacts & Pull Counts

### The Misconception:
- **Misconception A**: Seeing an Image Index, `linux/amd64` layer, and Attestation in Docker Hub meant 3 separate apps were running in the cloud.
  - **Correction**: These are sub-components of a single multi-platform container image artifact.
- **Misconception B**: Seeing "47 Pulls" on Docker Hub meant 47 human users visited the website.
  - **Correction**: Pulls represent binary downloads by machines, CI pipelines, and bots. Web visitors make HTTP requests to running servers; they do not trigger Docker pulls.

---

## 💡 What We Learned
1. Diagnosing Docker errors begins by distinguishing client-side issues from engine-side issues.
2. Host port collisions are solved by freeing the port or remapping the left side of `HOST:CONTAINER`.
3. Signal handling in code determines whether a container exits with code 0 or code 137.
4. Docker Hub counters measure machine pulls, not web traffic.

---

## 🛠️ Try It Yourself
Simulate a port collision deliberately:
1. Run container A on port 3000:
   ```bash
   docker run -d --name test-a -p 3000:3000 cloudlab:v1
   ```
2. Try running container B on the same port:
   ```bash
   docker run -d --name test-b -p 3000:3000 cloudlab:v1
   ```
3. Observe the exact error message!
4. Clean up:
   ```bash
   docker stop test-a && docker rm test-a
   ```
