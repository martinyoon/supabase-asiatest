# 자유게시판 웹앱 (Supabase)

현재 구조는 `HTML/CSS/JS + Supabase`이며, 이후 Next.js 전환을 고려해 레이어를 분리해두었습니다.

## 구조

- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/config.js`: 환경설정 키 관리
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/supabaseClient.js`: Supabase 클라이언트 단일 생성
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/api/postsApi.js`: 데이터 접근(API 호출)
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/ui/postsView.js`: UI 렌더링
- `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/main.js`: 화면 이벤트/흐름 제어

## 1) DB 스키마/RLS 반영

Supabase SQL Editor에서 `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/supabase.sql` 실행

## 2) 환경설정 키 통일

- 실사용: `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/config.js`
- 템플릿: `/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트/js/config.example.js`

## 3) 실행

```bash
cd "/Users/yoonsukmin/Documents/코덱스 앱 = 연습=001/수파베이스=아시아테스트"
python3 -m http.server 5500
```

브라우저에서 `http://localhost:5500` 접속
