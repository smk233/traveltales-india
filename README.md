# 🌍 TravelTales India – DevSecOps & GitOps Project

A full-stack travel blogging application built with **React, Node.js, MongoDB, and Redis**, deployed on **AWS EKS** using a DevSecOps and GitOps-based CI/CD pipeline.

This project demonstrates automated CI/CD with Jenkins, code quality analysis using SonarQube, security scanning with Trivy and OWASP Dependency-Check, containerization with Docker, GitOps deployments using ArgoCD, and monitoring with Prometheus and Grafana.

flowchart TB
    DEV["👨‍💻 Developer"] -->|Push Code| GH["GitHub Repository"]

    subgraph AWS["☁️ AWS Cloud Infrastructure"]
        subgraph CI["1. DevSecOps CI Pipeline - AWS EC2"]
            J["Jenkins CI"]
            OWASP["OWASP Dependency-Check"]
            SONAR["SonarQube - Code Quality"]
            TRIVY["Trivy - Security Scanning"]
            DOCKER["Docker Build"]
            REG["Container Registry"]

            J --> OWASP --> SONAR --> TRIVY
            TRIVY --> DOCKER --> REG
        end

        subgraph CD["2. GitOps Continuous Deployment"]
            JCD["Jenkins CD"]
            MANIFEST["GitHub - Kubernetes Manifests"]
            ARGO["Argo CD"]
            EKS["AWS EKS Cluster"]

            JCD -->|Update Image Tag| MANIFEST
            MANIFEST -->|Sync Changes| ARGO
            ARGO -->|Deploy Application| EKS
        end

        subgraph APP["3. Application on Kubernetes"]
            FE["React Frontend"]
            BE["Node.js Backend"]
            MDB[("MongoDB")]
            REDIS[("Redis Cache")]

            FE --> BE
            BE --> MDB
            BE --> REDIS
        end

        subgraph MON["4. Monitoring & Observability"]
            PROM["Prometheus"]
            GRAF["Grafana"]
            ALERT["Email Alerts"]

            EKS -->|Metrics| PROM
            PROM --> GRAF
            PROM --> ALERT
        end
    end

    GH -->|Trigger Pipeline| J
    REG -->|Image Tag| JCD
    EKS --> FE
    EKS --> BE

    
