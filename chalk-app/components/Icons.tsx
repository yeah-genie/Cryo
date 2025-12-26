import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';

interface IconProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
}

// 성취도 레벨 아이콘 (이모지 대신)
export function LevelHighIcon({ size = 24, color = '#34D399' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Path
                d="M8 12L11 15L16 9"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function LevelMidIcon({ size = 24, color = '#60A5FA' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Path
                d="M8 12H16"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </Svg>
    );
}

export function LevelLowIcon({ size = 24, color = '#FBBF24' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
            <Path
                d="M12 8V12M12 16H12.01"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </Svg>
    );
}

export function CalendarIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
            <Path d="M16 2V6M8 2V6M3 10H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <Rect x="7" y="14" width="3" height="3" rx="0.5" fill={color} />
        </Svg>
    );
}

export function TrashIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M3 6H5H21" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6M19 6V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V6H19Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

// 튜터/수업 관련 아이콘
export function BookOpenIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 6.25278V19.2528M12 6.25278C10.8321 5.47686 9.24649 5 7.5 5C5.75351 5 4.16789 5.47686 3 6.25278V19.2528C4.16789 18.4769 5.75351 18 7.5 18C9.24649 18 10.8321 18.4769 12 19.2528M12 6.25278C13.1679 5.47686 14.7535 5 16.5 5C18.2465 5 19.8321 5.47686 21 6.25278V19.2528C19.8321 18.4769 18.2465 18 16.5 18C14.7535 18 13.1679 18.4769 12 19.2528"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function PencilIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M15.232 5.232L18.768 8.768M16.732 3.732C17.2009 3.26309 17.8369 3 18.5 3C19.1631 3 19.7991 3.26309 20.268 3.732C20.7369 4.20091 21 4.83687 21 5.5C21 6.16313 20.7369 6.79909 20.268 7.268L6.5 21.036H3V17.464L16.732 3.732Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function UsersIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M17 20C17 18.3431 14.7614 17 12 17C9.23858 17 7 18.3431 7 20M21 17.0004C21 15.7024 19.7659 14.5914 18 14.1762M3 17.0004C3 15.7024 4.2341 14.5914 6 14.1762M18 10.2361C18.6137 9.68679 19 8.8885 19 8C19 6.34315 17.6569 5 16 5C15.2316 5 14.5308 5.28885 14 5.76389M6 10.2361C5.38625 9.68679 5 8.8885 5 8C5 6.34315 6.34315 5 8 5C8.76835 5 9.46924 5.28885 10 5.76389M12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function ChartIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M3 3V21H21M7 16V13M11 16V9M15 16V12M19 16V7"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function SparklesIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9.813 15.904L9 18.75L8.187 15.904C7.97552 15.1769 7.57691 14.5178 7.03248 13.9911C6.48805 13.4644 5.81715 13.0876 5.083 12.9L2.25 12.087L5.096 11.274C5.82308 11.0625 6.48225 10.6639 7.00893 10.1195C7.53562 9.57503 7.91249 8.90412 8.1 8.17L8.913 5.337L9.726 8.183C9.93748 8.91008 10.3361 9.56925 10.8805 10.0959C11.4249 10.6226 12.0959 10.9995 12.83 11.187L15.663 12L12.817 12.813C12.0899 13.0245 11.4308 13.4231 10.9041 13.9675C10.3774 14.5119 10.0006 15.1829 9.813 15.917V15.904ZM18.259 8.715L18 9.75L17.741 8.715C17.5931 8.13726 17.2853 7.61477 16.8536 7.20704C16.4219 6.79931 15.8838 6.52335 15.3 6.41L14.25 6.151L15.285 5.892C15.8627 5.74411 16.3852 5.43633 16.793 4.99064C17.2007 4.5589 17.4767 4.02081 17.59 3.437L17.849 2.387L18.108 3.422C18.2559 3.99974 18.5637 4.52223 18.9954 4.92996C19.4271 5.33769 19.9652 5.61365 20.549 5.727L21.599 5.986L20.564 6.245C19.9863 6.39289 19.4638 6.70067 19.0561 7.14636C18.6483 7.5781 18.3723 8.11619 18.259 8.7V8.715Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function SendIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M6 12L3 21L21 12L3 3L6 12ZM6 12L12 12"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function CheckCircleIcon({ size = 24, color = '#34D399' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function FireIcon({ size = 24, color = '#F97316' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 22C16.4183 22 20 18.4183 20 14C20 8 12 2 12 2C12 2 4 8 4 14C4 18.4183 7.58172 22 12 22Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M12 22C14.2091 22 16 20.2091 16 18C16 14 12 10 12 10C12 10 8 14 8 18C8 20.2091 9.79086 22 12 22Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function ShareIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M8.59 13.51L15.42 17.49M15.41 6.51L8.59 10.49M21 5C21 6.65685 19.6569 8 18 8C16.3431 8 15 6.65685 15 5C15 3.34315 16.3431 2 18 2C19.6569 2 21 3.34315 21 5ZM9 12C9 13.6569 7.65685 15 6 15C4.34315 15 3 13.6569 3 12C3 10.3431 4.34315 9 6 9C7.65685 9 9 10.3431 9 12ZM21 19C21 20.6569 19.6569 22 18 22C16.3431 22 15 20.6569 15 19C15 17.3431 16.3431 16 18 16C19.6569 16 21 17.3431 21 19Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function PlusIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M12 5V19M5 12H19"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function ChevronRightIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M9 18L15 12L9 6"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

export function XIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path
                d="M18 6L6 18M6 6L18 18"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

// Linear 스타일의 Verified 배지
export function VerifiedBadge({ size = 16 }: { size?: number }) {
    return (
        <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
            <Circle cx="8" cy="8" r="7" fill="#10B981" />
            <Path
                d="M5 8L7 10L11 6"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

// Rating icons (instead of emojis)
export function SmileFaceIcon({ size = 24, color = '#26A65B' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <Path d="M8 14C8.5 15.5 10 17 12 17C14 17 15.5 15.5 16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <Circle cx="9" cy="10" r="1" fill={color} />
            <Circle cx="15" cy="10" r="1" fill={color} />
        </Svg>
    );
}

export function MehFaceIcon({ size = 24, color = '#0091FF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <Path d="M8 15H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <Circle cx="9" cy="10" r="1" fill={color} />
            <Circle cx="15" cy="10" r="1" fill={color} />
        </Svg>
    );
}

export function SadFaceIcon({ size = 24, color = '#F2C94C' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <Path d="M8 16C8.5 14.5 10 13 12 13C14 13 15.5 14.5 16 16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <Circle cx="9" cy="10" r="1" fill={color} />
            <Circle cx="15" cy="10" r="1" fill={color} />
        </Svg>
    );
}

// Struggle type icons
export function CalculatorIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="2" width="16" height="20" rx="2" stroke={color} strokeWidth="1.5" />
            <Path d="M8 6H16M8 10H10M14 10H16M8 14H10M14 14H16M8 18H10M14 18H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
    );
}

export function LightbulbIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M9 21H15M12 3C8.68629 3 6 5.68629 6 9C6 11.2208 7.20683 13.1599 9 14.1973V17H15V14.1973C16.7932 13.1599 18 11.2208 18 9C18 5.68629 15.3137 3 12 3Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function TargetIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <Circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />
            <Circle cx="12" cy="12" r="2" fill={color} />
        </Svg>
    );
}

export function EyeIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5" />
        </Svg>
    );
}

export function RobotIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="6" width="16" height="14" rx="2" stroke={color} strokeWidth="1.5" />
            <Circle cx="9" cy="12" r="1.5" fill={color} />
            <Circle cx="15" cy="12" r="1.5" fill={color} />
            <Path d="M9 16H15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <Path d="M12 6V3M12 3H10M12 3H14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
    );
}

// Dashboard/Stats icons
export function ClockIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <Path d="M12 6V12L16 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function VideoIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Rect x="2" y="5" width="14" height="14" rx="2" stroke={color} strokeWidth="1.5" />
            <Path d="M16 9L22 5V19L16 15" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function ZapIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function SearchIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="1.5" />
            <Path d="M21 21L16.65 16.65" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        </Svg>
    );
}

export function BarChartIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M12 20V10M18 20V4M6 20V14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

export function RefreshIcon({ size = 24, color = '#9CA3AF' }: IconProps) {
    return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
            <Path d="M1 4V10H7M23 20V14H17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14L18.36 18.36A9 9 0 0 1 3.51 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}
