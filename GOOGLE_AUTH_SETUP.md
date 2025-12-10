
# Google OAuth 클라이언트 ID & Secret 발급 가이드

Supabase에서 Google 로그인을 켜려면, 구글 클라우드 플랫폼에서 **"나 Google 로그인 쓸거야!"** 라고 허락을 받아야 합니다.
이 과정에서 `Client ID`와 `Client Secret` 두 가지 암호를 받게 됩니다.

---

## 1단계: Google Cloud Console 접속
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속합니다.
2. 구글 계정으로 로그인합니다.
3. 왼쪽 상단 로고 옆의 **프로젝트 선택**을 누르고 **[새 프로젝트]** 를 만듭니다. (이름은 `Cryo` 등 자유롭게)

## 2단계: OAuth 동의 화면 구성 (Consent Screen)
1. 왼쪽 메뉴에서 **API 및 서비스** > **OAuth 동의 화면**을 클릭합니다.
2. **User Type**을 **외부(External)** 로 선택하고 [만들기]를 누릅니다.
3. **앱 정보** 입력:
    - **앱 이름**: `Cryo`
    - **사용자 지원 이메일**: 본인 이메일 선택
    - **개발자 연락처 정보**: 본인 이메일 입력
    - 나머지는 비워두고 [저장 후 계속]을 누릅니다.
4. **범위(Scopes)** 페이지는 그냥 맨 아래 [저장 후 계속]을 누릅니다.
5. **테스트 사용자** 페이지도 그냥 [저장 후 계속]을 누릅니다.

## 3단계: 사용자 인증 정보 만들기 (Credentials)
1. 왼쪽 메뉴에서 **API 및 서비스** > **사용자 인증 정보**를 클릭합니다.
2. 상단의 **[+ 사용자 인증 정보 만들기]** 버튼 > **OAuth 클라이언트 ID**를 선택합니다.
3. **애플리케이션 유형**: **웹 애플리케이션** 선택
4. **이름**: `Supabase Login` (자유롭게)
5. **승인된 리디렉션 URI (Authorized redirect URIs)** 섹션에 **URL 추가**를 누르고 아래 주소를 넣습니다:
    - **`https://miyryoatjvotejmiaztu.supabase.co/auth/v1/callback`**
    - *(이 주소는 Supabase의 'Callback URL (for OAuth)' 항목에 있는 것과 같습니다)*
6. **[만들기]** 버튼을 클릭합니다.

## 4단계: 키 복사 및 Supabase에 붙여넣기
1. 생성이 완료되면 팝업창에 **클라이언트 ID**와 **클라이언트 보안 비밀번호(Secret)** 가 뜹니다.
2. 이 두 값을 복사해서 **Supabase 화면**의 빈칸에 각각 붙여넣으세요.
3. **[Save]** 버튼을 누르면 끝!

---
**주의**: 클라이언트 보안 비밀번호는 절대 남에게 공유하지 마세요.

## 🚨 자주 발생하는 오류 해결 (Troubleshooting)

### "400 오류: redirect_uri_mismatch" 가 뜨나요?
이 오류는 **아래 주소를 구글 콘솔에 추가하지 않아서** 발생합니다.
Google Cloud Console > 사용자 인증 정보 > 내 프로젝트 클릭 > **승인된 리디렉션 URI** 에 아래 주소가 있는지 확인하세요.

**반드시 추가해야 할 주소:**
```
https://miyryoatjvotejmiaztu.supabase.co/auth/v1/callback
```
*(기존에 등록된 것이 있어도, 위 주소를 추가로 등록해야 합니다)*
