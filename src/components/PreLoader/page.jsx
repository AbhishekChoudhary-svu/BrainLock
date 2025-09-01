"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useMotionValueEvent,
} from "framer-motion";

export default function Preloader({ children }) {
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(0);

  const count = useMotionValue(0);

  // Sync count -> React state for % text
  useMotionValueEvent(count, "change", (latest) => {
    setDisplayCount(Math.round(latest));
  });

  // SVG height = 200, so map 0–100 → start 200px (hidden) → 0px (filled)
  const liquidY = useTransform(count, [0, 100], [200, 0]);

  useEffect(() => {
    // Animate count 0 → 100
    const controls = animate(count, 100, {
      duration: 6,
      ease: "easeInOut",
    });

    // Hide loader once animation completes
    const timer = setTimeout(() => setLoading(false), 6000);

    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-slate-950 text-white z-50 overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: loading ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* SVG logo with wave mask */}
          <svg viewBox="0 0 800 200" className="w-[80%] max-w-5xl">
            <defs>
              <linearGradient id="text-gradient" gradientTransform="rotate(90)">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>

              <mask id="wave-mask">
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dy=".35em"
                  fontSize="120"
                  fontWeight="900"
                  fill="white"
                >
                  BrainLock
                </text>
              </mask>
            </defs>

            {/* Background text (outline/gray) */}
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".35em"
              fontSize="120"
              fontWeight="900"
              fill="#444"
            >
              BrainLock
            </text>

            {/* Liquid fill with synced Y position */}
            <g mask="url(#wave-mask)">
              {/* BIG rect (acts like the "water") */}
              <motion.rect
                style={{ y: liquidY }}
                width="800"
                height="200"
                fill="url(#text-gradient)"
              />

              {/* Animated wave overlay */}
              <motion.path
                d="M0 100 Q 50 80, 100 100 T 200 100 T 300 100 T 400 100 T 500 100 T 600 100 T 700 100 T 800 100 V200 H0 Z"
                fill="white"
                animate={{ x: [10, 100, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              />
            </g>
          </svg>

          {/* Loading counter */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 text-sm font-light"
          >
            loading... {displayCount} %
          </motion.p>
        </motion.div>
      )}

      {/* Show children after preloader */}
      <div
        className={`${
          loading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-1000`}
      >
        {children}
      </div>
    </>
  );
}
