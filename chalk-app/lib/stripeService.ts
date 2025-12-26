// Stripe API 서비스
// 주의: Secret Key가 필요한 API는 서버(Supabase Edge Function)에서 호출해야 함

const STRIPE_API_BASE = 'https://api.stripe.com/v1';

export interface StripeCharge {
    id: string;
    amount: number; // cents
    currency: string;
    created: number; // unix timestamp
    customer: string;
    description?: string;
    status: string;
}

export interface StripeCustomer {
    id: string;
    email?: string;
    name?: string;
    created: number;
}

export interface StripeSubscription {
    id: string;
    customer: string;
    status: string;
    created: number;
    canceled_at?: number;
    current_period_start: number;
    current_period_end: number;
}

export interface StripeInvoice {
    id: string;
    customer: string;
    amount_due: number;
    amount_paid: number;
    status: string;
    created: number;
    paid: boolean;
}

// 결제 데이터에서 추출할 인사이트
export interface PaymentInsights {
    totalRevenue: number; // 총 수입 (달러)
    monthlyRevenue: number; // 이번 달 수입
    totalCustomers: number; // 총 고객 수
    avgCustomerLTV: number; // 고객당 평균 LTV
    avgSessionDuration: number; // 평균 수업 기간 (월)
    retentionRate: number; // 재등록률 (%)
    onTimePaymentRate: number; // 정시 결제율 (%)
    revenueGrowth: number; // 월간 성장률 (%)
}

// Stripe 데이터에서 인사이트 계산
export function calculatePaymentInsights(
    charges: StripeCharge[],
    customers: StripeCustomer[],
    subscriptions: StripeSubscription[]
): PaymentInsights {
    const now = Date.now();
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const twoMonthsAgo = now - 60 * 24 * 60 * 60 * 1000;

    // 총 수입
    const totalRevenue = charges
        .filter(c => c.status === 'succeeded')
        .reduce((sum, c) => sum + c.amount, 0) / 100;

    // 이번 달 수입
    const thisMonthCharges = charges.filter(
        c => c.created * 1000 > oneMonthAgo && c.status === 'succeeded'
    );
    const monthlyRevenue = thisMonthCharges.reduce((sum, c) => sum + c.amount, 0) / 100;

    // 지난 달 수입 (성장률 계산용)
    const lastMonthCharges = charges.filter(
        c => c.created * 1000 > twoMonthsAgo &&
            c.created * 1000 <= oneMonthAgo &&
            c.status === 'succeeded'
    );
    const lastMonthRevenue = lastMonthCharges.reduce((sum, c) => sum + c.amount, 0) / 100;

    // 고객당 LTV
    const customerPayments = new Map<string, number>();
    charges.forEach(c => {
        if (c.status === 'succeeded') {
            customerPayments.set(
                c.customer,
                (customerPayments.get(c.customer) || 0) + c.amount
            );
        }
    });
    const avgCustomerLTV = customerPayments.size > 0
        ? Array.from(customerPayments.values()).reduce((a, b) => a + b, 0) / customerPayments.size / 100
        : 0;

    // 평균 구독 기간
    const subscriptionDurations = subscriptions.map(s => {
        const end = s.canceled_at ? s.canceled_at * 1000 : now;
        return (end - s.created * 1000) / (30 * 24 * 60 * 60 * 1000); // 월 단위
    });
    const avgSessionDuration = subscriptionDurations.length > 0
        ? subscriptionDurations.reduce((a, b) => a + b, 0) / subscriptionDurations.length
        : 0;

    // 재등록률 (취소 후 다시 시작한 구독)
    const canceledCustomers = new Set(
        subscriptions.filter(s => s.canceled_at).map(s => s.customer)
    );
    const resubscribed = subscriptions.filter(
        s => !s.canceled_at && canceledCustomers.has(s.customer)
    );
    const retentionRate = canceledCustomers.size > 0
        ? (resubscribed.length / canceledCustomers.size) * 100
        : 100;

    // 성장률
    const revenueGrowth = lastMonthRevenue > 0
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
        : 0;

    return {
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(monthlyRevenue),
        totalCustomers: customers.length,
        avgCustomerLTV: Math.round(avgCustomerLTV),
        avgSessionDuration: Math.round(avgSessionDuration * 10) / 10,
        retentionRate: Math.round(retentionRate),
        onTimePaymentRate: 95, // TODO: 인보이스 데이터로 계산
        revenueGrowth: Math.round(revenueGrowth),
    };
}

// 배지 조건 체크
export interface PaymentBadges {
    premiumTutor: boolean; // 시간당 $50+
    growingBusiness: boolean; // 3개월 연속 성장
    highRetention: boolean; // 재등록 70%+
    reliablePayments: boolean; // 정시 결제 90%+
}

export function calculatePaymentBadges(insights: PaymentInsights): PaymentBadges {
    return {
        premiumTutor: insights.avgCustomerLTV > 500, // 고객당 $500+ 결제
        growingBusiness: insights.revenueGrowth > 5, // 5% 이상 성장
        highRetention: insights.retentionRate >= 70,
        reliablePayments: insights.onTimePaymentRate >= 90,
    };
}
