#!/bin/bash

# 🔒 SSL 인증서 설정 스크립트 (Let's Encrypt)

echo "🔒 SSL 인증서 설정을 시작합니다..."

# Certbot 설치
echo "📦 Certbot 설치 중..."
sudo apt install -y certbot python3-certbot-nginx

echo "📝 도메인을 입력하세요 (예: duchapp.com):"
read -p "도메인: " DOMAIN

echo "📝 이메일을 입력하세요:"
read -p "이메일: " EMAIL

# Nginx 설정에서 도메인 업데이트
echo "🔧 Nginx 설정 업데이트 중..."
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/duchapp
sudo sed -i "s/www.your-domain.com/www.$DOMAIN/g" /etc/nginx/sites-available/duchapp

# Nginx 설정 테스트 및 재시작
sudo nginx -t
sudo systemctl reload nginx

# SSL 인증서 발급
echo "🔒 SSL 인증서 발급 중..."
sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --no-eff-email

# 자동 갱신 설정
echo "🔄 SSL 인증서 자동 갱신 설정 중..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

echo "✅ SSL 설정 완료!"
echo "🌐 사이트 접속: https://$DOMAIN" 