// Supabase Edge Function for Stripe Connect OAuth
// Deploy: supabase functions deploy stripe-auth

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const STRIPE_CLIENT_ID = Deno.env.get('STRIPE_CLIENT_ID') || ''
const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') || ''
const APP_REDIRECT_URI = 'chalkapp://auth/stripe/callback'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()

    // Step 1: Redirect to Stripe Connect OAuth
    if (path === 'authorize') {
        const redirectUri = `${url.origin}/functions/v1/stripe-auth/callback`
        const stripeAuthUrl = new URL('https://connect.stripe.com/oauth/authorize')
        stripeAuthUrl.searchParams.set('response_type', 'code')
        stripeAuthUrl.searchParams.set('client_id', STRIPE_CLIENT_ID)
        stripeAuthUrl.searchParams.set('scope', 'read_only')
        stripeAuthUrl.searchParams.set('redirect_uri', redirectUri)

        return Response.redirect(stripeAuthUrl.toString(), 302)
    }

    // Step 2: Handle callback from Stripe
    if (path === 'callback') {
        const code = url.searchParams.get('code')
        const error = url.searchParams.get('error')

        if (error) {
            return Response.redirect(`${APP_REDIRECT_URI}?error=${error}`, 302)
        }

        if (!code) {
            return Response.redirect(`${APP_REDIRECT_URI}?error=no_code`, 302)
        }

        try {
            // Exchange code for tokens
            const tokenResponse = await fetch('https://connect.stripe.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_secret: STRIPE_SECRET_KEY,
                    code,
                    grant_type: 'authorization_code',
                }),
            })

            const tokenData = await tokenResponse.json()

            if (tokenData.access_token) {
                // Redirect to app with tokens
                const appUrl = new URL(APP_REDIRECT_URI)
                appUrl.searchParams.set('access_token', tokenData.access_token)
                appUrl.searchParams.set('stripe_user_id', tokenData.stripe_user_id || '')
                appUrl.searchParams.set('refresh_token', tokenData.refresh_token || '')

                return Response.redirect(appUrl.toString(), 302)
            } else {
                return Response.redirect(`${APP_REDIRECT_URI}?error=token_failed`, 302)
            }
        } catch (error) {
            console.error('Stripe OAuth error:', error)
            return Response.redirect(`${APP_REDIRECT_URI}?error=server_error`, 302)
        }
    }

    return new Response('Not Found', { status: 404 })
})
