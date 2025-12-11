import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const GEMINI_API_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY") || "";

console.log("Discord Freeze Bot v2 - Slash Commands");

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Check if text is a valid idea
async function isValidIdea(text: string): Promise<boolean> {
    if (text.length < 8 || !GEMINI_API_KEY) return text.length >= 8;
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Is this an ACTIONABLE PRODUCT/BUSINESS IDEA? yes/no. Message: "${text}"` }] }]
                })
            }
        );
        const data = await res.json();
        return (data.candidates?.[0]?.content?.parts?.[0]?.text?.toLowerCase() || "").includes("yes");
    } catch { return true; }
}

// Translate using Gemini
async function translate(text: string, userLang: string): Promise<string> {
    if (!GEMINI_API_KEY || userLang === "en") return text;
    try {
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Translate to ${userLang}: "${text}". Return ONLY the translation.` }] }]
                })
            }
        );
        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || text;
    } catch { return text; }
}

serve(async (req) => {
    try {
        const body = await req.text();
        const payload = JSON.parse(body);

        // Discord PING (verification)
        if (payload.type === 1) {
            return new Response(JSON.stringify({ type: 1 }), {
                headers: { "Content-Type": "application/json" }
            });
        }

        // Slash Command (type 2)
        if (payload.type === 2) {
            const command = payload.data.name;
            const options = payload.data.options || [];
            const userId = payload.member?.user?.id || payload.user?.id;
            const userLang = payload.locale?.substring(0, 2) || "en";

            // /freeze [idea]
            if (command === "freeze") {
                const ideaText = options.find((o: any) => o.name === "idea")?.value || "";

                if (!ideaText) {
                    return jsonResponse({ type: 4, data: { content: await translate("Please provide an idea text!", userLang) } });
                }

                const isIdea = await isValidIdea(ideaText);
                if (!isIdea) {
                    return jsonResponse({ type: 4, data: { content: await translate("🤔 This doesn't look like an idea.", userLang) } });
                }

                const { data: idea } = await supabase.from("ideas").insert({
                    title: ideaText.length > 100 ? ideaText.substring(0, 100) + "..." : ideaText,
                    description: ideaText,
                    status: "Frozen",
                    priority: "Medium",
                    category: "Feature",
                    is_zombie: true,
                    zombie_reason: "Frozen via Discord",
                    discord_user_id: userId,
                    votes: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }).select().single();

                const msg = await translate("🧊 Frozen!", userLang);
                return jsonResponse({
                    type: 4,
                    data: { content: `${msg} https://cryo-dun.vercel.app/ideas/${idea?.idea_id}` }
                });
            }

            // /thaw [id]
            if (command === "thaw") {
                const ideaId = options.find((o: any) => o.name === "id")?.value || "";

                const { data: idea } = await supabase
                    .from("ideas")
                    .select()
                    .eq("idea_id", ideaId)
                    .single();

                if (!idea) {
                    return jsonResponse({ type: 4, data: { content: await translate("No idea found with that ID.", userLang) } });
                }

                if (!idea.is_zombie) {
                    return jsonResponse({ type: 4, data: { content: await translate("Already active.", userLang) } });
                }

                await supabase.from("ideas").update({
                    is_zombie: false,
                    status: "Active",
                    zombie_reason: null,
                    updated_at: new Date().toISOString()
                }).eq("idea_id", ideaId);

                const msg = await translate("🔥 Thawed! Time to review.", userLang);
                return jsonResponse({
                    type: 4,
                    data: { content: `${msg} https://cryo-dun.vercel.app/ideas/${idea.idea_id}` }
                });
            }

            // /vote [id]
            if (command === "vote") {
                const ideaId = options.find((o: any) => o.name === "id")?.value || "";

                const { data: idea } = await supabase
                    .from("ideas")
                    .select()
                    .eq("idea_id", ideaId)
                    .single();

                if (!idea) {
                    return jsonResponse({ type: 4, data: { content: await translate("No idea found with that ID.", userLang) } });
                }

                await supabase.from("ideas").update({
                    votes: (idea.votes || 0) + 1,
                    updated_at: new Date().toISOString()
                }).eq("idea_id", ideaId);

                const msg = await translate("👍 Voted!", userLang);
                return jsonResponse({
                    type: 4,
                    data: { content: `${msg} (${(idea.votes || 0) + 1})` }
                });
            }

            // /list
            if (command === "list") {
                const { data: ideas } = await supabase
                    .from("ideas")
                    .select()
                    .eq("is_zombie", true)
                    .order("created_at", { ascending: false })
                    .limit(5);

                if (!ideas || ideas.length === 0) {
                    return jsonResponse({ type: 4, data: { content: await translate("No frozen ideas.", userLang) } });
                }

                let list = await translate("❄️ Frozen Ideas:", userLang) + "\n";
                ideas.forEach((idea, i) => {
                    list += `${i + 1}. **${idea.title}** (👍 ${idea.votes || 0})\n   ID: \`${idea.idea_id}\`\n`;
                });

                return jsonResponse({ type: 4, data: { content: list } });
            }

            // Unknown command
            return jsonResponse({ type: 4, data: { content: "Unknown command" } });
        }

        return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "Internal error" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
});

function jsonResponse(data: object) {
    return new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json" }
    });
}
