import { useState, useEffect, useCallback } from "react";

const SECTIONS = [
  {
    id: "business", title: "Business & Legal Foundation", shortTitle: "Business", maxPoints: 20,
    questions: [
      { id: "entity", text: "Have you formed a legal business entity (LLC, S-Corp, etc.)?", points: 5, tip: "An LLC separates you from your business, protects personal assets, and legitimizes your brand to labels and sync houses." },
      { id: "ein", text: "Do you have an EIN (Employer Identification Number / Federal Tax ID)?", points: 5, tip: "Required for business bank accounts, tax filing, and signing contracts professionally. Free at IRS.gov — takes 5 minutes." },
      { id: "bizbank", text: "Do you have a business bank account separate from your personal account?", points: 5, tip: "Mixing personal and business funds creates IRS red flags and makes accounting nearly impossible at tax time." },
      { id: "contracts", text: "Do you use written contracts / split sheets for ALL collaborators?", points: 5, tip: "Verbal agreements are unenforceable. One missing split sheet can cost you your masters. Get everything in writing, always." }
    ]
  },
  {
    id: "royalties", title: "Royalty & Publishing Setup", shortTitle: "Royalties", maxPoints: 25,
    questions: [
      { id: "pro", text: "Are you registered with a PRO — ASCAP, BMI, or SESAC?", points: 8, tip: "PROs collect performance royalties every time your music plays on radio, TV, live venues, or streaming. Uncollected royalties disappear after 3 years." },
      { id: "soundexchange", text: "Are you registered with SoundExchange?", points: 7, tip: "SoundExchange collects digital performance royalties from Pandora, SiriusXM, and internet radio — money your PRO DOES NOT collect." },
      { id: "publishing", text: "Do you have your own publishing company or an admin publishing deal?", points: 5, tip: "Without a publishing entity, you only collect the songwriter share. Your own pub company = you collect BOTH the songwriter AND publisher share." },
      { id: "mechanical", text: "Is mechanical royalty collection set up (DistroKid publishing, TuneCore, or Harry Fox)?", points: 5, tip: "Mechanical royalties are owed every time your song is streamed or reproduced. Most independent artists never collect these — leaving significant money behind." }
    ]
  },
  {
    id: "distribution", title: "Distribution & Ownership", shortTitle: "Distribution", maxPoints: 20,
    questions: [
      { id: "distributor", text: "Do you have an active digital distributor (DistroKid, TuneCore, CD Baby, etc.)?", points: 7, tip: "No distributor means no presence on Spotify, Apple Music, or any major DSP. Your music needs to be everywhere fans search." },
      { id: "masters", text: "Do you own or fully control your master recordings?", points: 8, tip: "Masters ownership is the foundation of long-term income. Sync deals, catalog sales, and licensing all flow from owning your masters." },
      { id: "strategy", text: "Do you have a documented release strategy (rollout, promo schedule, timing)?", points: 5, tip: "A structured 6-week release plan consistently outperforms 'drop it and see what happens.' Planning is the difference between a launch and a flop." }
    ]
  },
  {
    id: "financial", title: "Financial Infrastructure", shortTitle: "Finances", maxPoints: 15,
    questions: [
      { id: "accounting", text: "Do you use an accounting system (QuickBooks, Wave, spreadsheet, or CPA)?", points: 5, tip: "If you can't see your income vs. expenses at a glance, you don't have a business — you have an expensive hobby." },
      { id: "tracking", text: "Are you tracking ALL income: streaming, sync, live, merch, brand deals?", points: 5, tip: "Most artists focus only on streaming and miss sync placements, live fees, and brand deals — which often pay 100x more per placement." },
      { id: "rev_streams", text: "Do you have 3 or more active revenue streams beyond just streaming?", points: 5, tip: "Diversified income protects you when one platform changes their algorithm or payout rates — which they do, constantly." }
    ]
  },
  {
    id: "brand", title: "Brand & Digital Presence", shortTitle: "Branding", maxPoints: 10,
    questions: [
      { id: "website", text: "Do you have a professional artist website that you own (not just a Linktree)?", points: 3, tip: "Your website is the only real estate you fully own online. Social platforms can suspend or delete you without notice." },
      { id: "dsp_verified", text: "Are your DSP profiles claimed and verified (Spotify for Artists, Apple Music for Artists)?", points: 3, tip: "Verified profiles unlock playlist pitching, real-time analytics, and instant credibility with A&Rs and music supervisors." },
      { id: "epk", text: "Do you have an updated Electronic Press Kit (EPK)?", points: 2, tip: "Without an EPK, you're turning down press features, sync opportunities, and booking inquiries before they even start." },
      { id: "brand_consistency", text: "Is your visual brand consistent across all platforms (photos, bio, palette)?", points: 2, tip: "Inconsistent branding tells the industry you're not serious — before they even press play on your music." }
    ]
  },
  {
    id: "team", title: "Team & Advisory Structure", shortTitle: "Team", maxPoints: 10,
    questions: [
      { id: "manager", text: "Do you have a manager or a structured management strategy?", points: 3, tip: "A great manager is a force multiplier. Even a clear DIY strategy is better than going with zero direction." },
      { id: "attorney", text: "Do you have an entertainment attorney you can contact?", points: 3, tip: "Never sign ANY contract without an entertainment attorney reviewing it first. This is the single most important rule in the industry." },
      { id: "cpa", text: "Do you have a CPA or accountant familiar with music industry taxes?", points: 2, tip: "A music-industry CPA saves more than they cost and keeps you out of serious IRS trouble down the road." },
      { id: "booking", text: "Do you have a booking agent or a live performance income strategy?", points: 2, tip: "Live performance remains the most reliable income stream for artists. Even a small venue strategy compounds significantly over time." }
    ]
  }
];

const MAX_SCORE = 100;
const ADMIN_PASSWORD = "BACKEND2024";

// ─── ZAPIER WEBHOOK ───────────────────────────────────────────────────────────
// Paste your Zapier webhook URL here after setting it up (see setup guide below)
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/27607784/4y7s211";
// ─────────────────────────────────────────────────────────────────────────────

function calcScore(answers) {
  return SECTIONS.reduce((total, sec) =>
    total + sec.questions.reduce((s, q) => {
      if (answers[q.id] === "yes") return s + q.points;
      if (answers[q.id] === "partial") return s + Math.floor(q.points / 2);
      return s;
    }, 0), 0);
}

function getGradeInfo(score) {
  const pct = Math.round((score / MAX_SCORE) * 100);
  if (pct >= 90) return { grade: "A", pct, color: "#22c55e", label: "Excellent", desc: "Your backend is elite. You're built like a business, not just an artist.", next: "Scale what you have. Focus on sync licensing and catalog management." };
  if (pct >= 80) return { grade: "B", pct, color: "#84cc16", label: "Strong Foundation", desc: "Solid setup with a few gaps. You're ahead of 90% of independent artists.", next: "Close the remaining gaps and optimize your royalty collection systems." };
  if (pct >= 70) return { grade: "C", pct, color: "#eab308", label: "Needs Work", desc: "Some structure in place but significant gaps are costing you real money right now.", next: "Prioritize royalty registration and legal protection immediately." };
  if (pct >= 60) return { grade: "D", pct, color: "#f97316", label: "Below Average", desc: "Structural gaps are actively bleeding money. Immediate action required.", next: "Start with PRO registration and getting a business bank account this week." };
  return { grade: "F", pct, color: "#ef4444", label: "Needs Extreme Rebuild", desc: "Your backend needs a complete overhaul. You're leaving the majority of your potential income uncollected.", next: "Begin with the Business & Legal Foundation section — every other piece depends on it." };
}

function getMissingItems(answers) {
  const missing = [];
  SECTIONS.forEach(sec => {
    sec.questions.forEach(q => {
      if (!answers[q.id] || answers[q.id] === "no") {
        missing.push({ section: sec.shortTitle, question: q.text, tip: q.tip, points: q.points });
      }
    });
  });
  return missing.sort((a, b) => b.points - a.points);
}

async function saveSubmission(data) {
  try {
    const listRaw = localStorage.getItem("audits:list");
    const list = listRaw ? JSON.parse(listRaw) : [];
    const id = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const submission = { id, ...data, savedAt: new Date().toISOString() };
    localStorage.setItem(`audits:${id}`, JSON.stringify(submission));
    list.push(id);
    localStorage.setItem("audits:list", JSON.stringify(list));
    return true;
  } catch (e) {
    console.error("Storage error:", e);
    return false;
  }
}

async function sendToZapier(data) {
  if (!ZAPIER_WEBHOOK_URL || ZAPIER_WEBHOOK_URL === "YOUR_ZAPIER_WEBHOOK_URL_HERE") return;
  const gi = getGradeInfo(data.score);
  const nameParts = (data.info.name || "").trim().split(" ");
  const firstName = nameParts[0] || data.info.stageName || "";
  const lastName = nameParts.slice(1).join(" ") || "";
  const sectionScores = SECTIONS.map(sec => ({
    section: sec.shortTitle,
    earned: sec.questions.reduce((t, q) => {
      if (data.answers[q.id] === "yes") return t + q.points;
      if (data.answers[q.id] === "partial") return t + Math.floor(q.points / 2);
      return t;
    }, 0),
    max: sec.maxPoints
  }));
  const missingItems = getMissingItems(data.answers).slice(0, 5).map(i => i.question);
  const payload = {
    first_name: firstName,
    last_name: lastName,
    email: data.info.email,
    stage_name: data.info.stageName,
    genre: data.info.genre || "",
    artist_type: data.info.type,
    years_active: data.info.yearsActive || "",
    social_handle: data.info.handle || "",
    audit_score: data.score,
    audit_grade: gi.grade,
    audit_label: gi.label,
    audit_percentage: gi.pct,
    business_score: `${sectionScores[0].earned}/${sectionScores[0].max}`,
    royalties_score: `${sectionScores[1].earned}/${sectionScores[1].max}`,
    distribution_score: `${sectionScores[2].earned}/${sectionScores[2].max}`,
    finances_score: `${sectionScores[3].earned}/${sectionScores[3].max}`,
    branding_score: `${sectionScores[4].earned}/${sectionScores[4].max}`,
    team_score: `${sectionScores[5].earned}/${sectionScores[5].max}`,
    top_priority_1: missingItems[0] || "",
    top_priority_2: missingItems[1] || "",
    top_priority_3: missingItems[2] || "",
    submitted_at: new Date().toISOString(),
    source: "Artist Backend Audit — 50 Artists in 5 Days Campaign"
  };
  try {
    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => formData.append(k, String(v)));
    await fetch(ZAPIER_WEBHOOK_URL, {
      method: "POST",
      body: formData
    });
  } catch (e) {
    console.error("Zapier webhook error:", e);
  }
}

async function loadAllSubmissions() {
  try {
    const listRaw = localStorage.getItem("audits:list");
    if (!listRaw) return [];
    const list = JSON.parse(listRaw);
    const subs = [];
    for (const id of list) {
      try {
        const r = localStorage.getItem(`audits:${id}`);
        if (r) subs.push(JSON.parse(r));
      } catch (e) { /* skip corrupted entries */ }
    }
    return subs.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  } catch (e) {
    return [];
  }
}

async function deleteSubmission(id) {
  try {
    const listRaw = localStorage.getItem("audits:list");
    if (!listRaw) return;
    const list = JSON.parse(listRaw).filter(i => i !== id);
    localStorage.setItem("audits:list", JSON.stringify(list));
    localStorage.removeItem(`audits:${id}`);
  } catch (e) { console.error(e); }
}

const S = {
  wrap: { minHeight: "100vh", background: "#080808", color: "#f0f0f0", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", padding: "0" },
  card: { background: "#111", border: "1px solid #222", borderRadius: 16, padding: "2rem" },
  cardSm: { background: "#111", border: "1px solid #222", borderRadius: 12, padding: "1.25rem" },
  gold: "#D4A017",
  goldBg: "rgba(212,160,23,0.08)",
  goldBorder: "1px solid rgba(212,160,23,0.3)",
  input: { background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, color: "#f0f0f0", padding: "10px 14px", fontSize: 15, width: "100%", outline: "none", boxSizing: "border-box" },
  btnGold: { background: "#D4A017", color: "#000", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
  btnOutline: { background: "transparent", color: "#D4A017", border: "1px solid #D4A017", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.2s" },
  btnGhost: { background: "transparent", color: "#888", border: "1px solid #333", borderRadius: 8, padding: "10px 20px", fontSize: 14, cursor: "pointer" },
  label: { fontSize: 13, color: "#888", marginBottom: 6, display: "block", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: "#f0f0f0", margin: "0 0 4px 0" },
  muted: { color: "#666", fontSize: 14 }
};

function Landing({ onStart, onAdmin }) {
  return (
    <div style={{ ...S.wrap, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .ans-btn { transition: all 0.15s; }
        .ans-btn:hover { transform: translateY(-1px); }
        .gold-btn:hover { background: #e6b520 !important; transform: translateY(-1px); }
        .outline-btn:hover { background: rgba(212,160,23,0.1) !important; }
        input:focus, select:focus, textarea:focus { border-color: #D4A017 !important; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
      `}</style>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "radial-gradient(circle at 50% 0%, rgba(212,160,23,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 600, width: "100%", textAlign: "center", position: "relative" }}>
        <div style={{ display: "inline-block", background: S.goldBg, border: S.goldBorder, borderRadius: 100, padding: "6px 18px", fontSize: 12, color: S.gold, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, marginBottom: 24 }}>
          Auditing 50 Artists in 5 Days
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px, 10vw, 80px)", color: "#fff", margin: "0 0 8px 0", lineHeight: 1, letterSpacing: "0.02em" }}>
          ARTIST BACKEND<br /><span style={{ color: S.gold }}>AUDIT</span>
        </h1>
        <p style={{ color: "#aaa", fontSize: 17, lineHeight: 1.6, margin: "16px auto 36px", maxWidth: 480 }}>
          A professional audit covering 6 pillars of your music business. See exactly where you stand, what you're missing, and what it's costing you.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 36 }}>
          {[["6", "Business Pillars"], ["20+", "Audit Questions"], ["A–F", "Scoring System"]].map(([n, l]) => (
            <div key={l} style={{ background: "#111", border: "1px solid #222", borderRadius: 12, padding: "16px 8px" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: S.gold }}>{n}</div>
              <div style={{ fontSize: 12, color: "#777", marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="gold-btn" style={S.btnGold} onClick={onStart}>Start Free Audit →</button>
          <button className="outline-btn" style={S.btnOutline} onClick={onAdmin}>Admin Dashboard</button>
        </div>
        <p style={{ color: "#444", fontSize: 12, marginTop: 24 }}>100% free · Takes 3–5 minutes · Results saved privately</p>
      </div>
    </div>
  );
}

function ArtistInfo({ info, setInfo, onNext }) {
  const update = (k, v) => setInfo(prev => ({ ...prev, [k]: v }));
  const canProceed = info.name.trim() && info.email.trim() && info.stageName.trim();
  return (
    <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ maxWidth: 560, width: "100%" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ color: S.gold, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Step 1 of 7</div>
          <h2 style={S.sectionTitle}>Tell us about yourself</h2>
          <p style={S.muted}>This stays private — only visible in your admin dashboard.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={S.label}>Legal Name *</label>
              <input style={S.input} placeholder="First Last" value={info.name} onChange={e => update("name", e.target.value)} />
            </div>
            <div>
              <label style={S.label}>Stage / Artist Name *</label>
              <input style={S.input} placeholder="Stage name" value={info.stageName} onChange={e => update("stageName", e.target.value)} />
            </div>
          </div>
          <div>
            <label style={S.label}>Email Address *</label>
            <input style={S.input} type="email" placeholder="your@email.com" value={info.email} onChange={e => update("email", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={S.label}>Primary Role</label>
              <select style={S.input} value={info.type} onChange={e => update("type", e.target.value)}>
                <option value="artist">Artist / Musician</option>
                <option value="producer">Producer / Beatmaker</option>
                <option value="songwriter">Songwriter</option>
                <option value="label">Record Label</option>
                <option value="manager">Artist Manager</option>
              </select>
            </div>
            <div>
              <label style={S.label}>Primary Genre</label>
              <input style={S.input} placeholder="Hip-Hop, R&B, Pop…" value={info.genre} onChange={e => update("genre", e.target.value)} />
            </div>
          </div>
          <div>
            <label style={S.label}>Years Active in Music</label>
            <input style={S.input} placeholder="e.g. 3" value={info.yearsActive} onChange={e => update("yearsActive", e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Instagram / Social Handle (optional)</label>
            <input style={S.input} placeholder="@yourhandle" value={info.handle || ""} onChange={e => update("handle", e.target.value)} />
          </div>
        </div>
        <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
          <button className="gold-btn" style={{ ...S.btnGold, opacity: canProceed ? 1 : 0.4, cursor: canProceed ? "pointer" : "not-allowed" }} disabled={!canProceed} onClick={onNext}>
            Begin Audit →
          </button>
        </div>
      </div>
    </div>
  );
}

function AuditSection({ secData, secIndex, totalSections, answers, onAnswer, onNext, onBack }) {
  const allAnswered = secData.questions.every(q => answers[q.id]);
  const progress = ((secIndex + 1) / totalSections) * 100;
  const sectionScore = secData.questions.reduce((s, q) => {
    if (answers[q.id] === "yes") return s + q.points;
    if (answers[q.id] === "partial") return s + Math.floor(q.points / 2);
    return s;
  }, 0);
  return (
    <div style={{ ...S.wrap, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 20px" }}>
      <div style={{ maxWidth: 660, width: "100%" }}>
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#666" }}>Section {secIndex + 1} of {totalSections}</span>
            <span style={{ fontSize: 13, color: S.gold, fontWeight: 600 }}>{sectionScore}/{secData.maxPoints} pts</span>
          </div>
          <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progress}%`, background: S.gold, borderRadius: 2, transition: "width 0.4s ease" }} />
          </div>
        </div>
        <div style={{ marginBottom: 28, marginTop: 24 }}>
          <div style={{ color: S.gold, fontSize: 13, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{secData.shortTitle}</div>
          <h2 style={S.sectionTitle}>{secData.title}</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {secData.questions.map((q, qi) => (
            <div key={q.id} style={{ ...S.card, padding: "1.25rem 1.5rem", borderColor: answers[q.id] ? (answers[q.id] === "yes" ? "rgba(34,197,94,0.3)" : answers[q.id] === "partial" ? "rgba(234,179,8,0.3)" : "rgba(239,68,68,0.3)") : "#222" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "4px 8px", fontSize: 11, color: "#666", fontWeight: 600, flexShrink: 0, marginTop: 2 }}>{q.points}pt{q.points !== 1 ? "s" : ""}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 14px 0", fontSize: 15, lineHeight: 1.5, color: "#e8e8e8" }}>
                    <span style={{ color: "#555", marginRight: 6 }}>Q{qi + 1}.</span>{q.text}
                  </p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[["yes", "✓ Yes", "#052e16", "#22c55e", "rgba(34,197,94,0.15)"], ["partial", "~ Partial / Working On It", "#1c1407", "#eab308", "rgba(234,179,8,0.15)"], ["no", "✗ No", "#1c0a0a", "#ef4444", "rgba(239,68,68,0.15)"]].map(([val, label, bg, border, hoverBg]) => (
                      <button
                        key={val}
                        className="ans-btn"
                        style={{
                          background: answers[q.id] === val ? hoverBg : "transparent",
                          border: `1px solid ${answers[q.id] === val ? border : "#333"}`,
                          borderRadius: 6,
                          color: answers[q.id] === val ? border : "#666",
                          padding: "6px 14px",
                          fontSize: 13,
                          fontWeight: answers[q.id] === val ? 600 : 400,
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                        onClick={() => onAnswer(q.id, val)}
                      >{label}</button>
                    ))}
                  </div>
                  {answers[q.id] && (
                    <div style={{ marginTop: 12, background: "#0e0e0e", border: "1px solid #1e1e1e", borderRadius: 6, padding: "10px 12px", fontSize: 13, color: "#888", lineHeight: 1.5 }}>
                      <span style={{ color: S.gold, fontWeight: 600 }}>💡 </span>{q.tip}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={S.btnGhost} onClick={onBack}>← Back</button>
          <button
            className="gold-btn"
            style={{ ...S.btnGold, opacity: allAnswered ? 1 : 0.4, cursor: allAnswered ? "pointer" : "not-allowed" }}
            disabled={!allAnswered}
            onClick={onNext}
          >{secIndex === totalSections - 1 ? "See My Results →" : "Next Section →"}</button>
        </div>
      </div>
    </div>
  );
}

function ResultsView({ score, info, answers, onRestart }) {
  const gi = getGradeInfo(score);
  const missing = getMissingItems(answers);
  const sectionScores = SECTIONS.map(sec => ({
    ...sec,
    earned: sec.questions.reduce((s, q) => {
      if (answers[q.id] === "yes") return s + q.points;
      if (answers[q.id] === "partial") return s + Math.floor(q.points / 2);
      return s;
    }, 0)
  }));
  const top3 = missing.slice(0, 3);
  return (
    <div style={{ ...S.wrap, padding: "40px 20px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 100, height: 100, borderRadius: "50%", border: `3px solid ${gi.color}`, background: `${gi.color}10`, marginBottom: 16 }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 56, color: gi.color, lineHeight: 1 }}>{gi.grade}</span>
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, margin: "0 0 8px 0", color: "#fff" }}>
            {gi.label.toUpperCase()}
          </h1>
          <div style={{ fontSize: 28, fontWeight: 700, color: gi.color, marginBottom: 12 }}>{gi.pct}/100</div>
          <p style={{ color: "#aaa", fontSize: 16, maxWidth: 480, margin: "0 auto", lineHeight: 1.6 }}>{gi.desc}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 28 }}>
          {sectionScores.map(sec => {
            const pct = Math.round((sec.earned / sec.maxPoints) * 100);
            const col = pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";
            return (
              <div key={sec.id} style={{ ...S.cardSm, textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: col }}>{sec.earned}<span style={{ fontSize: 12, color: "#555" }}>/{sec.maxPoints}</span></div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{sec.shortTitle}</div>
                <div style={{ height: 3, background: "#1a1a1a", borderRadius: 2, marginTop: 8, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: col, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>

        {top3.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ color: "#f0f0f0", fontSize: 18, fontWeight: 600, marginBottom: 14 }}>🎯 Top 3 Priority Actions</h3>
            {top3.map((item, i) => (
              <div key={i} style={{ ...S.cardSm, marginBottom: 10, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ background: S.goldBg, border: S.goldBorder, borderRadius: 6, padding: "4px 10px", fontSize: 12, color: S.gold, fontWeight: 700, flexShrink: 0 }}>
                  #{i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "#e0e0e0", marginBottom: 4 }}>{item.question}</div>
                  <div style={{ fontSize: 13, color: "#777" }}>{item.tip}</div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.section} · +{item.points} pts potential</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ ...S.card, background: `${gi.color}0a`, borderColor: `${gi.color}30`, marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginBottom: 6 }}>Your Next Step</div>
          <p style={{ margin: 0, fontSize: 15, color: "#ddd", lineHeight: 1.6 }}>{gi.next}</p>
        </div>

        <div style={{ textAlign: "center", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="gold-btn" style={S.btnGold} onClick={onRestart}>Audit Another Artist</button>
          <button className="outline-btn" style={S.btnOutline} onClick={() => {
            const text = `Artist Backend Audit Results\n\nArtist: ${info.stageName} (${info.name})\nGrade: ${gi.grade} — ${gi.pct}/100\nStatus: ${gi.label}\n\nSection Breakdown:\n${sectionScores.map(s => `  ${s.shortTitle}: ${s.earned}/${s.maxPoints}`).join("\n")}\n\nTop Priority Actions:\n${top3.map((item, i) => `  ${i + 1}. ${item.question}`).join("\n")}\n\nAudit by: Auditing 50 Artists in 5 Days Campaign`;
            navigator.clipboard.writeText(text).catch(() => {});
            alert("Results copied to clipboard!");
          }}>Copy Results</button>
        </div>
      </div>
    </div>
  );
}

function AdminLogin({ onUnlock, onBack }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const attempt = () => {
    if (pw === ADMIN_PASSWORD) { onUnlock(); }
    else { setErr("Incorrect password. Hint: BACKEND + Year"); setPw(""); }
  };
  return (
    <div style={{ ...S.wrap, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{ maxWidth: 380, width: "100%" }}>
        <div style={{ ...S.card, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>🔐</div>
          <h2 style={{ ...S.sectionTitle, fontSize: 20, marginBottom: 6 }}>Admin Dashboard</h2>
          <p style={S.muted}>Enter the admin password to access the CRM</p>
          <div style={{ marginTop: 24 }}>
            <input
              style={{ ...S.input, textAlign: "center", letterSpacing: "0.1em", marginBottom: 10 }}
              type="password"
              placeholder="Enter password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
            />
            {err && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 10 }}>{err}</p>}
            <button className="gold-btn" style={{ ...S.btnGold, width: "100%" }} onClick={attempt}>Unlock Dashboard →</button>
            <button style={{ ...S.btnGhost, width: "100%", marginTop: 10 }} onClick={onBack}>← Back to Audit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onBack }) {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    loadAllSubmissions().then(data => { setSubs(data); setLoading(false); });
  }, []);

  const reload = () => {
    setLoading(true);
    loadAllSubmissions().then(data => { setSubs(data); setLoading(false); });
  };

  const filtered = subs.filter(s => {
    const gi = getGradeInfo(s.score);
    const matchGrade = filter === "all" || gi.grade === filter;
    const matchSearch = !search || s.info.stageName?.toLowerCase().includes(search.toLowerCase()) || s.info.name?.toLowerCase().includes(search.toLowerCase()) || s.info.email?.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  });

  const exportCSV = () => {
    const headers = ["Date", "Stage Name", "Legal Name", "Email", "Type", "Genre", "Score", "Grade", "Business", "Royalties", "Distribution", "Finances", "Brand", "Team", "Handle"];
    const rows = filtered.map(s => {
      const gi = getGradeInfo(s.score);
      const ss = SECTIONS.map(sec => sec.questions.reduce((t, q) => t + (s.answers[q.id] === "yes" ? q.points : s.answers[q.id] === "partial" ? Math.floor(q.points / 2) : 0), 0));
      return [
        new Date(s.savedAt).toLocaleDateString(),
        s.info.stageName, s.info.name, s.info.email, s.info.type, s.info.genre,
        s.score, gi.grade, ...ss, s.info.handle || ""
      ];
    });
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `artist-audits-${Date.now()}.csv`;
    a.click();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    await deleteSubmission(id);
    reload();
    if (selected?.id === id) setSelected(null);
  };

  const gradeCount = (g) => subs.filter(s => getGradeInfo(s.score).grade === g).length;

  return (
    <div style={{ ...S.wrap, padding: "24px 20px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ ...S.sectionTitle, fontSize: 24, margin: 0 }}>Audit CRM Dashboard</h2>
            <p style={S.muted}>{subs.length} total submissions</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="outline-btn" style={S.btnOutline} onClick={exportCSV}>↓ Export CSV</button>
            <button className="outline-btn" style={S.btnOutline} onClick={reload}>↻ Refresh</button>
            <button style={S.btnGhost} onClick={onBack}>← Exit</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10, marginBottom: 20 }}>
          {[
            ["Total", subs.length, S.gold],
            ["A", gradeCount("A"), "#22c55e"],
            ["B", gradeCount("B"), "#84cc16"],
            ["C", gradeCount("C"), "#eab308"],
            ["D", gradeCount("D"), "#f97316"],
            ["F", gradeCount("F"), "#ef4444"]
          ].map(([label, count, color]) => (
            <div key={label} style={{ ...S.cardSm, textAlign: "center", cursor: label !== "Total" ? "pointer" : "default", borderColor: filter === label ? color + "55" : "#222" }}
              onClick={() => label !== "Total" && setFilter(filter === label ? "all" : label)}>
              <div style={{ fontSize: 22, fontWeight: 700, color }}>{count}</div>
              <div style={{ fontSize: 12, color: "#666" }}>Grade {label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <input style={{ ...S.input, flex: 1 }} placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          {filter !== "all" && (
            <button style={S.btnGhost} onClick={() => setFilter("all")}>Clear Filter</button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#555" }}>Loading submissions…</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: "#555" }}>{subs.length === 0 ? "No submissions yet. Share the audit link to get started." : "No results match your filter."}</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map(sub => {
              const gi = getGradeInfo(sub.score);
              const isSelected = selected?.id === sub.id;
              return (
                <div key={sub.id}>
                  <div
                    style={{ ...S.card, padding: "14px 18px", cursor: "pointer", borderColor: isSelected ? S.gold + "55" : "#222", transition: "all 0.15s" }}
                    onClick={() => setSelected(isSelected ? null : sub)}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${gi.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: gi.color, lineHeight: 1 }}>{gi.grade}</span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: "#f0f0f0", fontSize: 15 }}>{sub.info.stageName || sub.info.name}</div>
                          <div style={{ fontSize: 13, color: "#666" }}>{sub.info.email} · {sub.info.type} · {sub.info.genre || "—"}</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: 18, fontWeight: 700, color: gi.color }}>{sub.score}/100</div>
                          <div style={{ fontSize: 12, color: "#555" }}>{new Date(sub.savedAt).toLocaleDateString()}</div>
                        </div>
                        <button
                          style={{ background: "transparent", border: "1px solid #2a2a2a", borderRadius: 6, color: "#555", padding: "6px 10px", fontSize: 12, cursor: "pointer" }}
                          onClick={e => { e.stopPropagation(); handleDelete(sub.id); }}
                        >✕</button>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ ...S.card, borderTop: "none", borderRadius: "0 0 16px 16px", background: "#0d0d0d", padding: "1.25rem 1.5rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: 16 }}>
                        {SECTIONS.map(sec => {
                          const earned = sec.questions.reduce((t, q) => t + (sub.answers[q.id] === "yes" ? q.points : sub.answers[q.id] === "partial" ? Math.floor(q.points / 2) : 0), 0);
                          const pct = Math.round((earned / sec.maxPoints) * 100);
                          const col = pct >= 80 ? "#22c55e" : pct >= 60 ? "#eab308" : "#ef4444";
                          return (
                            <div key={sec.id} style={{ background: "#111", border: "1px solid #1a1a1a", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                              <div style={{ fontSize: 16, fontWeight: 700, color: col }}>{earned}/{sec.maxPoints}</div>
                              <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>{sec.shortTitle}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {SECTIONS.flatMap(sec => sec.questions).map(q => {
                          const ans = sub.answers[q.id];
                          const col = ans === "yes" ? "#22c55e" : ans === "partial" ? "#eab308" : "#ef4444";
                          return (
                            <div key={q.id} title={q.text} style={{ background: `${col}15`, border: `1px solid ${col}40`, borderRadius: 4, padding: "3px 8px", fontSize: 11, color: col }}>
                              {ans === "yes" ? "✓" : ans === "partial" ? "~" : "✗"} {q.id}
                            </div>
                          );
                        })}
                      </div>
                      {sub.info.handle && (
                        <div style={{ marginTop: 12, fontSize: 13, color: "#666" }}>Handle: {sub.info.handle} · Years Active: {sub.info.yearsActive || "—"}</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ArtistAuditApp() {
  const [view, setView] = useState("landing");
  const [secIdx, setSecIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [info, setInfo] = useState({ name: "", email: "", stageName: "", genre: "", type: "artist", yearsActive: "", handle: "" });
  const [finalScore, setFinalScore] = useState(0);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAnswer = useCallback((qid, val) => {
    setAnswers(prev => ({ ...prev, [qid]: val }));
  }, []);

  const handleSectionNext = async () => {
    if (secIdx < SECTIONS.length - 1) {
      setSecIdx(s => s + 1);
    } else {
      const score = calcScore(answers);
      setFinalScore(score);
      setSaving(true);
      const submissionData = { info, answers, score };
      await Promise.all([
        saveSubmission(submissionData),
        sendToZapier(submissionData)
      ]);
      setSaving(false);
      setView("results");
    }
  };

  const handleSectionBack = () => {
    if (secIdx === 0) setView("info");
    else setSecIdx(s => s - 1);
  };

  const handleRestart = () => {
    setAnswers({});
    setInfo({ name: "", email: "", stageName: "", genre: "", type: "artist", yearsActive: "", handle: "" });
    setSecIdx(0);
    setView("landing");
  };

  if (view === "landing") return <Landing onStart={() => setView("info")} onAdmin={() => setView("adminLogin")} />;
  if (view === "info") return <ArtistInfo info={info} setInfo={setInfo} onNext={() => { setSecIdx(0); setView("audit"); }} />;
  if (view === "audit") return (
    <AuditSection
      secData={SECTIONS[secIdx]}
      secIndex={secIdx}
      totalSections={SECTIONS.length}
      answers={answers}
      onAnswer={handleAnswer}
      onNext={handleSectionNext}
      onBack={handleSectionBack}
    />
  );
  if (view === "results") return <ResultsView score={finalScore} info={info} answers={answers} onRestart={handleRestart} />;
  if (view === "adminLogin") return (
    <AdminLogin
      onUnlock={() => { setAdminUnlocked(true); setView("admin"); }}
      onBack={() => setView("landing")}
    />
  );
  if (view === "admin") return <AdminDashboard onBack={() => setView("landing")} />;
  return null;
}
