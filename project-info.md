# PRDBuilder (SwipeShop) 프로젝트 분석

## 프로젝트 개요

**SwipeShop**은 AI 기반 제품 마케팅 디자인 생성 및 큐레이션 도구입니다. Tinder 스타일의 스와이프 인터페이스를 통해 사용자가 AI가 생성한 다양한 마케팅 이미지와 카피를 선택할 수 있습니다.

- **버전**: 0.1.0
- **프레임워크**: Next.js 14.2.35 (App Router)
- **언어**: TypeScript 5

---

## 기술 스택

### 코어 프레임워크
- **Next.js 14.2.35** - React 프레임워크 (App Router)
- **React 18** - UI 라이브러리
- **TypeScript 5** - 타입 안정성

### 스타일링
- **Tailwind CSS 3.4.1** - 유틸리티 우선 CSS 프레임워크
- **tailwindcss-animate** - 애니메이션 유틸리티
- **class-variance-authority (CVA)** - 변형 기반 스타일링
- **clsx + tailwind-merge** - 클래스명 관리

### UI 컴포넌트
- **shadcn/ui** - 컴포넌트 라이브러리 (New York 스타일)
- **Radix UI** - 헤드리스 UI 프리미티브
- **Lucide React** - 아이콘 라이브러리
- **Framer Motion 12.29.0** - 스와이프 제스처 애니메이션

### 상태 관리
- **Zustand 5.0.10** - 경량 상태 관리

### AI/ML
- **@google/generative-ai 0.24.1** - Google Gemini API 클라이언트

### 백엔드 서비스
- **@supabase/supabase-js 2.91.1** - 데이터베이스 및 파일 저장소
- **@upstash/redis + @upstash/ratelimit** - Rate Limiting

### 캔버스/그래픽
- **Konva 9.3.22** - 캔버스 조작 라이브러리
- **react-konva 18.2.14** - Konva의 React 바인딩

### 개발 도구
- **ESLint** - 코드 린팅
- **Prettier 3.8.1** - 코드 포맷팅

---

## 프로젝트 구조

```
/home/soda_pop/workspace/prdbuilder/
├── src/
│   ├── app/                    # Next.js App Router 페이지 및 레이아웃
│   │   ├── api/               # API 라우트 (서버리스 함수)
│   │   │   ├── generate/      # AI 콘텐츠 생성 엔드포인트
│   │   │   └── upload/        # 파일 업로드 엔드포인트
│   │   ├── fonts/             # 커스텀 폰트 (Geist Sans & Mono)
│   │   ├── globals.css        # 글로벌 스타일 (Tailwind + CSS 변수)
│   │   ├── layout.tsx         # 루트 레이아웃 컴포넌트
│   │   └── page.tsx           # 홈 페이지 (메인 애플리케이션 UI)
│   ├── components/
│   │   ├── canvas/            # 캔버스 관련 컴포넌트
│   │   │   └── ImageStitch.tsx  # 이미지 병합/스티칭 기능
│   │   ├── swipe/             # 스와이프 인터랙션 컴포넌트
│   │   │   └── SwipeDeck.tsx  # Tinder 스타일 카드 스와이프 인터페이스
│   │   └── ui/                # 재사용 가능한 UI 컴포넌트 (shadcn/ui)
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── lib/
│   │   ├── ai/                # AI 서비스 추상화 레이어
│   │   │   ├── interface.ts   # AI 서비스 인터페이스 정의
│   │   │   └── gemini-adapter.ts  # Google Gemini API 구현
│   │   ├── supabase.ts        # Supabase 클라이언트 설정
│   │   └── utils.ts           # 유틸리티 함수 (cn 헬퍼)
│   └── store/
│       └── useAppStore.ts     # Zustand 전역 상태 관리
├── 설정 파일
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── tailwind.config.ts
│   ├── components.json        # shadcn/ui 설정
│   ├── postcss.config.mjs
│   ├── .eslintrc.json
│   └── .env.example
└── README.md
```

---

## 주요 디렉토리 및 역할

### `src/app/` - Next.js App Router 구조
- 메인 애플리케이션 페이지 및 서버 사이드 API 라우트
- 루트 레이아웃과 주요 사용자 인터페이스 포함
- 업로드 및 AI 생성을 위한 API 라우트

### `src/components/` - 기능별로 구성된 React 컴포넌트
- **`canvas/`**: HTML Canvas API를 사용한 이미지 조작 컴포넌트
- **`swipe/`**: Framer Motion을 사용한 인터랙티브 카드 스와이프 UI
- **`ui/`**: shadcn/ui 디자인 시스템 기반 재사용 가능한 UI 프리미티브

### `src/lib/` - 공유 라이브러리 및 유틸리티
- **`ai/`**: Google Gemini용 어댑터 패턴을 가진 추상 AI 서비스 레이어
- 데이터베이스/스토리지 클라이언트 초기화
- 유틸리티 함수

### `src/store/` - 상태 관리
- 전역 애플리케이션 상태를 위한 Zustand 스토어

---

## 진입점 및 중요 설정 파일

### 애플리케이션 진입점
- **`/src/app/page.tsx`** - 메인 애플리케이션 UI (클라이언트 컴포넌트)
- **`/src/app/layout.tsx`** - 폰트 및 메타데이터가 포함된 루트 레이아웃
- **`/src/app/api/generate/route.ts`** - AI 콘텐츠 생성 엔드포인트
- **`/src/app/api/upload/route.ts`** - 파일 업로드 엔드포인트

### 주요 설정 파일

**`tsconfig.json`**
- 경로 별칭: `@/*` → `./src/*`
- Strict 모드 활성화
- ESNext 모듈 해상도 (bundler 전략)

**`tailwind.config.ts`**
- 클래스 전략을 통한 다크 모드 지원
- CSS 변수를 사용한 커스텀 색상 시스템
- 컴포넌트 스캔을 위한 콘텐츠 경로
- 테두리 반경 커스터마이제이션

**`components.json`** (shadcn/ui)
- 스타일: "new-york"
- RSC (React Server Components) 활성화
- 컴포넌트, utils, UI, lib, hooks용 경로 별칭
- 아이콘 라이브러리: lucide
- 기본 색상: neutral

**`.env.example`**
- Supabase 설정 (URL + anon key)
- Google Gemini API 키
- Upstash Redis 자격 증명 (Rate Limiting용, 선택 사항)

---

## 아키텍처 패턴 및 설계 결정

### 아키텍처 패턴

#### 1. AI 서비스를 위한 어댑터 패턴
- `/src/lib/ai/interface.ts`가 `AIService` 인터페이스 정의
- `/src/lib/ai/gemini-adapter.ts`가 Google Gemini용 인터페이스 구현
- 애플리케이션 코드 변경 없이 AI 제공자 교체 가능

#### 2. 클라이언트-서버 분리
- API 라우트(`/api/generate`, `/api/upload`)가 서버 사이드 로직 처리
- 클라이언트 컴포넌트가 UI 인터랙션 처리
- 프론트엔드와 백엔드 간 명확한 관심사 분리

#### 3. Zustand를 사용한 상태 관리
- 중앙화된 스토어(`useAppStore`)가 관리:
  - 업로드된 이미지
  - 생성된 카드
  - 보관된 카드 (사용자 선택)
  - 로딩 상태
- 액션 메서드를 가진 깔끔하고 미니멀한 상태 API

#### 4. 컴포넌트 조합
- 단일 책임을 가진 작고 집중된 컴포넌트
- shadcn/ui 컴포넌트는 복합 컴포넌트 패턴 사용
- 유연성을 위한 ref 전달

#### 5. 타입 안정성
- 포괄적인 TypeScript 인터페이스
- Strict 모드 활성화
- 스토어 상태 및 API 응답을 위한 타입 정의

### 주요 설계 결정

#### 1. 파일 업로드 전략
- 보안 업로드를 위해 Supabase signed URL 사용
- 클라이언트가 Supabase 스토리지로 직접 업로드
- 이미지 접근을 위한 공개 버킷

#### 2. AI 파이프라인
- 3단계 프로세스: 배경 제거 → 배경 생성 → 카피 생성
- 배경 및 카피 생성의 병렬 실행
- AI 작업을 위한 60초 타임아웃

#### 3. Rate Limiting
- 선택적 Upstash Redis 통합
- IP당 60초에 5개 요청
- 미설정 시 우아한 폴백 (개발 모드)

#### 4. 애니메이션 전략
- 물리 기반 스와이프 제스처를 위한 Framer Motion
- 상태 전환을 위한 AnimatePresence
- 드래그/속도 감지를 통한 부드러운 카드 덱 인터랙션

#### 5. 이미지 처리
- 최종 출력을 위한 클라이언트 사이드 캔버스 스티칭
- 효율적인 내보내기를 위한 WebP 포맷
- CORS 인식 이미지 로딩

### 디자인 패턴
- **팩토리 패턴**: AI 서비스 초기화
- **옵저버 패턴**: Zustand 상태 구독
- **Presenter/Container 패턴**: 컴포넌트에서 UI와 로직 분리
- **Tailwind를 통한 CSS-in-JS**: 디자인 토큰을 가진 유틸리티 우선

---

## 애플리케이션 흐름

1. **사용자가 제품 이미지 업로드** → Signed URL을 통해 Supabase 스토리지로 전송
2. **이미지 URL이 `/api/generate`로 전달** → Rate-limited 서버 엔드포인트
3. **AI 파이프라인 실행:**
   - 배경 제거 (현재 구현에서는 플레이스홀더)
   - 10개의 배경 변형 생성 (현재 목업)
   - 3개의 마케팅 카피 변형 생성 (Gemini API)
4. **카드가 클라이언트로 반환** → Zustand 상태에 저장
5. **사용자가 카드를 스와이프** → 오른쪽 스와이프 = 보관, 왼쪽 = 버리기
6. **보관된 카드 저장** → 다운로드 가능
7. **다운로드가 캔버스 스티칭 트리거** → 보관된 이미지를 단일 WebP로 병합

---

## 현재 구현 상태

### 작동하는 기능
- ✅ Supabase로 파일 업로드
- ✅ Gemini를 통한 마케팅 카피 생성
- ✅ 물리 기반 스와이프 UI
- ✅ 이미지 스티칭 및 다운로드
- ✅ Rate Limiting (선택 사항)

### 알려진 제한 사항 (코드 주석에서)
- ⚠️ 배경 제거가 아직 구현되지 않음 (원본 반환)
- ⚠️ 배경 생성이 플레이스홀더 URL로 목업됨
- ⚠️ 실제 이미지 생성을 위해 Imagen API 접근 필요

---

## 의존성 요약

### 프로덕션 의존성 (29개 패키지)
- AI: `@google/generative-ai`
- 데이터베이스: `@supabase/supabase-js`
- Rate Limiting: `@upstash/ratelimit`, `@upstash/redis`
- 프레임워크: `next`, `react`, `react-dom`
- 스타일링: `tailwindcss`, `tailwind-merge`, `clsx`, `class-variance-authority`
- UI: `@radix-ui/react-slot`, `lucide-react`
- 애니메이션: `framer-motion`
- 캔버스: `konva`, `react-konva`
- 상태: `zustand`

### 개발 의존성 (10개 패키지)
- TypeScript 타입 정의
- ESLint + Next.js ESLint 설정
- Prettier
- PostCSS

---

## 다음 단계

### 구현 필요 기능
1. 실제 배경 제거 API 통합
2. Imagen API를 사용한 배경 생성
3. 이미지 품질 최적화
4. 에러 처리 개선
5. 사용자 인증 추가 (필요 시)

### 개선 가능 영역
- 생성된 카드를 위한 캐싱 전략
- 더 나은 로딩 상태 및 프로그레스 표시
- 모바일 반응형 최적화
- 접근성 개선
- 사용자 선택 지속성 (로컬 스토리지 또는 데이터베이스)

---

## 결론

PRDBuilder (SwipeShop)는 확장 가능한 아키텍처를 갖춘 잘 구조화된 MVP입니다. 현대적인 React 패턴, 명확한 관심사 분리, 추가 AI 기능으로 확장할 수 있는 견고한 기반을 제공합니다. 어댑터 패턴을 통해 다양한 AI 서비스 제공자를 쉽게 통합할 수 있으며, Zustand를 통한 상태 관리는 간단하면서도 효과적입니다.
