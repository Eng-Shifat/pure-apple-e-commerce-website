import Image from "next/image";

/**
 * Pure Apple logo with a slow, glamorous "Luxora-style" shine.
 *
 *  • A soft light band glides across the logo once every ~8 seconds.
 *  • The band is masked with the logo SVG itself, so it only shows on the
 *    apple / leaf / letters – never on the background.
 *  • Two tiny sparkles twinkle at the leaf tip and at the end of the sweep.
 *
 * Tweak the speed with the two constants below.
 */
const CYCLE = 8;   // seconds for one full cycle (bigger = slower)
const SWEEP = 0.3; // part of the cycle used by the sweep itself (0.3 = 2.4 s)

export default function ShineLogo({
  height = 48,
  className = "",
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const width = Math.round((height * 2319) / 2368);
  const end = Math.round(SWEEP * 100);

  return (
    <span
      className={`pa-shine-logo ${className}`}
      style={{ position: "relative", display: "inline-block", flexShrink: 0, width, height }}
    >
      <Image
        src="/logo/pure-apple-logo.svg"
        alt="Pure Apple"
        width={width}
        height={height}
        priority={priority}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          filter: "drop-shadow(0 3px 6px rgba(251,87,36,0.20))",
        }}
      />

      {/* the shine (masked to the logo shape) */}
      <span aria-hidden="true" className="pa-shine" />

      {/* sparkles */}
      <span aria-hidden="true" className="pa-spark pa-spark-1" />
      <span aria-hidden="true" className="pa-spark pa-spark-2" />

      <style>{`
        .pa-shine-logo .pa-shine {
          position: absolute; inset: 0; pointer-events: none;
          -webkit-mask-image: url(/logo/pure-apple-logo.svg);
                  mask-image: url(/logo/pure-apple-logo.svg);
          -webkit-mask-size: 100% 100%;   mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          background: linear-gradient(
            105deg,
            rgba(255,255,255,0)    28%,
            rgba(255,244,214,0.55) 42%,
            rgba(255,255,255,0.98) 50%,
            rgba(255,244,214,0.55) 58%,
            rgba(255,255,255,0)    72%
          );
          background-size: 320% 100%;
          background-position: 135% 0;
          animation: pa-shine-sweep ${CYCLE}s cubic-bezier(0.45, 0, 0.25, 1) 1.5s infinite;
        }
        .pa-shine-logo:hover .pa-shine { animation-duration: ${CYCLE / 2}s; animation-delay: 0s; }

        @keyframes pa-shine-sweep {
          0%        { background-position: 135% 0; }
          ${end}%   { background-position: -35% 0; }
          100%      { background-position: -35% 0; }
        }

        /* 4-point sparkles */
        .pa-shine-logo .pa-spark {
          position: absolute; pointer-events: none; opacity: 0; transform: scale(0);
          background: radial-gradient(circle, #fff 0%, #FFD84A 28%, #F5A300 78%);
          clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%);
          filter: drop-shadow(0 0 3px rgba(252,193,11,0.9));
          animation: pa-spark ${CYCLE}s ease-in-out infinite;
        }
        .pa-shine-logo .pa-spark-1 { width: 11px; height: 11px; top: -4%;  right: 4%;  animation-delay: ${(1.5 + CYCLE * SWEEP * 0.45).toFixed(2)}s; }
        .pa-shine-logo .pa-spark-2 { width: 8px;  height: 8px;  bottom: 18%; right: -6%; animation-delay: ${(1.5 + CYCLE * SWEEP * 0.85).toFixed(2)}s; }

        @keyframes pa-spark {
          0%   { opacity: 0; transform: scale(0) rotate(0deg); }
          7%   { opacity: 1; transform: scale(1) rotate(45deg); }
          16%  { opacity: 0; transform: scale(0) rotate(90deg); }
          100% { opacity: 0; transform: scale(0) rotate(90deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pa-shine-logo .pa-shine, .pa-shine-logo .pa-spark { animation: none; opacity: 0; }
        }
      `}</style>
    </span>
  );
}
