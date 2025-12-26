'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
        >
            로그아웃
        </button>
    );
}
