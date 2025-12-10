
# Supabase API 키 찾는 법

Supabase 대시보드에서 다음 순서로 키를 찾으실 수 있습니다.

1. **[Supabase Dashboard](https://supabase.com/dashboard)** 에 로그인합니다.
2. 현재 작업 중인 **프로젝트를 클릭**합니다.
3. 좌측 메뉴 최하단에 있는 **Settings (톱니바퀴 아이콘)** 를 클릭합니다.
4. 설정 메뉴 중 **API** 를 클릭합니다.

## 필요한 값

### 1. Project URL (`VITE_SUPABASE_URL`)
- 화면 상단에 있는 **Project URL** 박스의 값을 복사하세요.
- 예: `https://your-project-id.supabase.co`

### 2. Project API Key (`VITE_SUPABASE_ANON_KEY`)
- **Project API keys** 섹션에 있는 `anon` `public` 키를 복사하세요.
- **주의**: `service_role` 키가 아닌 **`anon`** 키를 사용해야 합니다.
- 예: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 적용 방법

이 값을 복사해서 저에게 알려주시거나, `.env.local` 파일에 직접 붙여넣으시면 됩니다.

```env
VITE_SUPABASE_URL=여기에_URL_붙여넣기
VITE_SUPABASE_ANON_KEY=여기에_ANON_KEY_붙여넣기
```
