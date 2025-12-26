// Supabase Edge Function for Zoom OAuth
// Deploy: supabase functions deploy zoom-auth

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const ZOOM_CLIENT_ID = Deno.env.get('ZOOM_CLIENT_ID') || ''
const ZOOM_CLIENT_SECRET = Deno.env.get('ZOOM_CLIENT_SECRET') || ''
const APP_REDIRECT_URI = 'chalkapp://auth/zoom/callback'

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

    // Step 1: Redirect to Zoom OAuth
    if (path === 'authorize') {
        const redirectUri = `${url.origin}/functions/v1/zoom-auth/callback`
        const zoomAuthUrl = new URL('https://zoom.us/oauth/authorize')
        zoomAuthUrl.searchParams.set('response_type', 'code')
        zoomAuthUrl.searchParams.set('client_id', ZOOM_CLIENT_ID)
        zoomAuthUrl.searchParams.set('redirect_uri', redirectUri)

        return Response.redirect(zoomAuthUrl.toString(), 302)
    }

    // Step 2: Handle callback from Zoom
    if (path === 'callback') {
        const code = url.searchParams.get('code')

        if (!code) {
            return Response.redirect(`${APP_REDIRECT_URI}?error=no_code`, 302)
        }

        try {
            // Exchange code for tokens
            const redirectUri = `${url.origin}/functions/v1/zoom-auth/callback`
            const tokenResponse = await fetch('https://zoom.us/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code,
                    redirect_uri: redirectUri,
                }),
            })

            const tokenData = await tokenResponse.json()

            if (tokenData.access_token) {
                // Redirect to app with tokens
                const appUrl = new URL(APP_REDIRECT_URI)
                appUrl.searchParams.set('access_token', tokenData.access_token)
                appUrl.searchParams.set('refresh_token', tokenData.refresh_token || '')
                appUrl.searchParams.set('expires_in', tokenData.expires_in?.toString() || '3600')

                return Response.redirect(appUrl.toString(), 302)
            } else {
                return Response.redirect(`${APP_REDIRECT_URI}?error=token_failed`, 302)
            }
        } catch (error) {
            console.error('Zoom OAuth error:', error)
            return Response.redirect(`${APP_REDIRECT_URI}?error=server_error`, 302)
        }
    }

    // Step 3: Refresh token endpoint
    if (path === 'refresh' && req.method === 'POST') {
        try {
            const { refresh_token } = await req.json()

            const tokenResponse = await fetch('https://zoom.us/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`)}`,
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token,
                }),
            })

            const tokenData = await tokenResponse.json()

            return new Response(JSON.stringify(tokenData), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        } catch (error) {
            return new Response(JSON.stringify({ error: 'refresh_failed' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }
    }

    return new Response('Not Found', { status: 404 })
})
