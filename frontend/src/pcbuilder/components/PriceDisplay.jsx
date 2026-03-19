import React, { useEffect, useState } from "react";

const PriceDisplay = ({ total }) => {

    const [displayPrice, setDisplayPrice] = useState(0);
    const [glow, setGlow] = useState(false);

    useEffect(() => {

        let start = displayPrice;
        let end = total;

        if (start === end) return;

        const duration = 500;
        const startTime = Date.now();

        const animate = () => {

            const now = Date.now();
            const progress = Math.min((now - startTime) / duration, 1);

            const value = Math.floor(start + (end - start) * progress);

            setDisplayPrice(value);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setGlow(true);
                setTimeout(() => setGlow(false), 400);
            }

        };

        animate();

    }, [total]);

    const formatted = () => {

        return "₹" + displayPrice.toLocaleString();

    };

    const performanceTier = () => {

        if (displayPrice >= 200000) return "Ultra High-End";
        if (displayPrice >= 120000) return "High-End";
        if (displayPrice >= 70000) return "Gaming Build";
        if (displayPrice >= 40000) return "Mid Range";
        if (displayPrice >= 20000) return "Budget";
        return "Entry";

    };

    const tierColor = () => {

        if (displayPrice >= 200000) return "#8b5cf6";
        if (displayPrice >= 120000) return "#6366f1";
        if (displayPrice >= 70000) return "#22c55e";
        if (displayPrice >= 40000) return "#f59e0b";
        if (displayPrice >= 20000) return "#f97316";
        return "#94a3b8";

    };

    return (

        <div className="price-wrapper">

            <div className="price-header">

                <div className="title">

                    Estimated Build Cost

                </div>

                <div
                    className="tier"
                    style={{ background: tierColor() }}
                >
                    {performanceTier()}
                </div>

            </div>

            <div className={`price-value ${glow ? "glow" : ""}`}>

                {formatted()}

            </div>

            <div className="price-subtext">

                Total cost of selected components

            </div>

            <div className="visual-bar">

                <div
                    className="bar-fill"
                    style={{
                        width: Math.min(displayPrice / 2000, 100) + "%",
                        background: tierColor()
                    }}
                />

            </div>

            <div className="price-scale">

                <span>Budget</span>
                <span>Mid</span>
                <span>Gaming</span>
                <span>High-End</span>

            </div>

            <style jsx>{`

        .price-wrapper{
          background:#0f172a;
          padding:22px;
          border-radius:12px;
          display:flex;
          flex-direction:column;
          gap:14px;
          border:1px solid rgba(255,255,255,0.05);
          box-shadow:0 12px 40px rgba(0,0,0,0.4);
        }

        .price-header{
          display:flex;
          justify-content:space-between;
          align-items:center;
        }

        .title{
          font-size:16px;
          font-weight:600;
        }

        .tier{
          padding:5px 10px;
          border-radius:20px;
          font-size:11px;
          font-weight:600;
          color:white;
        }

        .price-value{
          font-size:36px;
          font-weight:700;
          letter-spacing:1px;
          transition:all .3s ease;
          color:white;
        }

        .price-value.glow{
          text-shadow:0 0 15px rgba(99,102,241,0.7);
          transform:scale(1.03);
        }

        .price-subtext{
          font-size:12px;
          color:#94a3b8;
        }

        .visual-bar{
          width:100%;
          height:8px;
          background:#1e293b;
          border-radius:20px;
          overflow:hidden;
        }

        .bar-fill{
          height:100%;
          transition:width .5s ease;
        }

        .price-scale{
          display:flex;
          justify-content:space-between;
          font-size:10px;
          color:#64748b;
        }

      `}</style>

        </div>

    );

};

export default PriceDisplay;