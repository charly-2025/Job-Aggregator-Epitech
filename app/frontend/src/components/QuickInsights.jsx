import { useState, useEffect } from "react";

export default function QuickInsights({ user, refreshAccessToken }) {
  const [listTop10Skills, setListTop10Skills] = useState([]);

  useEffect(() => {
    async function getTop10Skills(retry = false) {
      try {
        const response = await fetch("http://localhost:3001/api/skills/top10Skills", {
          method: "GET",
          credentials: "include",
        });
        if (response.status === 401 && !retry) {
          await refreshAccessToken();
          return getTop10Skills(true);
        }
        const data = await response.json();
        console.log(data)
        setListTop10Skills(data);
      } catch (err) {
        console.error(err);
      }
    }
    getTop10Skills();
  }, []);

  const userSkillsLower = (user?.skills || []).map(s => s.toLowerCase());

  const matchedSkills = listTop10Skills.filter(s =>
    userSkillsLower.includes(s.name.toLowerCase())
  );

  const completeness = Math.min(100, matchedSkills.length * 10);

  const maxOffers = listTop10Skills[0]?.nb_total_offers || 1;

  return (
    <div style={{ background: "#111010", border: "1px solid #2a2a2a", borderRadius: 14, padding: 20, color: "white" }}>
      
      <p style={{ fontSize: 16, fontWeight: 500, margin: "0 0 20px" }}>Quick Insights</p>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: "#999" }}>Profile Completeness</span>
        <span style={{ fontSize: 13, fontWeight: 500 }}>{completeness}%</span>
      </div>
      <div style={{ width: "100%", height: 5, background: "#2a2a2a", borderRadius: 99, marginBottom: 4 }}>
        <div style={{
          width: `${completeness}%`,
          height: "100%",
          borderRadius: 99,
          background: "linear-gradient(90deg, #a855f7, #ec4899)",
          transition: "width 0.4s ease"
        }} />
      </div>
      <p style={{ fontSize: 11, color: "#666", margin: "0 0 20px" }}>
        {matchedSkills.length}/10 top skills matched
      </p>

      <p style={{ fontSize: 13, color: "#999", margin: "0 0 12px" }}>Top Skills in Demand</p>

      {listTop10Skills.map((skill) => {
        const pct = Math.round((skill.nb_offers / skill.nb_total_offers) * 100);
        const isMatched = userSkillsLower.includes(skill.name.toLowerCase());
        return (
          <div key={skill.skill_id}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 13, color: isMatched ? "#a78bfa" : "#ddd", display: "flex", alignItems: "center", gap: 6 }}>
                {skill.name}
                {isMatched && <span style={{ fontSize: 10, background: "rgba(167,139,250,0.15)", color: "#a78bfa", borderRadius: 4, padding: "1px 6px" }}>+10%</span>}
              </span>
              <span style={{ fontSize: 12, color: "#aaa" }}>{skill.nb_offers} offres</span>
            </div>
            <div style={{ width: "100%", height: 5, background: "#2a2a2a", borderRadius: 99, marginBottom: 12 }}>
              <div style={{
                width: `${pct}%`,
                height: "100%",
                background: isMatched ? "#a78bfa" : "#22c55e",
                borderRadius: 99
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}