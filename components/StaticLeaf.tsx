import React from 'react';

interface StaticLeafProps {
  x: number;
  y: number;
}

const StaticLeaf: React.FC<StaticLeafProps> = ({ x, y }) => {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 9999,
        opacity: 1,
        transform: 'scale(2)'
      }}
    >
      <svg
        width="30"
        height="36"
        viewBox="0 0 30 36"
        fill="none"
      >
        {/* Thai Basil leaf */}
        <path
          d="M15 1 C10 2 6 5 4 10 C2 15 2 21 4 26 C6 31 10 34 15 36 C20 34 24 31 26 26 C28 21 28 15 26 10 C24 5 20 2 15 1"
          fill="#22c55e"
        />
        {/* Central vein */}
        <path
          d="M15 1 L15 36"
          stroke="#16a34a"
          strokeWidth="0.8"
        />
      </svg>
    </div>
  );
};

export default StaticLeaf;