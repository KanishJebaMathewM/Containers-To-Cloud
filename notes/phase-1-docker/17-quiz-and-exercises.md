# Lesson 17: Phase 1 Assessment — Quiz, Scenarios & Lab Exercises

Test your understanding of Phase 1 concepts before progressing to AWS cloud deployments. An answer key is provided at the bottom of this document.

---

## 📝 Part 1: Multiple-Choice Questions

### Q1. What is the fundamental architectural difference between a Docker container and a Virtual Machine?
- A) Containers emulate entire CPU hardware architectures.
- B) Containers share the host operating system kernel, whereas VMs run a dedicated Guest OS.
- C) Containers cannot run Node.js applications.
- D) VMs start up in milliseconds, while containers take minutes.

### Q2. If `server.js` listens inside the container on `0.0.0.0:3000`, how should a user on the host access it when run with `-p 8080:3000`?
- A) `http://0.0.0.0:3000`
- B) `http://0.0.0.0:8080`
- C) `http://localhost:8080`
- D) `http://localhost:3000`

### Q3. What is the purpose of `.dockerignore`?
- A) It stops Git from committing sensitive `.env` files.
- B) It prevents unnecessary files from being bundled into the Docker daemon build context.
- C) It automatically stops failing containers from writing to logs.
- D) It instructs Docker to ignore runtime security vulnerabilities.

### Q4. Which instruction in the Dockerfile switches process execution to a non-root user?
- A) `RUN chmod 777`
- B) `WORKDIR /usr/src/app`
- C) `USER node`
- D) `EXPOSE 3000`

### Q5. What does the exit code `137` indicate when running `docker ps -a` after `docker stop`?
- A) The container ran out of disk space.
- B) The process terminated due to receiving `SIGKILL` (128 + 9).
- C) The application threw an unhandled JavaScript SyntaxError.
- D) Port 3000 was already bound by another container.

### Q6. Does `EXPOSE 3000` publish port 3000 to the host network?
- A) Yes, it automatically binds `0.0.0.0:3000` on the host machine.
- B) No, it is purely metadata documentation; `-p` is still required at runtime.
- C) Yes, but only for `localhost`.
- D) Only if the container is run as `root`.

### Q7. If you have 500,000 active web visitors sending requests to your containerized API on AWS, how many image pulls does Docker Hub record?
- A) Exactly 500,000 pulls.
- B) One pull for every HTTP request received.
- C) Only the initial pull(s) made by the servers running the containers.
- D) Zero, because Docker Hub does not support web applications.

### Q8. What happens when you delete a stopped container using `docker rm <name>`?
- A) The container and its underlying image are both deleted from disk.
- B) The container's writable layer is removed, but the underlying image remains intact.
- C) The image is deleted, but the container process continues running in memory.
- D) Docker restarts the container automatically.

### Q9. What does the `:latest` tag mean in Docker Hub?
- A) It guarantees that running containers will auto-update every time code changes.
- B) It is a conventional tag name; it does not automatically update running containers.
- C) It is a reserved keyword that cannot be changed once published.
- D) It means the image has passed all unit tests.

### Q10. Which command shows low-level JSON details such as the container IP address and running process PID?
- A) `docker status`
- B) `docker logs`
- C) `docker inspect`
- D) `docker top`

---

## 🧩 Part 2: Scenario Challenges

### Scenario A: The Silent Crash
A developer writes a Dockerfile ending with:
```dockerfile
CMD ["node"]
```
When running `docker run -d my-node-app`, the container starts and immediately stops within 1 second. Why?
*(Think about STDIN and what Node does when invoked without a script filename in non-interactive mode).*

### Scenario B: The Localhost Trap
A developer modifies `server.js` so it binds strictly to `127.0.0.1`:
```javascript
server.listen(3000, '127.0.0.1');
```
They run `docker run -d -p 3000:3000 my-image`. Visiting `http://localhost:3000` on their laptop fails with `ERR_EMPTY_RESPONSE` or connection reset. Why?

---

## 🔬 Part 3: Practical Hands-On Lab Exercises

| # | Exercise | Objective | Status in CloudLab |
| :---: | :--- | :--- | :---: |
| **Lab 1** | **Two Containers, One Blueprint** | Run `cloudlab:v1` on port `8080` as `lab-a`, and on port `8081` as `lab-b`. Verify both work concurrently in your browser. | 🟢 Completed |
| **Lab 2** | **Targeted Container Stop** | Stop `lab-a`. Verify `lab-b` is still serving HTTP requests without interruption. | 🟢 Completed |
| **Lab 3** | **Safe Container Cleanup** | Remove `lab-a` with `docker rm`. Run `docker images` to verify `cloudlab:v1` is still on your computer. | 🟢 Completed |
| **Lab 4** | **Clean Remote Pull** | Delete all local tags of `cloudlab`. Pull `kanishjebamathewm/cloudlab:latest` fresh from Docker Hub and run it. | 🟡 Pending Exercise |
| **Lab 5** | **Release Version 2** | Change the welcome text in `server.js`, build `cloudlab:v2`, and publish it alongside `:latest`. | 🟡 Pending Exercise |
| **Lab 6** | **Zero-Downtime Rollback** | Deploy `v2`, simulate a defect, and roll back to `v1` in under 10 seconds. | 🟡 Pending Exercise |

---

## 🔑 Answer Key

### Part 1:
1. **B** — Containers share the host Linux kernel; VMs virtualize full hardware and boot a guest OS.
2. **C** — Host port 8080 forwards to container port 3000. Connect via `http://localhost:8080`.
3. **B** — `.dockerignore` prevents files from bloating the build context sent to the daemon.
4. **C** — `USER node` drops root privileges.
5. **B** — $128 + 9 = 137$, indicating termination via `SIGKILL`.
6. **B** — `EXPOSE` is informational only; `-p` binds host ports.
7. **C** — Visitors generate HTTP requests to the running server; only server provisioning triggers Docker image pulls.
8. **B** — `docker rm` destroys container state; images are deleted separately with `docker rmi`.
9. **B** — `:latest` is merely a default tag pointer; it does not trigger automatic updates.
10. **C** — `docker inspect` outputs complete JSON metadata.

### Part 2:
- **Scenario A**: Running `node` without arguments starts the Node interactive REPL. In detached mode (`-d`) without `-i` (interactive STDIN), standard input closes immediately, causing the Node REPL to reach EOF and exit with code 0!
- **Scenario B**: Binding to `127.0.0.1` inside the container means the server only accepts packets originating from inside the container itself. Traffic forwarded from the host arrives on the container's `eth0` bridge interface (`172.17.0.x`), which is rejected. Servers in containers must bind to `0.0.0.0`.
