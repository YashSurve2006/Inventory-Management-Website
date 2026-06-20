import React, { useEffect, useState } from "react";

const categoryIcons = {
    CPU: "🧠",
    GPU: "🎮",
    RAM: "⚡",
    Motherboard: "🧩",
    Storage: "💾",
    PSU: "🔌",
    Cabinet: "🖥",
    Cooling: "❄"
};

const BuildSummary = ({ components }) => {

    const [items, setItems] = useState([]);
    const [anim, setAnim] = useState(false);

    useEffect(() => {

        const list = Object.values(components).filter(Boolean);

        setItems(list);

        setAnim(false);

        setTimeout(() => {
            setAnim(true);
        }, 100);

    }, [components]);

    const totalItems = items.length;

    return (

        <div className="summary-wrapper">

            <div className="summary-header">

                <div className="title">

                    Build Summary

                </div>

                <div className="count">

                    {totalItems} Components Selected

                </div>

            </div>

            <div className="summary-grid">

                {items.length === 0 && (

                    <div className="empty-card">

                        <div className="empty-icon">🖥</div>

                        <div className="empty-text">

                            No components selected yet

                        </div>

                    </div>

                )}

                {items.map((item, index) => (

                    <div
                        key={index}
                        className={`component-card ${anim ? "show" : ""}`}
                    >

                        <div className="card-left">

                            <div className="icon">

                                {categoryIcons[item.category] || "⚙"}

                            </div>

                            <div className="info">

                                <div className="name">

                                    {item.name}

                                </div>

                                <div className="category">

                                    {item.category}

                                </div>

                            </div>

                        </div>

                        <div className="card-right">

                            ₹{Number(item.price).toLocaleString()}

                        </div>

                    </div>

                ))}

            </div>

            <style jsx>{`

        .summary-wrapper{
          background:#0f172a;
          border-radius:12px;
          padding:20px;
          display:flex;
          flex-direction:column;
          gap:20px;
          border:1px solid rgba(255,255,255,0.05);
          box-shadow:0 10px 40px rgba(0,0,0,0.35);
        }

        .summary-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .title{
          font-size:18px;
          font-weight:600;
        }

        .count{
          font-size:12px;
          color:#94a3b8;
        }

        .summary-grid{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .component-card{
          display:flex;
          justify-content:space-between;
          align-items:center;
          background:#1e293b;
          padding:14px;
          border-radius:8px;
          opacity:0;
          transform:translateY(10px);
          transition:all .35s ease;
          border:1px solid rgba(255,255,255,0.03);
        }

        .component-card.show{
          opacity:1;
          transform:translateY(0);
        }

        .component-card:hover{
          transform:translateY(-2px) scale(1.01);
          box-shadow:0 8px 30px rgba(0,0,0,0.4);
        }

        .card-left{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .icon{
          width:36px;
          height:36px;
          display:flex;
          align-items:center;
          justify-content:center;
          border-radius:50%;
          background:#1e293b;
          font-size:18px;
          box-shadow:0 0 12px rgba(0,0,0,0.4);
        }

        .info{
          display:flex;
          flex-direction:column;
        }

        .name{
          font-size:14px;
          font-weight:500;
        }

        .category{
          font-size:11px;
          color:#94a3b8;
        }

        .card-right{
          font-size:14px;
          color:#22c55e;
          font-weight:600;
        }

        .empty-card{
          padding:30px;
          text-align:center;
          border:2px dashed rgba(255,255,255,0.08);
          border-radius:8px;
          display:flex;
          flex-direction:column;
          gap:10px;
          align-items:center;
          justify-content:center;
        }

        .empty-icon{
          font-size:28px;
          opacity:0.6;
        }

        .empty-text{
          font-size:13px;
          color:#94a3b8;
        }

      `}</style>

        </div>

    );

};

export default BuildSummary;