import { GoogleTokens } from './useGoogleAuth';

const CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';

export interface CalendarEvent {
    id: string;
    summary: string;
    description?: string;
    start: { dateTime: string; timeZone: string };
    end: { dateTime: string; timeZone: string };
    attendees?: { email: string; displayName?: string; responseStatus: string }[];
    conferenceData?: {
        conferenceSolution?: { name: string };
        entryPoints?: { uri: string; entryPointType: string }[];
    };
    status: string;
    recurrence?: string[];
}

export interface CalendarEventsResponse {
    items: CalendarEvent[];
    nextPageToken?: string;
}

// Google Calendar에서 최근 이벤트 가져오기
export async function getCalendarEvents(
    accessToken: string,
    days: number = 30
): Promise<CalendarEvent[]> {
    const now = new Date();
    const past = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const params = new URLSearchParams({
        timeMin: past.toISOString(),
        timeMax: now.toISOString(),
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '100',
    });

    const response = await fetch(
        `${CALENDAR_API_BASE}/calendars/primary/events?${params}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Calendar API error: ${response.status}`);
    }

    const data: CalendarEventsResponse = await response.json();
    return data.items || [];
}

// Google Meet 이벤트만 필터링
export function filterMeetEvents(events: CalendarEvent[]): CalendarEvent[] {
    return events.filter(event =>
        event.conferenceData?.conferenceSolution?.name === 'Google Meet' ||
        event.conferenceData?.entryPoints?.some(ep => ep.uri?.includes('meet.google.com'))
    );
}

// 캘린더 이벤트를 Chalk 스케줄로 변환
export interface ChalkSchedule {
    studentName: string;
    studentEmail: string;
    day: number; // 0-6
    time: string; // HH:MM
    duration: number; // minutes
    recurring: boolean;
    source: 'google_calendar';
    externalId: string;
}

export function eventToChalkSchedule(event: CalendarEvent): ChalkSchedule | null {
    // 참석자가 없으면 스킵
    if (!event.attendees || event.attendees.length === 0) {
        return null;
    }

    // 첫 번째 외부 참석자를 학생으로 간주
    const student = event.attendees.find(a =>
        a.responseStatus !== 'declined' &&
        !a.email.includes('calendar.google.com')
    );

    if (!student) return null;

    const start = new Date(event.start.dateTime);
    const end = new Date(event.end.dateTime);
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);

    return {
        studentName: student.displayName || student.email.split('@')[0],
        studentEmail: student.email,
        day: start.getDay(),
        time: start.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }),
        duration,
        recurring: !!event.recurrence,
        source: 'google_calendar',
        externalId: event.id,
    };
}

// 캘린더 통계 계산
export interface CalendarStats {
    totalSessions: number;
    totalHours: number;
    uniqueStudents: number;
    avgSessionDuration: number;
    weeklyAverage: number;
    cancelledRate: number;
    meetSessions: number;
}

export function calculateCalendarStats(events: CalendarEvent[]): CalendarStats {
    const meetEvents = filterMeetEvents(events);
    const cancelled = events.filter(e => e.status === 'cancelled').length;

    // 세션 시간 계산
    let totalMinutes = 0;
    const studentEmails = new Set<string>();

    for (const event of events.filter(e => e.status !== 'cancelled')) {
        const start = new Date(event.start.dateTime);
        const end = new Date(event.end.dateTime);
        totalMinutes += (end.getTime() - start.getTime()) / 60000;

        event.attendees?.forEach(a => {
            if (!a.email.includes('calendar.google.com')) {
                studentEmails.add(a.email);
            }
        });
    }

    const validEvents = events.filter(e => e.status !== 'cancelled');
    const weeks = 4; // 약 1달

    return {
        totalSessions: validEvents.length,
        totalHours: Math.round(totalMinutes / 60),
        uniqueStudents: studentEmails.size,
        avgSessionDuration: validEvents.length > 0
            ? Math.round(totalMinutes / validEvents.length)
            : 0,
        weeklyAverage: Math.round(validEvents.length / weeks),
        cancelledRate: events.length > 0
            ? Math.round((cancelled / events.length) * 100)
            : 0,
        meetSessions: meetEvents.length,
    };
}
