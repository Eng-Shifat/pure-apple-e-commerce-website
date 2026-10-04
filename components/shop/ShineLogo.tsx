import Image from "next/image";

/**
 * Pure Apple logo with a "Luxora-style" shine.
 * A light band sweeps across the logo every few seconds.
 * The band is masked with the logo SVG itself, so it only
 * shows on the apple / leaf / letters – never on the background.
 */
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
        style={{ display: "block", width: "100%", height: "100%" }}
      />
      <span aria-hidden="true" className="pa-shine" />

      <style>{`
        .pa-shine-logo .pa-shine {
          position: absolute; inset: 0; pointer-events: none;
          -webkit-mask-image: url(/logo/pure-apple-logo.svg);
                  mask-image: url(/logo/pure-apple-logo.svg);
          -webkit-mask-size: 100% 100%;         mask-size: 100% 100%;
          -webkit-mask-repeat: no-repeat;       mask-repeat: no-repeat;
          background: linear-gradient(
            105deg,
            rgba(255,255,255,0) 38%,
            rgba(255,255,255,0.95) 50%,
            rgba(255,255,255,0) 62%
          );
          background-size: 300% 100%;
          background-position: 130% 0;
          animation: pa-shine-sweep 3.6s ease-in-out 1s infinite;
        }
        .pa-shine-logo:hover .pa-shine { animation-duration: 1.4s; animation-delay: 0s; }
        @keyframes pa-shine-sweep {
          0%   { background-position: 130% 0; }
          35%  { background-position: -30% 0; }
          100% { background-position: -30% 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .pa-shine-logo .pa-shine { animation: none; opacity: 0; }
        }
      `}</style>
    </span>
  );
}
