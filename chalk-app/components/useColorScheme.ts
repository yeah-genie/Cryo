// 다크모드 강제 적용 - Linear 스타일
import { FORCE_DARK_MODE } from '@/constants/Colors';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
    const systemScheme = useRNColorScheme();

    // 다크모드 강제
    if (FORCE_DARK_MODE) {
        return 'dark';
    }

    return systemScheme ?? 'dark';
}
