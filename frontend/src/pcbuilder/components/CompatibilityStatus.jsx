import React, { useEffect, useState } from "react";

const CompatibilityStatus = ({ data }) => {

  const [visible,setVisible] = useState(false);
  const [warnings,setWarnings] = useState([]);
  const [compatible,setCompatible] = useState(true);
  const [performance,setPerformance] = useState(0);

  useEffect(()=>{

    if(!data) return;

    setWarnings(data.warnings || []);
    setCompatible(data.compatible);
    setPerformance(data.performanceScore || 0);

    setVisible(false);

    setTimeout(()=>{
      setVisible(true);
    },100);

  },[data]);

  const performanceColor = () => {

    if(performance >= 80) return "#22c55e";
    if(performance >= 60) return "#f59e0b";
    return "#ef4444";

  };

  const performanceLabel = () => {

    if(performance >= 80) return "High Performance";
    if(performance >= 60) return "Balanced";
    return "Low Performance";

  };

  return (

    <div className="compatibility-wrapper">

      <div className="compat-header">

        <div className="title">Compatibility Check</div>

        <div className={`status-badge ${compatible ? "ok":"error"}`}>

          {compatible ? "Compatible":"Issues Found"}

        </div>

      </div>

      <div className="performance-section">

        <div className="perf-title">Estimated Performance</div>

        <div className="meter-wrapper">

          <div className="meter-bg">

            <div
              className="meter-fill"
              style={{
                width:visible ? performance+"%" : "0%",
                background:performanceColor()
              }}
            />

          </div>

          <div className="meter-label">

            {performance}% • {performanceLabel()}

          </div>

        </div>

      </div>

      <div className="warnings-section">

        {warnings.length === 0 && (

          <div className="success-card">

            <div className="success-icon">✓</div>

            <div className="success-text">

              All selected components are compatible.

            </div>

          </div>

        )}

        {warnings.map((w,index)=>(

          <div
            key={index}
            className={`warning-card ${visible ? "show":""}`}
          >

            <div className="warning-icon">⚠</div>

            <div className="warning-message">

              {w.message}

            </div>

          </div>

        ))}

      </div>

      <style jsx>{`

        .compatibility-wrapper{
          background:#0f172a;
          border-radius:12px;
          padding:20px;
          display:flex;
          flex-direction:column;
          gap:20px;
          border:1px solid rgba(255,255,255,0.05);
          box-shadow:0 10px 40px rgba(0,0,0,0.3);
          animation:fadeIn .4s ease;
        }

        @keyframes fadeIn{
          from{
            opacity:0;
            transform:translateY(10px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .compat-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .title{
          font-size:18px;
          font-weight:600;
        }

        .status-badge{
          padding:6px 12px;
          border-radius:20px;
          font-size:12px;
          font-weight:600;
        }

        .status-badge.ok{
          background:#14532d;
          color:#4ade80;
        }

        .status-badge.error{
          background:#7f1d1d;
          color:#f87171;
        }

        .performance-section{
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .perf-title{
          font-size:14px;
          color:#94a3b8;
        }

        .meter-wrapper{
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .meter-bg{
          width:100%;
          height:10px;
          background:#1e293b;
          border-radius:20px;
          overflow:hidden;
        }

        .meter-fill{
          height:100%;
          transition:width .7s ease;
        }

        .meter-label{
          font-size:12px;
          color:#cbd5f5;
        }

        .warnings-section{
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .warning-card{
          display:flex;
          align-items:center;
          gap:12px;
          padding:12px;
          background:#1e293b;
          border-left:4px solid #f59e0b;
          border-radius:6px;
          opacity:0;
          transform:translateY(6px);
          transition:all .4s ease;
        }

        .warning-card.show{
          opacity:1;
          transform:translateY(0);
        }

        .warning-icon{
          font-size:18px;
        }

        .warning-message{
          font-size:14px;
        }

        .success-card{
          display:flex;
          align-items:center;
          gap:10px;
          background:#052e16;
          padding:14px;
          border-radius:8px;
          border:1px solid #14532d;
        }

        .success-icon{
          color:#22c55e;
          font-size:18px;
        }

        .success-text{
          font-size:14px;
        }

      `}</style>

    </div>

  );

};

export default CompatibilityStatus;