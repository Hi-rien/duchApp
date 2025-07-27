# 🍽️ 더치페이 계산기

간편하고 정확한 모임비 정산을 위한 웹 애플리케이션입니다.

## ✨ 주요 기능

- **👥 그룹 관리**: 모임 구성원 등록 및 저장된 그룹 재사용
- **🔄 다차수 정산**: 여러 차례 결제 내역을 한 번에 정산
- **💰 스마트 계산**: 개별/공동 결제, 참여자별 분담 계산
- **📊 정산 결과**: 차수별/전체 정산 내역 및 송금 정보 표시
- **💾 자동 저장**: 로컬 스토리지를 이용한 정산 내역 보관
- **📤 카카오톡 공유**: 정산 결과를 카카오톡으로 공유
- **📱 모바일 최적화**: 반응형 디자인, iOS Safari 지원

## 🛠️ 기술 스택

### Frontend
- React 19.1.0
- Vite 7.0.4
- React Router DOM 7.7.1
- Tailwind CSS 3.4.17
- PostCSS & Autoprefixer

### Development
- ESLint
- Node.js
- npm

### Deployment
- Oracle Cloud Infrastructure
- Ubuntu 22.04 LTS
- Nginx

### External APIs
- Kakao JavaScript SDK

## 🚀 설치 및 실행

### 로컬 개발 환경

```bash
# 저장소 클론
git clone [repository-url]
cd cursor_test

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 📱 사용법

1. **정산 시작**: 모임 이름과 참여자 입력
2. **차수별 입력**: 가게명, 결제자, 메뉴별 가격 및 참여자 설정
3. **정산 결과**: 차수별 내역 및 최종 송금 정보 확인
4. **공유하기**: 카카오톡으로 정산 결과 공유

## 📁 주요 컴포넌트

- `Home.jsx` - 메인 페이지
- `GroupSetup.jsx` - 모임 구성원 설정
- `RoundBilling.jsx` - 차수별 결제 입력
- `BillingSummary.jsx` - 정산 결과 표시
- `BillingHistory.jsx` - 정산 내역 관리
