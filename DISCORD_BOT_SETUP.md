# Discord Bot 설정 가이드

## 1. Discord Developer Portal

1. https://discord.com/developers/applications 접속
2. Cryo 앱 선택

## 2. 슬래시 명령어 등록

**Bot** 메뉴에서 **applications.commands** 스코프 확인

Discord API로 명령어 등록 (터미널에서 실행):

```bash
# DISCORD_BOT_TOKEN과 APPLICATION_ID를 교체하세요

curl -X POST \
  "https://discord.com/api/v10/applications/YOUR_APPLICATION_ID/commands" \
  -H "Authorization: Bot YOUR_BOT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "freeze",
      "description": "Freeze an idea",
      "options": [{
        "name": "idea",
        "description": "Your idea to freeze",
        "type": 3,
        "required": true
      }]
    },
    {
      "name": "thaw",
      "description": "Thaw a frozen idea",
      "options": [{
        "name": "id",
        "description": "Idea ID to thaw",
        "type": 3,
        "required": true
      }]
    },
    {
      "name": "vote",
      "description": "Vote for an idea",
      "options": [{
        "name": "id",
        "description": "Idea ID to vote for",
        "type": 3,
        "required": true
      }]
    },
    {
      "name": "list",
      "description": "List frozen ideas"
    }
  ]'
```

## 3. 사용법

| 명령어 | 설명 |
|--------|------|
| `/freeze [idea]` | 아이디어 저장 |
| `/thaw [id]` | 해동 |
| `/vote [id]` | 투표 |
| `/list` | 목록 보기 |

## 4. Supabase 환경변수

```
DISCORD_PUBLIC_KEY=xxx
DISCORD_BOT_TOKEN=xxx
```
