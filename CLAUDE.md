# 따숨(Ddasoom) 프론트엔드 AI 개발 가이드라인 (CLAUDE.md)

> 유기동물 정보 제공 · 임시보호 신청 커뮤니티 "따숨" 프론트엔드 저장소의 AI 작업 지침서입니다.
> 이 문서는 프로젝트 루트에 위치하며, Claude Code가 모든 세션에서 자동으로 참조합니다.

---

## 0. 언어 정책

- 모든 대화와 출력은 **한국어**로 진행합니다.
- 계획(Plan)과 작업(Task) 설명 또한 한국어로 작성합니다.
- 코드 자체(변수명, 함수명, 주석의 기술 용어 등)는 관례상 영어를 유지해도 무방하나, 설명·커밋 메시지·PR 설명은 한국어를 기본으로 합니다.

---

## 1. 코딩 행동 원칙

> LLM이 흔히 저지르는 실수를 줄이기 위한 행동 지침입니다. 속도보다 신중함에 무게를 둡니다. 사소한 작업에는 판단력을 발휘해 유연하게 적용합니다.

### 1-1. 코딩 전에 생각하기 — 추측 금지, 혼란 숨기지 않기, 트레이드오프 표면화

- 구현 전 가정을 명시적으로 말합니다. 불확실하면 질문합니다.
- 여러 해석이 가능하면 제시하고, 임의로 하나를 골라 진행하지 않습니다.
- 더 단순한 방법이 있으면 그렇다고 말합니다. 필요하면 사용자 요청에 반박(push back)합니다.
- 불명확한 것이 있으면 멈춥니다. 무엇이 헷갈리는지 명시하고 질문합니다.

### 1-2. 단순함 우선 — 문제를 푸는 최소한의 코드, 투기적 코드 금지

- 요청받지 않은 기능을 추가하지 않습니다.
- 한 번만 쓰이는 코드에 추상화를 만들지 않습니다.
- 요청하지 않은 "유연성"/"설정 가능성"을 넣지 않습니다.
- 불가능한 시나리오에 대한 에러 핸들링을 만들지 않습니다.
- 200줄로 짤 걸 50줄로 짤 수 있다면, 다시 씁니다.
- 스스로에게 묻기: "시니어 엔지니어가 보면 과하게 복잡하다고 할까?" 그렇다면 단순화합니다.

### 1-3. 외과적 수정 — 건드려야 할 곳만, 내가 만든 흔적만 정리

- 기존 코드 수정 시: 인접 코드/주석/포맷을 "개선"하지 않습니다. 안 망가진 걸 리팩터링하지 않습니다. 기존 스타일을 따릅니다(내 취향과 달라도).
- 내 변경으로 orphan(고아 코드)이 생기면: 내 변경 때문에 안 쓰이게 된 import/변수/함수는 제거합니다. 원래 있던 죽은 코드는 요청 없이는 지우지 않고, 발견하면 언급만 합니다.
- 테스트 기준: 변경된 모든 줄은 사용자 요청과 직접 연결되어야 합니다.

### 1-4. 목표 기반 실행 — 성공 기준 정의, 검증될 때까지 반복

- 작업을 검증 가능한 목표로 변환합니다.
  - "검증 추가" → "잘못된 입력에 대한 테스트를 작성하고, 통과시키기"
  - "버그 수정" → "버그를 재현하는 테스트를 작성하고, 통과시키기"
  - "X 리팩터링" → "리팩터링 전후 테스트 통과 확인"
- 다단계 작업은 간단한 계획을 먼저 제시합니다:
  ```
  1. [단계] → 검증: [확인 방법]
  2. [단계] → 검증: [확인 방법]
  3. [단계] → 검증: [확인 방법]
  ```

**이 원칙이 잘 작동하고 있다는 신호**: diff에서 불필요한 변경이 줄어듦, 과도한 복잡화로 인한 재작성이 줄어듦, 실수 이후가 아니라 구현 전에 명확화 질문이 나옴.

---

## 2. 기술 스택 및 절대 규칙

| 분류 | 기술 | 비고 |
|---|---|---|
| 언어 | TypeScript 5.x | **JS 파일 작성 절대 금지**, `tsconfig strict: true` |
| 프레임워크 | React 18.3 | |
| 빌드 | Vite 6.x | 개발 서버 5173, dev 프록시로 `/api` 상대경로 사용 |
| 라우팅 | React Router v7 | 라우트 정의는 `app/router.tsx` 단일 파일 |
| 서버 상태 | TanStack Query v5 | API 데이터는 전부 여기서 관리. `queryKey`는 `shared/api/queryKeys.ts` 팩토리에서만 생성 (즉석 문자열 키 금지) |
| 클라이언트 상태 | Zustand | `getState()`로 React 외부(axios 인터셉터)에서 접근 가능하다는 점이 채택 이유 |
| HTTP | Axios | `withCredentials: true` 고정 (Refresh Token 쿠키 자동 동봉을 위해 필수) |
| 폼/검증 | React Hook Form + Zod | |
| 스타일 | Tailwind CSS v4 | 디자인 토큰은 `styles/theme.css` CSS 변수 사용 — 하드코딩 값으로 우회 금지 |
| UI | shadcn/ui (Radix 기반) | `shared/components/ui/`는 임의 수정 금지, 래핑은 `common/`에서 |
| 아이콘 | lucide-react | 타 아이콘 세트 혼용 금지 |

### 절대 규칙 (위반 시 즉시 수정 대상)

1. **JS 파일 생성 금지** — `.js`/`.jsx` 확장자로 신규 파일을 만들지 않습니다. 전부 `.ts`/`.tsx`.
2. **`authStore`에 토큰 필드를 두지 않습니다.**
   - `authStore`가 보관하는 것: `accessToken`(전역 상태 변수, 5절 참고), `user: { memberId, nickname, role }`, `isAuthReady: boolean`
   - **Refresh Token은 절대 프론트 코드가 다루지 않습니다.** 읽기·저장·전송 코드 일체 작성 금지 (httpOnly 쿠키로 브라우저가 자동 처리).
   - Access Token을 `localStorage`/`sessionStorage`에 백업하지 않습니다. 상태 변수 관리의 XSS 방어 이점이 사라집니다.
3. **인증 상태 판단은 `authStore.user`(및 `role`)로만 합니다.** JWT를 직접 디코딩하지 않습니다.
4. **queryKey는 팩토리 경유 필수.** `useQuery({ queryKey: ['animals'] })`처럼 즉석 배열을 쓰지 않고 `queryKeys.animals.list()` 형태로 사용합니다.

---

## 3. 프로젝트 구조 — 도메인(기능) 기반

백엔드 패키지(`com.paw.ddasoom.{도메인}`)와 프론트 `features/{도메인}`이 1:1로 대칭되도록 유지합니다.

```
src/
├── app/                      # 앱 전역 설정 (router, providers, bootstrap)
├── pages/                    # 라우트 1개 = 페이지 파일 1개. features 조립만 담당
├── features/                 # 도메인별 구현 — 팀원 담당 경계 = 폴더 경계
│   ├── auth/  animals/  board/  foster/  mypage/  admin/
├── shared/                   # 도메인에 속하지 않는 공통 자산
│   ├── api/                  #   axiosInstance.ts, queryKeys.ts, reissue.ts(single-flight)
│   ├── components/ui/        #   shadcn 컴포넌트 (수정 금지)
│   ├── components/common/    #   RequireAuth, RequireAdmin, ConfirmModal 등
│   ├── layouts/  hooks/  stores/  utils/  types/
└── styles/
```

### 운영 수칙 (반드시 준수)

1. **다른 사람의 `features/{도메인}` 폴더는 PR 없이 수정 금지.** 내가 맡은 도메인 폴더 외의 코드는 건드리지 않습니다. 관리자(admin) 도메인은 프론트 총괄 담당입니다.
2. 두 도메인 이상에서 공통으로 쓰이는 코드가 생기면 `shared/`로 승격 — 승격 시 팀 채널에 한 줄 공지 (임의 승격 금지).
3. `features` 간 직접 import를 지양합니다. 공유가 필요하면 `shared`를 경유합니다.
4. 게시판(정보교환/입양후기)은 별도 도메인이 아니라 `features/board/` 하나로 통합하고 `boardType` 파라미터로 분기합니다.

---

## 4. 함수 형태 컨벤션

| 대상 | 형태 | 이유 |
|---|---|---|
| 컴포넌트 · 커스텀 훅 · 최상위 함수 | **`function` 선언문** | 호이스팅으로 배치 자유, 스택 트레이스/DevTools 이름 보장, "파일의 주인공" 구분 |
| 컴포넌트 내부 핸들러 · 콜백 · 중첩 함수 | **화살표 함수** | 중첩 가독성, `this` 혼동 차단, "내부 로직" 구분 |

```tsx
// ✅ 올바른 예
function AnimalCard({ animal }: AnimalCardProps) {
  const handleLikeClick = () => {
    // 내부 핸들러는 화살표 함수
  };

  return <div onClick={handleLikeClick}>{animal.name}</div>;
}
```

> ESLint 강제 규칙:
> ```json
> "react/function-component-definition": ["error", {
>   "namedComponents": "function-declaration",
>   "unnamedComponents": "arrow-function"
> }]
> ```

기타 네이밍 컨벤션:

| 대상 | 규칙 | 예시 |
|---|---|---|
| 컴포넌트 파일 | PascalCase | `AnimalCard.tsx` |
| 페이지 컴포넌트 | `~Page` 접미사 필수 | `AdminFosterListPage.tsx` |
| 커스텀 훅 | `use` 접두사 | `useInfiniteScroll.ts` |
| API 모듈 | `{도메인}Api.ts`, 함수는 `get/create/update/delete` | `fosterApi.ts` → `getMyFosters()` |
| Zod 스키마 | `{이름}Schema` | `signupSchema` |

---

## 5. 인증 구조 (v3 최종 확정 — 2026-07)

> ⚠️ **주의**: README_v3.md 문서상에는 "Access/Refresh 모두 httpOnly 쿠키" 방식으로 기재되어 있으나, 이는 구버전 결정입니다. **아래 내용이 최신 확정 정책**이며, `SECURITY-FLOW.md`(백엔드 저장소 `docs/`)를 근거 문서로 합니다. README_v3.md는 갱신이 필요한 상태입니다.

### 확정 구조

| 항목 | Access Token | Refresh Token |
|---|---|---|
| 클라이언트 저장 | **전역 상태 변수** (`authStore`, zustand) | **HttpOnly 쿠키** — JS 접근 불가 |
| 서버 저장 | 없음 (로그아웃 시 `jti` 블랙리스트만 예외) | **Redis** (`refresh:{memberId}`) — reissue 시 대조 |
| 전송 방식 | 매 요청 `Authorization: Bearer {AT}` 헤더 | 브라우저 자동 전송 (쿠키, Path=`/api/auth`) |
| 재발급 시 | 새로 발급 | **새로 발급 (로테이션)** — 구 RT는 서버 측 grace period(30초) 후 완전 폐기 |

- **블랙리스트**: 로그아웃 시 AT의 `jti`를 남은 유효시간만큼 `blacklist:{jti}`에 등록. 토큰 전문이 아닌 `jti`로 관리(Redis 키 크기 절감).
- **RT 로테이션 + grace 30초**: 재발급 성공마다 RT를 새로 발급해 탈취된 RT의 수명을 단축시킵니다. 멀티탭이 동시에 마운트되며 발생하는 동시 재발급 경합은 서버의 30초 유예 키(`graceRefresh:{memberId}`)가 흡수합니다. **프론트는 이 경합에 대해 별도 처리를 하지 않습니다** — 탭마다 독립적으로 부트스트랩하면 됩니다.
- **재사용 탐지(reuse detection)는 이번 범위에서 미적용**입니다.

### 프론트 동작 규칙

- **부팅(새로고침 포함)**: `app/bootstrap.ts`가 `POST /api/auth/reissue`를 **조건 없이 1회** 호출합니다(RT는 httpOnly라 "쿠키가 있나?"를 JS가 판단할 수 없으므로 서버에 위임).
  - `200` → 응답 바디의 새 AT를 `authStore`에 저장, `user` 세팅, 로그인 상태로 렌더링
  - `401` → 비로그인 확정 (**정상 케이스** — 에러 로그/모니터링 전송 안 함)
  - 완료 시 `isAuthReady = true` — **이전에는 라우트 가드 판단 금지** (미이행 시 로그인 유저가 새로고침마다 튕기는 버그 발생)
- **Access 만료(401) 처리**: 응답 인터셉터 → **single-flight** 재발급 함수(`shared/api/reissue.ts`) → 성공 시 원 요청 재시도, 새 AT를 `authStore`에 갱신. rotation 구조상 single-flight는 필수입니다(중복 발사 시 두 번째 요청이 `REFRESH_TOKEN_MISMATCH`로 강제 로그아웃됨).
- **재발급 실패 = 일괄 로그아웃**: 에러 코드 무관하게 "재로그인 필요"로 수렴합니다. `authStore` 초기화 후 `/login` 이동. 코드별 개별 분기 금지.
- **reissue 자체의 401은 인터셉터가 다시 잡지 않도록 예외 처리**합니다. (무한 루프 방지)
- **로그아웃**: `POST /api/auth/logout` 호출(Authorization 헤더 필수) → 성공 시 `authStore` 초기화. RT 쿠키 삭제·Redis 정리는 서버가 수행합니다.
- **탭 간 동기화(선택)**: 탭마다 `authStore`가 독립적이므로, A탭 로그인/로그아웃을 B탭에 즉시 반영하려면 `BroadcastChannel`로 프론트에서 동기화합니다. 생략해도 서버 상태와의 최종 일치는 보장됩니다(다른 탭은 다음 reissue 시점에 자연히 401을 받아 로그아웃됨).
- **CSRF**: Spring `csrf.disable()` 유지, 방어는 `SameSite=Lax` + same-origin 프록시 조합. 전제: **상태 변경 API는 GET 금지**.

### 절대 하면 안 되는 것

- Access Token을 `localStorage`/`sessionStorage`에 저장
- Refresh Token 쿠키를 JS로 직접 읽으려는 시도 (httpOnly라 애초에 불가능)
- `/api/auth/reissue` 호출 시 RT를 Authorization 헤더에 첨부
- reissue 실패 시 무한 재시도 (재시도 1회 제한 플래그 필수)

---

## 6. API 응답 형식 (백엔드 확정 — B5)

```ts
interface ApiResponse<T> {
  code: string;      // "SUCCESS" 또는 에러 코드 (예: "MEMBER_001")
  message: string;
  data: T | null;
}
```

- 모든 API가 이 래퍼로 응답합니다. 성공 시 `code: "SUCCESS"`.
- 401/403은 Spring Security 필터 레벨에서 발생하며, `AuthenticationEntryPoint`/`AccessDeniedHandler`를 통해 동일 포맷으로 내려옵니다.

---

## 7. 백엔드 미결 사항 (확정 시 본 문서 갱신)

| # | 항목 | 상태 |
|---|---|---|
| B1 | reissue 응답의 AT가 body에 명시적으로 포함되는지, 필드명(`accessToken` 등) | 미확인 |
| B2 | reissue 응답의 `expiresIn` 단위(초/밀리초) | 미확인 |
| B3 | Access 쿠키(과거) 관련 레거시 로직 잔존 여부 — AT는 이제 쿠키가 아니므로 재확인 필요 | 미확인 |
| B4 | `/api/auth/me` 또는 로그인/reissue 응답의 사용자 정보 필드 스펙 확정 (`{memberId, nickname, role}`) | 스펙 방향은 확정, 세부 구현 확인 필요 |
| 5 | 목록 페이지네이션 응답 통일 (`{ content, hasNext, nextCursor }` 커서 기반 권장) | 미확인 |
| 6 | `/admin/login` 분리 채택 여부 | 프론트 권장안 있음(채택 권장), 백엔드 확인 필요 |
| 7 | 신고 기능 API | 백엔드 신규 개발 대기 |
| 8 | 게시판 2종 통합 여부 | 백엔드 테이블 설계 대기 |
| 9 | Swagger 도입 시점 | 팀 합의 대기 |
| ✅ | 성공 응답 공통 래퍼(`{code, message, data}`) | **확정 완료** (6절) |
| ✅ | CSRF 방침 | **확정 완료** (disable 유지 + SameSite=Lax) |
| ✅ | RT 로테이션 + grace period | **확정 완료** (30초) |

> **작업 시작을 막는 우선순위**: B1(reissue 응답 필드) → B4 세부 구현 → 5(페이지네이션) → 나머지

---

## 8. 트러블슈팅

**Q. 새로고침하면 로그아웃돼요.**
① `bootstrap.ts`의 reissue 호출이 실행·완료되는지 ② 가드가 `isAuthReady` 이전에 판단하고 있지 않은지(스피너가 떠야 정상) ③ `authStore`에 AT가 실제로 세팅됐는지 확인.

**Q. 401이 떴는데 자동 재발급이 안 돼요.**
① reissue 요청이 Network 탭에 찍히는지 ② single-flight 함수(`shared/api/reissue.ts`)를 거치지 않는 별도 axios 호출이 있는지 확인.

**Q. 재발급이 두 번 나가고 두 번째가 실패해요.**
rotation 구조에서 예정된 동작 — single-flight 누락입니다. 재발급 호출이 공용 함수를 통하는지 확인하세요.

---

## 9. npm 스크립트

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 (5173) |
| `npm run build` | 타입체크 + 프로덕션 빌드 (PR 전 실행 권장) |
| `npm run lint` | ESLint 검사 (함수 형태 규칙 포함) |
| `npm run test` | Vitest 실행 |

## 10. github push 작업
- CLAUDE.md 파일의 경우, github에 절대 push하지 말아야 함.
  `.gitignore` 등록 x, "C:\Users\user\Desktop\001.IT\005.MegaZone\01.project\ddasoom\ddasoom-frontend\.git\info\exclude"에 등록 완료