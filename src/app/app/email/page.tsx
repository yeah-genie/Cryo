"use client";

import { useState } from "react";
import { motion } from "framer-motion";

// Email preview types
type EmailType = "weekly" | "result" | "deploy";

const emails = {
  weekly: {
    subject: "🧪 Your weekly experiment report",
    preview: "3 experiments completed • 2 wins • 1 insight",
    date: "Monday, Dec 16, 2024",
    content: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #e4e4e7;">
        <div style="padding: 32px 24px; background: linear-gradient(180deg, #1e1e22 0%, #0a0a0c 100%); border-radius: 12px 12px 0 0;">
          <div style="font-size: 24px; font-weight: 600; color: white; margin-bottom: 8px;">
            Weekly Report
          </div>
          <div style="font-size: 14px; color: #71717a;">
            Dec 9 - Dec 15, 2024
          </div>
        </div>
        
        <div style="padding: 24px; background: #18181b; border: 1px solid #27272a; border-top: none;">
          <div style="font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
            This Week's Experiments
          </div>
          
          <div style="space-y: 12px;">
            <div style="display: flex; justify-content: space-between; padding: 16px; background: #0f0f11; border-radius: 8px; margin-bottom: 8px;">
              <div>
                <div style="color: white; font-weight: 500; margin-bottom: 4px;">Checkout redesign</div>
                <div style="font-size: 12px; color: #71717a;">checkout.tsx • 3 days ago</div>
              </div>
              <div style="text-align: right;">
                <div style="color: #34d399; font-weight: 600; font-size: 18px;">+50%</div>
                <div style="font-size: 12px; color: #71717a;">conversion</div>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 16px; background: #0f0f11; border-radius: 8px; margin-bottom: 8px;">
              <div>
                <div style="color: white; font-weight: 500; margin-bottom: 4px;">New pricing page</div>
                <div style="font-size: 12px; color: #71717a;">pricing.tsx • 5 days ago</div>
              </div>
              <div style="text-align: right;">
                <div style="color: #34d399; font-weight: 600; font-size: 18px;">+33%</div>
                <div style="font-size: 12px; color: #71717a;">signups</div>
              </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; padding: 16px; background: #0f0f11; border-radius: 8px;">
              <div>
                <div style="color: white; font-weight: 500; margin-bottom: 4px;">CTA button color</div>
                <div style="font-size: 12px; color: #71717a;">button.tsx • 6 days ago</div>
              </div>
              <div style="text-align: right;">
                <div style="color: #71717a; font-weight: 600; font-size: 18px;">0%</div>
                <div style="font-size: 12px; color: #71717a;">no change</div>
              </div>
            </div>
          </div>
        </div>
        
        <div style="padding: 20px 24px; background: #1e3a5f15; border: 1px solid #3b82f620; border-top: none;">
          <div style="font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
            Pattern Detected
          </div>
          <div style="color: #60a5fa; font-size: 14px;">
            💡 UX flow changes consistently outperform visual tweaks. Consider focusing on user journey improvements.
          </div>
        </div>
        
        <div style="padding: 24px; background: #18181b; border: 1px solid #27272a; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="font-size: 12px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
            Recommended Next Experiments
          </div>
          
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <span style="padding: 8px 12px; background: #27272a; border-radius: 6px; font-size: 13px; color: #a1a1aa;">
              Simplify signup form
            </span>
            <span style="padding: 8px 12px; background: #27272a; border-radius: 6px; font-size: 13px; color: #a1a1aa;">
              Add testimonials
            </span>
            <span style="padding: 8px 12px; background: #27272a; border-radius: 6px; font-size: 13px; color: #a1a1aa;">
              Reduce checkout steps
            </span>
          </div>
        </div>
        
        <div style="text-align: center; padding: 24px; color: #52525b; font-size: 12px;">
          <a href="#" style="color: #3b82f6; text-decoration: none;">View in dashboard</a> • <a href="#" style="color: #52525b; text-decoration: none;">Unsubscribe</a>
        </div>
      </div>
    `,
  },
  result: {
    subject: "✅ Experiment result: Checkout redesign",
    preview: "+50% conversion rate • Statistically significant",
    date: "Today, 2:34 PM",
    content: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #e4e4e7;">
        <div style="padding: 32px 24px; background: linear-gradient(180deg, #064e3b 0%, #0a0a0c 100%); border-radius: 12px 12px 0 0;">
          <div style="display: inline-block; padding: 4px 10px; background: #34d39920; border-radius: 4px; font-size: 12px; color: #34d399; margin-bottom: 12px;">
            SUCCESS
          </div>
          <div style="font-size: 24px; font-weight: 600; color: white; margin-bottom: 8px;">
            Checkout redesign worked!
          </div>
          <div style="font-size: 14px; color: #71717a;">
            Your experiment reached statistical significance
          </div>
        </div>
        
        <div style="padding: 24px; background: #18181b; border: 1px solid #27272a; border-top: none;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div style="padding: 16px; background: #0f0f11; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #71717a; margin-bottom: 4px;">Before</div>
              <div style="font-size: 24px; font-weight: 600; color: white;">12%</div>
            </div>
            <div style="padding: 16px; background: #0f0f11; border-radius: 8px; text-align: center;">
              <div style="font-size: 12px; color: #71717a; margin-bottom: 4px;">After</div>
              <div style="font-size: 24px; font-weight: 600; color: #34d399;">18%</div>
            </div>
          </div>
          
          <div style="padding: 16px; background: #0f0f11; border-radius: 8px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #71717a; font-size: 13px;">Change</span>
              <span style="color: #34d399; font-weight: 600;">+50%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="color: #71717a; font-size: 13px;">Confidence</span>
              <span style="color: white;">98%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #71717a; font-size: 13px;">Sample size</span>
              <span style="color: white;">2,341 users</span>
            </div>
          </div>
        </div>
        
        <div style="padding: 20px 24px; background: #18181b; border: 1px solid #27272a; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="font-size: 14px; color: #a1a1aa; line-height: 1.6;">
            <strong style="color: white;">What changed:</strong> checkout.tsx, payment-form.tsx<br/>
            <strong style="color: white;">Deployed:</strong> Dec 12, 2024 at 3:45 PM
          </div>
        </div>
        
        <div style="text-align: center; padding: 24px; color: #52525b; font-size: 12px;">
          <a href="#" style="color: #3b82f6; text-decoration: none;">View details</a> • <a href="#" style="color: #52525b; text-decoration: none;">Mute this experiment</a>
        </div>
      </div>
    `,
  },
  deploy: {
    subject: "🚀 Deploy detected: pricing.tsx",
    preview: "New experiment started • Tracking conversion rate",
    date: "Today, 11:22 AM",
    content: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; color: #e4e4e7;">
        <div style="padding: 32px 24px; background: linear-gradient(180deg, #1e3a8a 0%, #0a0a0c 100%); border-radius: 12px 12px 0 0;">
          <div style="display: inline-block; padding: 4px 10px; background: #3b82f620; border-radius: 4px; font-size: 12px; color: #60a5fa; margin-bottom: 12px;">
            TRACKING
          </div>
          <div style="font-size: 24px; font-weight: 600; color: white; margin-bottom: 8px;">
            New deploy detected
          </div>
          <div style="font-size: 14px; color: #71717a;">
            I started tracking this as an experiment
          </div>
        </div>
        
        <div style="padding: 24px; background: #18181b; border: 1px solid #27272a; border-top: none;">
          <div style="padding: 16px; background: #0f0f11; border-radius: 8px; margin-bottom: 16px;">
            <div style="font-size: 12px; color: #71717a; margin-bottom: 8px;">Files changed</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <code style="padding: 4px 8px; background: #27272a; border-radius: 4px; font-size: 12px; color: #a1a1aa;">pricing.tsx</code>
              <code style="padding: 4px 8px; background: #27272a; border-radius: 4px; font-size: 12px; color: #a1a1aa;">pricing.module.css</code>
            </div>
          </div>
          
          <div style="padding: 16px; background: #0f0f11; border-radius: 8px;">
            <div style="font-size: 12px; color: #71717a; margin-bottom: 8px;">Auto-generated hypothesis</div>
            <div style="color: #60a5fa; font-size: 14px; font-style: italic;">
              "Pricing page update → Higher signup conversion"
            </div>
          </div>
        </div>
        
        <div style="padding: 20px 24px; background: #18181b; border: 1px solid #27272a; border-top: none;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #71717a; font-size: 13px;">Tracking metric</span>
            <span style="color: white;">Conversion rate</span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #71717a; font-size: 13px;">Current baseline</span>
            <span style="color: white;">2.1%</span>
          </div>
        </div>
        
        <div style="padding: 20px 24px; background: #fef3c720; border: 1px solid #fbbf2420; border-top: none; border-radius: 0 0 12px 12px;">
          <div style="color: #fbbf24; font-size: 13px;">
            ⏳ Results expected in 3-5 days based on your traffic
          </div>
        </div>
        
        <div style="text-align: center; padding: 24px; color: #52525b; font-size: 12px;">
          <a href="#" style="color: #3b82f6; text-decoration: none;">Edit hypothesis</a> • <a href="#" style="color: #52525b; text-decoration: none;">Ignore this change</a>
        </div>
      </div>
    `,
  },
};

export default function EmailPreview() {
  const [selectedEmail, setSelectedEmail] = useState<EmailType>("weekly");

  return (
    <div className="h-screen flex bg-[#0a0a0c]">
      {/* Email List Sidebar */}
      <div className="w-80 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-white font-semibold mb-1">Email Reports</h2>
          <p className="text-xs text-zinc-500">Preview what you'll receive</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {(Object.keys(emails) as EmailType[]).map((type) => {
            const email = emails[type];
            return (
              <button
                key={type}
                onClick={() => setSelectedEmail(type)}
                className={`w-full text-left p-4 border-b border-zinc-800/50 transition-colors ${
                  selectedEmail === type 
                    ? "bg-blue-500/10 border-l-2 border-l-blue-500" 
                    : "hover:bg-zinc-900/50"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium text-white truncate flex-1 mr-2">
                    {email.subject}
                  </span>
                  <span className="text-xs text-zinc-600 flex-shrink-0">
                    {email.date.split(",")[0]}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 truncate">
                  {email.preview}
                </p>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-600 text-center">
            These are example emails. Real emails will contain your actual data.
          </p>
        </div>
      </div>

      {/* Email Preview */}
      <div className="flex-1 flex flex-col">
        {/* Email Header */}
        <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white">Briefix</div>
                <div className="text-xs text-zinc-500">hello@briefix.app</div>
              </div>
            </div>
            <div className="text-xs text-zinc-500">{emails[selectedEmail].date}</div>
          </div>
          <div className="text-base font-medium text-white">
            {emails[selectedEmail].subject}
          </div>
        </div>

        {/* Email Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0f0f11]">
          <motion.div
            key={selectedEmail}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto"
            dangerouslySetInnerHTML={{ __html: emails[selectedEmail].content }}
          />
        </div>
      </div>
    </div>
  );
}

