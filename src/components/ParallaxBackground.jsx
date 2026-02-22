import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ParallaxBackground = ({ children }) => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, 150]);
  const y3 = useTransform(scrollY, [0, 500], [0, 200]);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Background layers */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: y1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        
        {/* Animated grid pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #f97316 1px, transparent 1px),
              linear-gradient(to bottom, #f97316 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </motion.div>

      {/* Floating elements */}
      <motion.div 
        className="absolute top-1/4 left-10 w-72 h-72 bg-gradient-to-br from-orange-600/10 to-amber-600/10 rounded-full blur-3xl"
        style={{ y: y2 }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/4 right-10 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-yellow-500/10 rounded-full blur-3xl"
        style={{ y: y3 }}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default ParallaxBackground;