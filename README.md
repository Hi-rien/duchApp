# 🍽️ 더치페이 계산기 (Dutch Pay Calculator)

간편하고 정확한 모임비 정산을 위한 웹 애플리케이션입니다. 복잡한 다차수 정산도 쉽게 계산할 수 있으며, 모바일 최적화와 카카오톡 공유 기능을 제공합니다.

## ✨ 주요 기능

### 🎯 핵심 기능
- **📱 모바일 최적화**: PWA 지원, iOS Safari 주소창 대응 (100dvh)
- **👥 그룹 관리**: 모임 구성원 등록 및 저장된 그룹 재사용
- **🔄 다차수 정산**: 여러 차례 결제 내역을 한 번에 정산
- **💰 스마트 계산**: 개별/공동 결제, 참여자별 분담 계산
- **📊 상세 결과**: 차수별/전체 정산 내역 표시
- **💾 자동 저장**: 로컬 스토리지를 이용한 정산 내역 보관
- **📤 카카오톡 공유**: 정산 결과를 카카오톡으로 간편 공유

### 🛠️ 추가 기능
- **📋 정산 내역 관리**: 과거 정산 기록 조회 및 삭제
- **🔙 단계별 네비게이션**: 직관적인 페이지 이동과 뒤로가기
- **🎨 반응형 UI**: 데스크톱/모바일 모든 환경에서 최적화
- **⚡ 실시간 계산**: 입력과 동시에 결과 업데이트

## 🛠️ 기술 스택

### Frontend
- **React 19.1.0** - 메인 프레임워크
- **Vite 7.0.4** - 빌드 도구 및 개발 서버
- **React Router DOM 7.7.1** - 클라이언트 사이드 라우팅
- **Tailwind CSS 3.4.17** - 유틸리티 우선 CSS 프레임워크
- **PostCSS & Autoprefixer** - CSS 후처리

### Development & Build
- **ESLint** - 코드 품질 및 일관성 관리
- **Node.js** - 런타임 환경
- **npm** - 패키지 관리

### Deployment
- **Nginx** - 웹 서버
- **AWS EC2** - 호스팅 플랫폼
- **SSL/TLS** - HTTPS 보안 연결
- **Let's Encrypt** - 무료 SSL 인증서

### External APIs
- **Kakao JavaScript SDK** - 카카오톡 공유 기능

## 📁 프로젝트 구조

```
cursor_test/
├── public/                    # 정적 파일
│   └── vite.svg              # 파비콘
├── src/
│   ├── components/           # React 컴포넌트
│   │   ├── Home.jsx         # 메인 홈페이지
│   │   ├── GroupSetup.jsx   # 모임 구성원 설정
│   │   ├── RoundBilling.jsx # 차수별 결제 입력
│   │   ├── BillingSummary.jsx # 정산 결과 표시
│   │   ├── BillingHistory.jsx # 정산 내역 관리
│   │   ├── GroupManagement.jsx # 그룹 관리
│   │   └── Footer.jsx       # 하단 네비게이션
│   ├── assets/              # 이미지 및 아이콘
│   ├── App.jsx             # 메인 애플리케이션 컴포넌트
│   ├── main.jsx           # 애플리케이션 진입점
│   └── index.css          # 글로벌 스타일
├── index.html             # HTML 템플릿
├── package.json          # 의존성 및 스크립트
├── vite.config.js       # Vite 설정
├── tailwind.config.js   # Tailwind CSS 설정
├── eslint.config.js     # ESLint 설정
├── deploy-script.sh     # 자동 배포 스크립트
├── ssl-setup.sh         # SSL 설정 스크립트
├── nginx-duchapp.conf   # Nginx 서버 설정
└── DEPLOYMENT.md        # 배포 가이드
```

## 🚀 설치 및 실행

### 사전 요구사항
- Node.js 18+ 
- npm 또는 yarn

### 로컬 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone https://github.com/Hi-rien/duchApp.git
   cd duchApp
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정** (선택사항)
   ```bash
   cp .env.example .env
   # .env 파일에서 VITE_KAKAO_JAVASCRIPT_KEY 설정
   ```

4. **개발 서버 실행**
   ```bash
   npm run dev
   ```

5. **브라우저에서 확인**
   ```
   http://localhost:5173
   ```

### 빌드 및 배포

1. **프로덕션 빌드**
   ```bash
   npm run build
   ```

2. **빌드 결과 미리보기**
   ```bash
   npm run preview
   ```

3. **배포** (AWS EC2 + Nginx)
   - 상세한 배포 가이드는 [DEPLOYMENT.md](DEPLOYMENT.md) 참조

## 📱 사용법

### 1. 정산 시작하기
1. **"정산 시작"** 버튼 클릭
2. 모임 이름과 참여자 입력
3. 기존 저장된 그룹 재사용 가능

### 2. 차수별 결제 입력
1. 가게명과 결제자 선택
2. 메뉴별 가격과 수량 입력
3. 개별/공동 결제 선택
4. 참여자별 분담 설정

### 3. 정산 결과 확인
1. 차수별 정산 내역 확인
2. 전체 정산 요약 확인
3. 카카오톡으로 결과 공유

### 4. 정산 내역 관리
1. 과거 정산 기록 조회
2. 불필요한 기록 삭제
3. 정산 내역 재확인

## 🎯 주요 컴포넌트 설명

### 🏠 Home.jsx
- 애플리케이션의 메인 페이지
- 정산 시작 및 내역 조회 버튼
- 최근 정산 내역 표시 및 관리
- 첫 사용자를 위한 안내 메시지

### 👥 GroupSetup.jsx
- 모임 이름과 참여자 설정
- 저장된 그룹 불러오기 및 재사용
- 새로운 그룹 저장 기능
- 참여자 추가/삭제 관리

### 🔄 RoundBilling.jsx
- 다차수 결제 내역 입력
- 차수별 가게명, 결제자, 메뉴 관리
- 개별/공동 결제 참여자 선택
- 실시간 차수별 금액 계산

### 📊 BillingSummary.jsx
- 최종 정산 결과 표시
- 차수별 상세 내역 및 전체 요약
- 받을 돈/보낼 돈 계산 결과
- 카카오톡 공유 기능

### 📋 BillingHistory.jsx
- 저장된 정산 내역 조회
- 정산 기록 검색 및 필터링
- 개별 정산 상세 보기
- 정산 내역 삭제 기능

## 💡 주요 알고리즘

### 정산 계산 로직
1. **차수별 계산**: 각 차수의 총 금액을 참여자 수로 분할
2. **개별 결제**: 특정 인원만 참여하는 메뉴 계산
3. **전체 정산**: 모든 차수의 결과를 합산하여 최종 송금 내역 계산
4. **최적화**: 중복 송금을 최소화하는 알고리즘 적용

### 데이터 관리
- **로컬 스토리지**: 그룹 정보 및 정산 내역 영구 저장
- **상태 관리**: React useState를 이용한 컴포넌트간 데이터 공유
- **실시간 업데이트**: 입력 변경시 즉시 계산 결과 반영

## 🌐 배포 정보

### 현재 배포 환경
- **서버**: AWS EC2 Ubuntu 22.04 LTS
- **웹서버**: Nginx
- **SSL**: Let's Encrypt (HTTPS 지원)
- **도메인**: 사용자 설정에 따라 유동적

### 자동 배포
```bash
# 원클릭 배포 스크립트
chmod +x deploy-script.sh
./deploy-script.sh
```

## 🔧 개발자 도구

### 코드 품질 관리
```bash
# ESLint 검사
npm run lint

# 코드 포맷팅 (설정된 경우)
npm run format
```

### 디버깅
- React Developer Tools 사용 권장
- 브라우저 개발자 도구의 로컬 스토리지 확인
- 네트워크 탭에서 카카오 API 호출 상태 확인

## 🤝 기여하기

1. **Fork** 프로젝트
2. **Feature Branch** 생성 (`git checkout -b feature/AmazingFeature`)
3. **커밋** (`git commit -m 'Add some AmazingFeature'`)
4. **Push** (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

### 개발 가이드라인
- 컴포넌트는 함수형으로 작성
- Tailwind CSS 클래스 사용 권장
- 모바일 우선 반응형 디자인
- 접근성(a11y) 고려한 UI 구현

## 📞 문의 및 지원

- **이슈 리포트**: [GitHub Issues](https://github.com/Hi-rien/duchApp/issues)
- **기능 제안**: [GitHub Discussions](https://github.com/Hi-rien/duchApp/discussions)

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🙏 감사인사

- React 팀의 훌륭한 프레임워크
- Tailwind CSS의 효율적인 스타일링
- Vite의 빠른 개발 환경
- 카카오 개발자 플랫폼의 공유 API

---

**🍽️ 더치페이 계산기**로 모임비 정산을 더 쉽고 정확하게 해보세요!
