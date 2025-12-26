const ZOOM_API_BASE = 'https://api.zoom.us/v2';

export interface ZoomMeeting {
    id: number;
    uuid: string;
    topic: string;
    start_time: string;
    duration: number; // minutes
    type: number;
    status: string;
}

export interface ZoomParticipant {
    id: string;
    name: string;
    user_email?: string;
    join_time: string;
    leave_time: string;
    duration: number; // seconds
}

export interface ZoomMeetingsResponse {
    meetings: ZoomMeeting[];
    page_count: number;
    page_number: number;
    page_size: number;
    total_records: number;
}

// 과거 미팅 조회
export async function getPastMeetings(
    accessToken: string,
    days: number = 30
): Promise<ZoomMeeting[]> {
    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
    const to = new Date().toISOString().split('T')[0];

    const response = await fetch(
        `${ZOOM_API_BASE}/users/me/meetings?type=past&from=${from}&to=${to}&page_size=50`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Zoom API error: ${response.status}`);
    }

    const data: ZoomMeetingsResponse = await response.json();
    return data.meetings || [];
}

// 특정 미팅의 참석자 조회
export async function getMeetingParticipants(
    accessToken: string,
    meetingUuid: string
): Promise<ZoomParticipant[]> {
    // UUID에 / 또는 // 포함 시 double encode 필요
    const encodedUuid = encodeURIComponent(encodeURIComponent(meetingUuid));

    const response = await fetch(
        `${ZOOM_API_BASE}/past_meetings/${encodedUuid}/participants`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        // 무료 계정은 참석자 조회 불가
        if (response.status === 403) {
            return [];
        }
        throw new Error(`Zoom participants API error: ${response.status}`);
    }

    const data = await response.json();
    return data.participants || [];
}

// Zoom 미팅을 Chalk 세션으로 변환
export interface ChalkSession {
    studentName: string;
    date: string;
    time: string;
    duration: number;
    topic: string;
    source: 'zoom';
    verified: boolean;
    externalId: string;
}

export async function meetingsToChalkSessions(
    accessToken: string,
    meetings: ZoomMeeting[]
): Promise<ChalkSession[]> {
    const sessions: ChalkSession[] = [];

    for (const meeting of meetings) {
        const participants = await getMeetingParticipants(accessToken, meeting.uuid);

        // 호스트 외 첫 번째 참석자를 학생으로
        const student = participants.find(p =>
            !p.name.toLowerCase().includes('host')
        );

        const startDate = new Date(meeting.start_time);

        sessions.push({
            studentName: student?.name || 'Unknown Student',
            date: startDate.toISOString().split('T')[0],
            time: startDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }),
            duration: meeting.duration,
            topic: meeting.topic,
            source: 'zoom',
            verified: true,
            externalId: meeting.uuid,
        });
    }

    return sessions;
}

// Zoom 통계 계산
export interface ZoomStats {
    totalMeetings: number;
    totalHours: number;
    avgDuration: number;
    uniqueStudents: number;
    weeklyAverage: number;
}

export function calculateZoomStats(
    meetings: ZoomMeeting[],
    participants: Map<string, ZoomParticipant[]>
): ZoomStats {
    const totalMinutes = meetings.reduce((sum, m) => sum + m.duration, 0);
    const studentNames = new Set<string>();

    participants.forEach((pList) => {
        pList.forEach(p => {
            if (!p.name.toLowerCase().includes('host')) {
                studentNames.add(p.name.toLowerCase());
            }
        });
    });

    const weeks = 4;

    return {
        totalMeetings: meetings.length,
        totalHours: Math.round(totalMinutes / 60),
        avgDuration: meetings.length > 0 ? Math.round(totalMinutes / meetings.length) : 0,
        uniqueStudents: studentNames.size,
        weeklyAverage: Math.round(meetings.length / weeks),
    };
}
