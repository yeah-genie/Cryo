'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const SUBJECTS = ['수학', '영어', '국어', '과학', '사회', '한국사', '제2외국어', '기타'];

export default function OnboardingPage() {
    const [name, setName] = useState('');
    const [school, setSchool] = useState('');
    const [subject, setSubject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setError('로그인이 필요합니다.');
            setLoading(false);
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({
                name,
                school,
                subject,
                updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-emerald-500/10 to-transparent rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-sm relative">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">👋</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">프로필 설정</h1>
                    <p className="text-zinc-500 text-sm mt-2">공개 프로필에 표시될 정보입니다</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">이름</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="김민준"
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">학교</label>
                        <input
                            type="text"
                            value={school}
                            onChange={(e) => setSchool(e.target.value)}
                            placeholder="서울대학교 수학교육과"
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-zinc-400 mb-2">주요 과목</label>
                        <div className="flex flex-wrap gap-2">
                            {SUBJECTS.map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSubject(s)}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${subject === s
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !name || !school || !subject}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-6"
                    >
                        {loading ? '저장 중...' : '시작하기'}
                    </button>
                </form>
            </div>
        </div>
    );
}
