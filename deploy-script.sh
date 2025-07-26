#!/bin/bash

# 🚀 더치페이 계산기 AWS Ubuntu + Nginx 배포 스크립트

echo "🔧 시스템 업데이트 중..."
sudo apt update && sudo apt upgrade -y

echo "📦 필수 패키지 설치 중..."
sudo apt install -y curl wget git nginx

echo "📦 Node.js 설치 중..."
# Node.js 20.x 설치
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "📋 설치된 버전 확인"
node --version
npm --version
nginx -v

echo "🔥 방화벽 설정"
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "🚀 Nginx 시작"
sudo systemctl start nginx
sudo systemctl enable nginx

echo "📁 프로젝트 디렉토리 생성"
sudo mkdir -p /var/www/duchapp
sudo chown -R $USER:$USER /var/www/duchapp

echo "✅ 기본 설정 완료!"
echo "이제 프로젝트를 클론하고 빌드하세요:"
echo "git clone https://github.com/Hi-rien/duchApp.git /var/www/duchapp" 