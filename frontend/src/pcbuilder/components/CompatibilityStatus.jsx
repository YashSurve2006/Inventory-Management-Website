import React, { useEffect, useState } from "react";

const CompatibilityStatus = ({ data }) => {

  /* =====================================================
     STATE
  ===================================================== */

  const [visible, setVisible] = useState(false);

  const [warnings, setWarnings] = useState([]);

  const [compatible, setCompatible] = useState(true);

  const [performance, setPerformance] = useState(0);

  const [score, setScore] = useState(0);

  const [power, setPower] = useState(0);

  const [tier, setTier] = useState("Entry");

  /* =====================================================
     DATA UPDATE
  ===================================================== */

  useEffect(() => {

    if (!data) return;

    setWarnings(data.warnings || []);

    setCompatible(data.compatible ?? true);

    setPerformance(data.performanceScore || 0);

    setScore(data.compatibilityScore ?? 0);

    setPower(data.estimatedPower ?? 0);

    determineTier(data.performanceScore || 0);

    setVisible(false);

    setTimeout(() => {
      setVisible(true);
    }, 100);

  }, [data]);

  /* =====================================================
     PERFORMANCE COLOR
  ===================================================== */

  const performanceColor = () => {

    if (performance >= 80)
      return "#22c55e";

    if (performance >= 60)
      return "#f59e0b";

    return "#ef4444";

  };

  /* =====================================================
     PERFORMANCE LABEL
  ===================================================== */

  const performanceLabel = () => {

    if (performance >= 90)
      return "High-End Gaming";

    if (performance >= 70)
      return "Gaming";

    if (performance >= 50)
      return "Balanced";

    return "Entry Level";

  };

  /* =====================================================
     PERFORMANCE TIER
  ===================================================== */

  const determineTier = (value) => {

    if (value >= 90)
      setTier("High-End");

    else if (value >= 70)
      setTier("Gaming");

    else if (value >= 50)
      setTier("Mid-Range");

    else
      setTier("Entry");

  };

  /* =====================================================
     STATUS COLOR
  ===================================================== */
const statusColor = () => {

    if (data?.status === "Compatible")
        return "ok";

    if (data?.status === "Minor Issues")
        return "warning";

    return "error";

};

  /* =====================================================
     BAR CALCULATIONS
  ===================================================== */

  const gamingBar =
    Math.min(performance, 100);

  const workstationBar =
    Math.min(performance + 15, 100);

  const efficiencyBar =
    Math.min(score, 100);

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="compatibility-wrapper">

      {/* HEADER */}

      <div className="compat-header">

        <div className="title">

          Compatibility Check

        </div>

        <div
          className={`status-badge ${statusColor()}`}
        >

{data?.status === "Compatible"
    ? "Fully Compatible"
    : data?.status === "Minor Issues"
    ? "Minor Issues"
    : "Not Compatible"}

        </div>

      </div>

      {/* STATS */}

      <div className="stats-grid">

        <Stat label="Compatibility" value={`${score}%`} />

        <Stat label="Power Usage" value={`${power}W`} />

        <Stat label="Performance" value={`${performance}%`} />

        <Stat label="Tier" value={tier} />

      </div>

      {/* PERFORMANCE BAR */}

      <div className="performance-section">

        <div className="perf-title">

          Estimated Performance

        </div>

        <div className="meter-wrapper">

          <div className="meter-bg">

            <div
              className="meter-fill"
              style={{
                width: visible
                  ? performance + "%"
                  : "0%",
                background:
                  performanceColor()
              }}
            />

          </div>

          <div className="meter-label">

            {performance}% • {performanceLabel()}

          </div>

        </div>

      </div>

      {/* CATEGORY BARS */}

      <div className="bars">

        <Bar
          label="Gaming"
          value={gamingBar}
          color="#3b82f6"
        />

        <Bar
          label="Workstation"
          value={workstationBar}
          color="#a855f7"
        />

        <Bar
          label="Efficiency"
          value={efficiencyBar}
          color="#22c55e"
        />

      </div>

      {/* WARNINGS */}

      <div className="warnings-section">

        {warnings.length === 0 && (

          <div className="success-card">

            <div className="success-icon">

              ✓

            </div>

            <div className="success-text">

              All selected components are compatible.

            </div>

          </div>

        )}

        {warnings.map((w, index) => (

          <div
            key={index}
            className={`warning-card ${visible ? "show" : ""}`}
          >

            <div className="warning-icon">

              ⚠

            </div>

            <div className="warning-message">

              {w.message}

            </div>

          </div>

        ))}

      </div>

      {/* STYLES */}

      <style jsx>{`

        .compatibility-wrapper {
          background: #0f172a;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border: 1px solid rgba(255,255,255,0.05);
          box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }

        .compat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .title {
          font-size: 18px;
          font-weight: 600;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          gap: 10px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.ok {
          background: #14532d;
          color: #4ade80;
        }

        .status-badge.warning {
          background: #78350f;
          color: #fbbf24;
        }

        .status-badge.error {
          background: #7f1d1d;
          color: #f87171;
        }

        .performance-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .perf-title {
          font-size: 14px;
          color: #94a3b8;
        }

        .meter-bg {
          width: 100%;
          height: 10px;
          background: #1e293b;
          border-radius: 20px;
          overflow: hidden;
        }

        .meter-fill {
          height: 100%;
          transition: width .7s ease;
        }

        .meter-label {
          font-size: 12px;
          color: #cbd5f5;
        }

        .bars {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .warning-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #1e293b;
          border-left: 4px solid #f59e0b;
          border-radius: 6px;
          opacity: 0;
          transform: translateY(6px);
          transition: all .4s ease;
        }

        .warning-card.show {
          opacity: 1;
          transform: translateY(0);
        }

        .success-card {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #052e16;
          padding: 14px;
          border-radius: 8px;
          border: 1px solid #14532d;
        }

      `}</style>

    </div>

  );

};

/* =====================================================
   STAT COMPONENT
===================================================== */

const Stat = ({ label, value }) => (

  <div style={{
    background: "#1e293b",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "13px"
  }}>
    <div style={{
      color: "#94a3b8"
    }}>
      {label}
    </div>
    <div style={{
      fontWeight: "600"
    }}>
      {value}
    </div>
  </div>

);

/* =====================================================
   BAR COMPONENT
===================================================== */

const Bar = ({
  label,
  value,
  color
}) => (

  <div>

    <div
      style={{
        fontSize: "12px",
        marginBottom: "4px"
      }}
    >
      {label}
    </div>

    <div
      style={{
        background: "#1e293b",
        height: "8px",
        borderRadius: "20px",
        overflow: "hidden"
      }}
    >

      <div
        style={{
          width: value + "%",
          background: color,
          height: "100%",
          transition: "width .6s"
        }}
      />

    </div>

  </div>

);

export default CompatibilityStatus;