#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting Jenkins Docker installation...${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Create Jenkins data directory
JENKINS_HOME="$HOME/jenkins_home"
mkdir -p "$JENKINS_HOME"

echo -e "${GREEN}Created Jenkins home directory at $JENKINS_HOME${NC}"

# Create Docker network for Jenkins
docker network create jenkins-network 2>/dev/null || true
echo -e "${GREEN}Created Docker network: jenkins-network${NC}"

# Create Docker Compose file
cat > docker-compose.jenkins.yml << EOL
version: '3.8'
services:
  jenkins:
    image: jenkins/jenkins:lts
    container_name: jenkins
    restart: unless-stopped
    privileged: true
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    environment:
      - TZ=UTC
    volumes:
      - ${JENKINS_HOME}:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - jenkins-network

networks:
  jenkins-network:
    external: true
EOL

echo -e "${GREEN}Created Docker Compose file${NC}"

# Start Jenkins
echo -e "${BLUE}Starting Jenkins container...${NC}"
docker-compose -f docker-compose.jenkins.yml up -d

# Wait for Jenkins to start
echo -e "${BLUE}Waiting for Jenkins to start...${NC}"
sleep 10

# Get Jenkins initial admin password
echo -e "${BLUE}Fetching Jenkins initial admin password...${NC}"
while true; do
    JENKINS_PASSWORD=$(docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null)
    if [ $? -eq 0 ]; then
        break
    fi
    echo "Waiting for password file to be created..."
    sleep 5
done

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}Jenkins is running!${NC}"
echo -e "${GREEN}Access Jenkins at: http://localhost:8080${NC}"
echo -e "${GREEN}Initial Admin Password: $JENKINS_PASSWORD${NC}"
echo -e "${GREEN}===============================================${NC}"

# Print helpful next steps
echo -e "${BLUE}Next steps:${NC}"
echo "1. Visit http://localhost:8080 in your browser"
echo "2. Enter the initial admin password shown above"
echo "3. Install suggested plugins"
echo "4. Create your admin user"
echo "5. Start using Jenkins!"

# Print cleanup instructions
echo -e "\n${BLUE}To stop Jenkins:${NC}"
echo "docker-compose -f docker-compose.jenkins.yml down"

echo -e "\n${BLUE}To view logs:${NC}"
echo "docker logs jenkins"
