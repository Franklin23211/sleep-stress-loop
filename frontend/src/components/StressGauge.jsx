export default function StressGauge({ score }) {
  const clamp = Math.max(1, Math.min(100, score));

  const cx = 160, cy = 155, r = 120;

  const toRad = (d) => (d * Math.PI) / 180;
  const arcX = (deg) => cx + r * Math.cos(toRad(deg));
  const arcY = (deg) => cy - r * Math.sin(toRad(deg));

  const angle = 180 - (clamp / 100) * 180;

  const zoneColor =
    clamp <= 33 ? "#00e5c3" :
    clamp <= 66 ? "#f59e0b" :
                  "#f43f5e";

  const zoneLabel =
    clamp <= 33 ? "Low Stress" :
    clamp <= 66 ? "Moderate Stress" :
                  "High Stress";

  const needleLen = 95;
  const needleX = cx + needleLen * Math.cos(toRad(angle));
  const needleY = cy - needleLen * Math.sin(toRad(angle));

  return (
    <div className="flex flex-col items-center w-full">
      <svg viewBox="0 0 320 210" width="100%" style={{ maxWidth: 320 }}>
        {/* Background track */}
        <path
          d={`M ${arcX(180)} ${arcY(180)} A ${r} ${r} 0 0 1 ${arcX(0)} ${arcY(0)}`}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* Green zone */}
        <path
          d={`M ${arcX(180)} ${arcY(180)} A ${r} ${r} 0 0 1 ${arcX(120)} ${arcY(120)}`}
          fill="none" stroke="#00e5c333" strokeWidth="24" strokeLinecap="round"
        />
        {/* Yellow zone */}
        <path
          d={`M ${arcX(120)} ${arcY(120)} A ${r} ${r} 0 0 1 ${arcX(60)} ${arcY(60)}`}
          fill="none" stroke="#f59e0b33" strokeWidth="24" strokeLinecap="round"
        />
        {/* Red zone */}
        <path
          d={`M ${arcX(60)} ${arcY(60)} A ${r} ${r} 0 0 1 ${arcX(0)} ${arcY(0)}`}
          fill="none" stroke="#f43f5e33" strokeWidth="24" strokeLinecap="round"
        />

        {/* Filled progress */}
        <path
          d={`M ${arcX(180)} ${arcY(180)} A ${r} ${r} 0 ${clamp > 50 ? 1 : 0} 1 ${arcX(angle)} ${arcY(angle)}`}
          fill="none"
          stroke={zoneColor}
          strokeWidth="24"
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${zoneColor})` }}
        />

        {/* Zone labels */}
        <text x="18" y={cy + 25} fill="#9ca3af"
          style={{ fontSize: 11, fontFamily: "DM Sans" }}>LOW</text>
        <text x={cx - 14} y="25" fill="#9ca3af"
          style={{ fontSize: 11, fontFamily: "DM Sans" }}>MED</text>
        <text x="262" y={cy + 25} fill="#9ca3af"
          style={{ fontSize: 11, fontFamily: "DM Sans" }}>HIGH</text>

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={needleX} y2={needleY}
          stroke="white" strokeWidth="3" strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="10" fill="white" />
        <circle cx={cx} cy={cy} r="5" fill={zoneColor} />

        {/* Score background pill */}
        <rect
          x={cx - 45} y={cy + 22}
          width="90" height="38"
          rx="10"
          fill="rgba(0,0,0,0.35)"
        />

        {/* Score number */}
        <text x={cx} y={cy + 47} textAnchor="middle"
          fill="white"
          style={{ fontSize: 28, fontFamily: "Syne, sans-serif", fontWeight: 800 }}>
          {Math.round(clamp)}
        </text>

        {/* Zone label background */}
        <rect
          x={cx - 60} y={cy + 64}
          width="120" height="24"
          rx="8"
          fill={`${zoneColor}33`}
        />

        {/* Zone label */}
        <text x={cx} y={cy + 81} textAnchor="middle"
          fill={zoneColor}
          style={{ fontSize: 12, fontFamily: "DM Sans, sans-serif", fontWeight: 700 }}>
          {zoneLabel}
        </text>
      </svg>
    </div>
  );
}