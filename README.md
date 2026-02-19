# 자유게시판 웹앱 (Supabase)

현재 구조는 `HTML/CSS/JS + Supabase`이며, 아래 보안 원칙으로 구성되어 있습니다.

- 비로그인: 읽기만 가능
- 로그인: 글 등록 가능
- 로그인: 본인 글만 수정/삭제 가능

## 구조

- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/config.js`: 환경설정 키 관리
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/supabaseClient.js`: Supabase 클라이언트 단일 생성
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/api/authApi.js`: 인증 API
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/api/postsApi.js`: 게시글 데이터 API
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/ui/postsView.js`: UI 렌더링
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/main.js`: 화면 이벤트/흐름 제어

## 1) DB 스키마/RLS 반영

Supabase SQL Editor에서 `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/supabase.sql`을 다시 실행하세요.

## 2) Supabase Auth 설정

- Supabase Dashboard -> Authentication -> Providers -> Email 활성화
- 필요 시 Email confirmation 정책 확인

## 3) 환경설정 키

- 실사용: `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/config.js`
- 템플릿: `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/config.example.js`

## 4) 실행

```bash
cd "/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트"
python3 -m http.server 5501
```

브라우저에서 `http://localhost:5501` 접속
