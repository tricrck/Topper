import React, { useEffect } from 'react';

const Loader = ({ size = "50", stroke = "4", speed = "2", color = "black" }) => {
  useEffect(() => {
    // Dynamically import the loader script
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/ldrs/dist/auto/cardio.js';
    document.head.appendChild(script);

    // Cleanup
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center p-4">
      <l-cardio
        size={size}
        stroke={stroke}
        speed={speed}
        color={color}
      ></l-cardio>
    </div>
  );
};

export default Loader;