# CloudLab Project Roadmap: From Local Containers to Cloud Production

This roadmap outlines the systematic step-by-step curriculum for CloudLab. The project begins with local container fundamentals and progresses toward enterprise cloud deployment on Amazon Web Services (AWS) using Infrastructure as Code (IaC) and automated CI/CD pipelines.

---

## 🗺️ High-Level Progress Overview

| Phase | Milestone | Status | Key Deliverables |
| :--- | :--- | :---: | :--- |
| **Phase 1** | Docker Fundamentals | 🟢 Complete / Hands-on Lab | Pure Node server, Alpine Dockerfile, container networking, Docker Hub release |
| **Phase 2** | Cloud Deployment on AWS EC2 | 🟡 Planned (Next) | AWS EC2 Linux instance, Security Groups, SSH, cloud container execution |
| **Phase 3** | AWS Elastic Container Registry (ECR) | ⚪ Planned | Private AWS container registry, AWS CLI, IAM auth, image vulnerability scanning |
| **Phase 4** | AWS ECS & Serverless Fargate | ⚪ Planned | ECS Task definitions, container clusters, serverless containers, auto-recovery |
| **Phase 5** | Monitoring with Amazon CloudWatch | ⚪ Planned | Container log streaming, health metrics, threshold alarms, observability |
| **Phase 6** | Static Asset & Object Storage with AWS S3 | ⚪ Planned | S3 bucket policies, presigned URLs, programmatic uploads/downloads |
| **Phase 7** | CI/CD Automation & Terraform IaC | ⚪ Planned | GitHub Actions build/test/push workflows, declarative Terraform infrastructure |

---

## 📌 Phase 1 — Docker Fundamentals

### Completed Experiments & Topics:
- [x] **Client vs Engine Architecture**: Verifying CLI communication with the Docker daemon via WSL2.
- [x] **Dependency Isolation**: Running Node.js v22.23.4 inside a container on a host running Node.js v23.7.0.
- [x] **Lightweight Alpine Dockerfile**: Using `node:22-alpine` for minimal attack surface.
- [x] **Least-Privilege Security**: Enforcing non-root container execution (`USER node`).
- [x] **Layered Image Builds**: Understanding BuildKit caching, manifests, digests, and attestations.
- [x] **Container Networking**: Dissecting host port vs container port mapping (`-p 3000:3000`).
- [x] **Deep Container Inspection**: Parsing `docker inspect` JSON state, network gateways, and exit codes.
- [x] **Entering Containers**: Exploring internal filesystem with `docker exec -it ... sh`.
- [x] **Container Lifecycle**: Observing state transitions (`Created`, `Running`, `Exited (137)`).
- [x] **Docker Hub Distribution**: Publishing `kanishjebamathewm/cloudlab:v1` and `:latest` to public registries.

### Pending Practical Exercises (Phase 1 Refinement):
- [ ] **Clean Pull Test**: Pulling and running the published Docker Hub image on an isolated machine.
- [ ] **Multi-Container Coexistence**: Running two simultaneous containers mapped to host ports 8080 and 8081.
- [ ] **v2 Image Release & Rollback**: Publishing an updated application tag and demonstrating zero-downtime rollback.
- [ ] **Volumes & Persistence Exploration**: Testing named volumes and bind mounts.

---

## 📌 Phase 2 — AWS EC2 (Single Virtual Machine Deployment)
*Status: Planned (Next Phase)*

- [ ] **AWS Account & IAM Setup**: Setting up least-privilege IAM users and AWS billing alarms.
- [ ] **EC2 Provisioning**: Launching an Amazon Linux 2023 or Ubuntu EC2 `t3.micro` instance within the AWS Free Tier.
- [ ] **Network & Security Groups**: Configuring ingress rules (Allow SSH port 22 and HTTP port 80/3000).
- [ ] **Key Pair Management**: Generating, securing (`chmod 400`), and using SSH `.pem` private keys.
- [ ] **Cloud Docker Setup**: Installing and enabling Docker Engine on the remote Linux host.
- [ ] **Deploying CloudLab**: Pulling `kanishjebamathewm/cloudlab:latest` directly from Docker Hub onto EC2.
- [ ] **Public Verification**: Accessing the live welcome page and `/health` endpoint over the public IPv4 address.
- [ ] **Resource Cleanup**: Stopping/terminating EC2 instances to guarantee zero unexpected cloud costs.

---

## 📌 Phase 3 — AWS ECR (Private Container Registry)
*Status: Planned*

- [ ] **ECR Repository Creation**: Creating private repositories on Amazon Elastic Container Registry.
- [ ] **AWS CLI Authentication**: Using `aws ecr get-login-password` to authenticate the local Docker client.
- [ ] **IAM Permission Policies**: Configuring fine-grained push and pull policies for developer and service roles.
- [ ] **Image Tagging & Pushing**: Pushing private CloudLab images into AWS ECR.
- [ ] **ECR vs Docker Hub Comparison**: Analyzing cost, network latency within AWS VPCs, and automated CVE vulnerability scanning.

---

## 📌 Phase 4 — AWS ECS & Fargate (Serverless Container Orchestration)
*Status: Planned*

- [ ] **ECS Cluster Architecture**: Understanding Task Definitions, Services, and Tasks.
- [ ] **AWS Fargate Serverless Engine**: Running containers without provisioning or managing underlying EC2 VMs.
- [ ] **Task Networking**: Configuring `awsvpc` network mode, security groups, and public IP assignment.
- [ ] **Application Load Balancing (ALB)**: Routing public internet traffic across multiple container tasks.
- [ ] **Auto-Recovery & Scaling**: Simulating task crashes and observing ECS self-healing and automatic container replacement.

---

## 📌 Phase 5 — CloudWatch (Monitoring & Observability)
*Status: Planned*

- [ ] **CloudWatch Container Insights**: Capturing CPU, memory utilization, and network throughput metrics.
- [ ] **Centralized Log Streaming**: Configuring the `awslogs` driver to aggregate Node.js server logs into CloudWatch Logs.
- [ ] **Metric Filters & Alarms**: Setting up automated alerts triggered by 4xx/5xx HTTP error rate spikes or container restarts.
- [ ] **CloudWatch Dashboard**: Creating a consolidated operations dashboard for real-time visibility.

---

## 📌 Phase 6 — AWS S3 (Static Assets & Object Storage)
*Status: Planned*

- [ ] **S3 Bucket Provisioning**: Creating encrypted, private S3 buckets.
- [ ] **Decoupling Storage**: Offloading static files or log archives from the container filesystem to S3.
- [ ] **Bucket Policies & IAM Roles**: Giving containers secure access to S3 without embedding AWS credentials.
- [ ] **Presigned URLs**: Generating temporary, secure links for direct object download.

---

## 📌 Phase 7 — Automation: CI/CD & Terraform
*Status: Planned*

- [ ] **GitHub Actions Workflows**: Automatically building and testing Docker images on git push.
- [ ] **Automated Registry Push**: Securely pushing new images to Docker Hub and AWS ECR via OIDC.
- [ ] **Infrastructure as Code (IaC)**: Codifying AWS infrastructure (VPC, Security Groups, ECS, S3) using Terraform.
- [ ] **Automated Deployment Pipeline**: Triggering rolling updates on ECS whenever new code merges into `main`.
