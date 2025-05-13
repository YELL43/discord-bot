#!/bin/bash

# -- command run --
# chmod +x push_to_ecr.sh -- รันเพื่อให้สิทธิ์
# TAG_VERSION="0.0.10-local" ./push_to_ecr.sh

# ชื่อไฟล์: push_to_ecr.sh
# Script สำหรับ push Docker image ไป ECR และ logout

# กำหนดตัวแปร
REGION="ap-southeast-7"
ACCOUNT_ID="897722708777"
REPO_NAME="ecr-paneet"
TAG_VERSION="${TAG_VERSION:-0.0.9-local}"
TAG="api-production-${TAG_VERSION}"
ECR_URI="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# 1. ล็อกอินเข้า ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_URI}
if [ $? -ne 0 ]; then
    echo "Error: Failed to login to ECR. Check AWS credentials and region."
    exit 1
fi

# 2. Build Docker image
echo "Building Docker image --> ${REPO_NAME}:${TAG}"
docker build -t ${REPO_NAME}:${TAG} .
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed."
    exit 1
fi

# 3. Tag Docker image
echo "Tagging Docker image --> ${ECR_URI}/${REPO_NAME}:${TAG}"
docker tag ${REPO_NAME}:${TAG} ${ECR_URI}/${REPO_NAME}:${TAG}
if [ $? -ne 0 ]; then
    echo "Error: Docker tag failed."
    exit 1
fi

# 4. Push Docker image ไป ECR
echo "Pushing Docker image to ECR..."
docker push ${ECR_URI}/${REPO_NAME}:${TAG}
if [ $? -ne 0 ]; then
    echo "Error: Docker push failed."
    exit 1
fi

# 5. Logout จาก ECR
echo "Logging out from ECR..."
docker logout ${ECR_URI}
if [ $? -ne 0 ]; then
    echo "Warning: Failed to logout from ECR. You may need to logout manually."
else
    echo "Successfully logged out from ECR."
fi

echo "Process completed! Pushed ${REPO_NAME}:${TAG} to ECR and logged out."