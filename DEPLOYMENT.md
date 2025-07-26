# 🚀 AWS Ubuntu + Nginx 배포 가이드

## 📋 사전 준비사항

### AWS EC2 인스턴스 설정
- **OS**: Ubuntu 22.04 LTS
- **인스턴스 타입**: t2.micro (프리티어) 또는 t3.small 이상
- **보안 그룹 설정**:
  - SSH (22) - 개발자 IP만 허용
  - HTTP (80) - 모든 IP 허용 (0.0.0.0/0)
  - HTTPS (443) - 모든 IP 허용 (0.0.0.0/0)

### 도메인 설정 (선택사항)
- 도메인이 있다면 EC2 IP를 A 레코드로 연결
- SSL 인증서를 위해 권장

## 🔧 1단계: 서버 접속 및 기본 설정

```bash
# EC2 인스턴스 접속
ssh -i your-key.pem ubuntu@your-ec2-ip

# 프로젝트 클론
git clone https://github.com/Hi-rien/duchApp.git
cd duchApp

# 자동 설치 스크립트 실행
chmod +x deploy-script.sh
./deploy-script.sh
```

## 📦 2단계: 프로젝트 빌드

```bash
# 프로젝트 디렉토리로 이동
cd /var/www/duchapp

# GitHub에서 프로젝트 클론
git clone https://github.com/Hi-rien/duchApp.git .

# 의존성 설치
npm install

# 카카오 API 키 설정 (선택사항)
cp .env.example .env
# .env 파일에서 VITE_KAKAO_JAVASCRIPT_KEY 설정

# 프로덕션 빌드
npm run build
```

## 🌐 3단계: Nginx 설정

```bash
# Nginx 설정 파일 복사
sudo cp nginx-duchapp.conf /etc/nginx/sites-available/duchapp

# 도메인/IP 설정 (도메인이 있는 경우)
sudo nano /etc/nginx/sites-available/duchapp
# server_name을 실제 도메인 또는 IP로 변경

# IP만 사용하는 경우
sudo sed -i 's/server_name your-domain.com www.your-domain.com;/server_name your-ec2-ip;/' /etc/nginx/sites-available/duchapp

# 사이트 활성화
sudo ln -s /etc/nginx/sites-available/duchapp /etc/nginx/sites-enabled/

# 기본 사이트 비활성화 (선택사항)
sudo rm /etc/nginx/sites-enabled/default

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl reload nginx
```

## 🔒 4단계: SSL 설정 (도메인이 있는 경우)

```bash
# SSL 설정 스크립트 실행
chmod +x ssl-setup.sh
./ssl-setup.sh

# 도메인과 이메일 입력하여 SSL 인증서 발급
```

## ✅ 5단계: 배포 완료 확인

### HTTP 접속 (IP 사용시)
```
http://your-ec2-ip
```

### HTTPS 접속 (도메인 + SSL)
```
https://your-domain.com
```

## 🔄 업데이트 배포

코드가 업데이트되었을 때:

```bash
cd /var/www/duchapp

# 최신 코드 가져오기
git pull origin main

# 새로운 의존성이 있다면
npm install

# 다시 빌드
npm run build

# 브라우저 캐시 문제 방지
sudo systemctl reload nginx
```

## 🛠️ 트러블슈팅

### Nginx 상태 확인
```bash
sudo systemctl status nginx
sudo nginx -t
```

### 로그 확인
```bash
# Nginx 에러 로그
sudo tail -f /var/log/nginx/duchapp_error.log

# Nginx 액세스 로그
sudo tail -f /var/log/nginx/duchapp_access.log
```

### 방화벽 확인
```bash
sudo ufw status
```

### 포트 확인
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

## 📱 모바일 테스트

- 아이폰 Safari에서 주소창 숨김/표시 테스트
- 카카오톡 공유 기능 테스트
- 터치 반응성 확인

## 🔧 성능 최적화 (선택사항)

### Nginx 성능 튜닝
```bash
# /etc/nginx/nginx.conf 수정
sudo nano /etc/nginx/nginx.conf

# worker_processes auto;
# worker_connections 1024;
# keepalive_timeout 65;
```

### 로그 로테이션 설정
```bash
sudo logrotate -d /etc/logrotate.d/nginx
```

## 🚀 완료!

더치페이 계산기가 성공적으로 배포되었습니다!

- 🌐 웹사이트: `http://your-ec2-ip` 또는 `https://your-domain.com`
- 📱 모바일 최적화: iOS Safari 100dvh 지원
- 🔒 보안: SSL/TLS 암호화
- ⚡ 성능: Gzip 압축, 정적 파일 캐싱
- 📋 모니터링: Nginx 로그 