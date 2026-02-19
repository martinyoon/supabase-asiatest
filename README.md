# 자유게시판 웹앱 (Supabase)

현재 구조는 `HTML/CSS/JS + Supabase`이며, 인증 화면을 별도 페이지로 분리했습니다.

- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/login.html`: 로그인 화면
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/signup.html`: 회원가입 화면
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/index.html`: 게시판 화면 (로그인 필요)

## 보안 원칙

- 비로그인: 게시판 페이지 접근 시 로그인 페이지로 이동
- 로그인: 글 등록 가능
- 로그인: 본인 글만 수정/삭제 가능

## 구조

- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/config.js`: 환경설정 키 관리
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/supabaseClient.js`: Supabase 클라이언트 단일 생성
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/api/authApi.js`: 인증 API
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/api/postsApi.js`: 게시글 데이터 API
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/login.js`: 로그인 페이지 로직
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/signup.js`: 회원가입 페이지 로직
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/main.js`: 게시판 화면 로직
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/ui/postsView.js`: 게시글 UI 렌더링

## 1) DB 스키마/RLS 반영

Supabase SQL Editor에서 `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/supabase.sql` 실행

## 2) Supabase Auth 설정

- Supabase Dashboard -> Authentication -> Providers -> Email 활성화
- 필요 시 Email confirmation 정책 확인

## 3) 실행

```bash
cd "/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트"
python3 -m http.server 5501
```

## 4) 접속 경로

- 로그인: `http://localhost:5501/login.html`
- 회원가입: `http://localhost:5501/signup.html`
- 게시판: `http://localhost:5501/index.html` (비로그인 시 자동으로 login으로 이동)
