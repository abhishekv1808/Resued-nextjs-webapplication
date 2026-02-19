# Step-by-Step Guide: Deploying to AWS EC2

This guide walks you through deploying the Simtech Next.js application to an AWS EC2 instance using Docker and Nginx.

## Phase 1: AWS EC2 Setup

1.  **Launch Instance**:
    - Go to AWS Console > EC2 > Launch Instance.
    - **OS**: Ubuntu 24.04 LTS (HVM), SSD Volume Type.
    - **Instance Type**: `t3.medium` or higher recommended (Next.js build requires ~2GB RAM).
    - **Key Pair**: Create or select an existing `.pem` key pair.
2.  **Network Settings (Security Group)**:
    - Allow **SSH** (Port 22) from your IP.
    - Allow **HTTP** (Port 80) from Anywhere.
    - Allow **HTTPS** (Port 443) from Anywhere.

## Phase 2: Server Preparation

Connect to your instance via SSH:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

1.  **Update System**:
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
2.  **Install Docker**:
    ```bash
    sudo apt install docker.io -y
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker ubuntu
    # Logout and login again for group changes to take effect
    ```
3.  **Install Docker Compose**:
    ```bash
    sudo apt install docker-compose-v2 -y
    ```

## Phase 3: Project Deployment

1.  **Clone Repository**:
    ```bash
    git clone https://github.com/abhishekv1808/simtech-nextjs-webapp.git
    cd simtech-nextjs-webapp
    ```
2.  **Setup Environment**:
    Create a `.env.production` file using the values from `docs/AWS_DEPLOYMENT_GUIDE.md`:
    ```bash
    nano .env.production
    ```
3.  **Build and Run**:
    ```bash
    docker build -t simtech-app .
    docker run -d --name simtech --restart always -p 3000:3000 --env-file .env.production simtech-app
    ```

## Phase 4: Nginx & SSL (Reverse Proxy)

1.  **Install Nginx & Certbot**:
    ```bash
    sudo apt install nginx certbot python3-certbot-nginx -y
    ```
2.  **Configure Nginx**:
    Create a new configuration:

    ```bash
    sudo nano /etc/nginx/sites-available/simtech
    ```

    Paste this (Replace `yourdomain.com` with your actual domain):

    ```nginx
    server {
        listen 80;
        server_name yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

3.  **Enable Configuration**:
    ```bash
    sudo ln -s /etc/nginx/sites-available/simtech /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```
4.  **Obtain SSL Certificate**:
    ```bash
    sudo certbot --nginx -d yourdomain.com
    ```

## Phase 5: Verification

1.  Visit `https://yourdomain.com`.
2.  Check for the green padlock (SSL).
3.  Verify the `/api/health` endpoint: `https://yourdomain.com/api/health`.

> [!IMPORTANT]
> Ensure your Domain's A-Record points to the EC2 Elastic IP address before running Certbot.
