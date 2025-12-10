
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY")!;
const SLACK_SIGNING_SECRET = Deno.env.get("SLACK_SIGNING_SECRET")!;

console.log("Slack Listener Function Started");

serve(async (req) => {
    try {
        const body = await req.text();

        // 1. Verify Slack Request (Simplified for MVP, ideally use crypto to verify signature)
        // In production, you MUST verify X-Slack-Signature.

        const { type, event, challenge } = JSON.parse(body);

        // Handle Slack URL Verification Challenge
        if (type === "url_verification") {
            return new Response(JSON.stringify({ challenge }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        // Handle Event Callback (Message posted)
        if (type === "event_callback" && event.type === "message" && !event.bot_id) {
            const text = event.text;
            const user = event.user;
            const channel = event.channel;

            console.log(`Received message from ${user} in ${channel}: ${text}`);

            // 2. Call Gemini 2.0 Flash API
            const geminiResponse = await callGeminiAPI(text);
            if (!geminiResponse) {
                throw new Error("Failed to get response from Gemini");
            }

            console.log("Gemini Analysis:", geminiResponse);

            // 3. Save to Supabase DB
            const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

            const { data, error } = await supabase
                .from("decisions")
                .insert({
                    source_type: "slack",
                    source_link: `https://slack.com/archives/${channel}/p${event.ts.replace(".", "")}`, // Construct deep link
                    content: text,
                    problem: geminiResponse.problem,
                    decision: geminiResponse.decision,
                    reason: geminiResponse.reason,
                    ai_summary: true,
                    raw_metadata: event
                })
                .select();

            if (error) {
                console.error("Supabase Insert Error:", error);
                throw error;
            }

            // 4. (Optional) Reply to Slack confirmed
            // You would use chat.postMessage here if you had the token setup.
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});

async function callGeminiAPI(text: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
    You are a Decision Extractor for a startup.
    Analyze the following Slack message and extract:
    1. Problem: What is the issue being discussed?
    2. Decision: What was decided? (or what is the proposed idea?)
    3. Reason: Why was this decided?

    Return ONLY a JSON object with keys: "problem", "decision", "reason".
    If no clear decision is found, summarize the idea as the "decision".
    
    Message: "${text}"
  `;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await response.json();

    try {
        // Parse Gemini response which might be wrapped in markdown code blocks
        const rawText = data.candidates[0].content.parts[0].text;
        const jsonText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse Gemini output:", data);
        return { problem: "Parsing Error", decision: text, reason: "AI Failed to parse" };
    }
}
