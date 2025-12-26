# Chalk - 시니어 PM 개선 제안서 및 로드맵

## 1. 제품 비전 (Product Vision)
**"과외 선생님을 위한 올인원 운영체제 (All-in-one OS for Tutors)"**

Chalk는 단순한 수업 기록 앱을 넘어, 선생님들이 파편화된 도구(Zoom, Calendar, Excel, Notion)들을 하나로 통합하여 **"수업에만 집중할 수 있게 만드는"** 슈퍼 앱을 지향합니다.

## 2. 현재 상태 진단 (Current Status)
*   **기술적 이슈 해결:** `Version A` (English UI, 심플한 디자인)와 `Version B` (Korean UI, 고도화된 디자인) 간의 충돌을 해결하고, **Version A(English UI)** 기반으로 코드베이스를 안정화했습니다.
*   **핵심 가치:** "편리한 기록"과 "데이터 기반 인사이트".
*   **타겟 유저:** 개인 과외 선생님 (Freelance Tutors).

## 3. 단계별 로드맵 (Roadmap)

### Phase 1: 기반 구축 (Foundation) - *Current Focus*
> **목표:** 선생님이 수업 직후 10초 안에 기록을 남길 수 있는 경험 제공
*   [x] **안정화:** 앱 구동 불가 이슈(Merge Conflict) 해결 완료.
*   [ ] **기본 기록:** 학생 별 수업 내용, 숙제, 성취도(Rating) 기록 기능 고도화.
*   [ ] **데이터 구조화:** 향후 분석을 위해 태그/토픽 기반의 데이터 스키마 정립.

### Phase 2: 연결과 통합 (Integrations) - *Next Step*
> **목표:** 선생님이 이미 쓰는 툴을 연결하여 "자동으로" 기록되게 함
선생님들이 자주 사용하는 툴을 연동하여, 앱을 켜지 않아도 데이터가 쌓이는 구조를 만듭니다.

| 카테고리 | 연동 대상 툴 | 제공 가치 |
| :--- | :--- | :--- |
| **일정 (Scheduling)** | **Google Calendar, Calendly** | 수업 일정 자동 동기화, 변경 사항 알림 |
| **화상 (Video)** | **Zoom, Google Meet** | 수업 시간/길이 자동 기록, 녹화본 링크 연동 |
| **결제 (Payment)** | **Stripe** | 수업료 결제 내역 연동, 미수금 알림 자동화 |
| **소통 (Comm)** | **Gmail, WhatsApp/Kakao** | 수업 리포트(피드백) 자동 발송 기능 |
| **자료 (Content)** | **Notion, Google Drive** | 수업 자료 링크 및 공유 |

### Phase 3: 지능화와 확장 (Intelligence & Growth)
> **목표:** 모인 데이터를 분석하여 선생님의 가치를 증명 (Pro Plan)
*   **AI 인사이트:** "이 학생은 '이차방정식' 유형에서 집중력이 떨어집니다"와 같은 패턴 분석 제공.
*   **자동 포트폴리오:** 수업 기록과 후기를 모아 학부모/신규 학생에게 보여줄 수 있는 웹 포트폴리오 자동 생성.
*   **마케팅 도구:** 성과 그래프를 이미지로 공유하여 신규 학생 모집 지원.

## 4. UX/UI 개선 제안 (Based on Version A)
현재 채택된 **Version A**는 직관적이지만 다소 투박할 수 있습니다. 다음 개선안을 제안합니다.
1.  **Dashboard First:** 앱 실행 시 바로 '오늘의 수업'이 보이고, 원터치로 기록 진입 (현재 `Log` 탭 유지하되 시각적 강조).
2.  **Quick Actions:** 탭 바 상단에 Floating Action Button (+)을 두어 언제든 급한 메모/일정 추가 가능.
3.  **Visual Feedback:** 성취도(Rating) 입력 시 단순 아이콘 선택을 넘어, 미세한 햅틱/애니메이션 피드백으로 "기록하는 맛" 제공.

---
*작성자: Jules (Senior PM & Engineer)*
*작성일: 2024-05-21*
