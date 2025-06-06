'use client';

import React, { useEffect, useState } from 'react';

interface FlowPoint {
  id: number;
  y: number;
  x: number;
  opacity: number;
  size: number;
  delay: number;
  color: 'blue' | 'purple' | 'cyan' | 'pink';
  speed: number;
  section: number;
}

interface RiverSection {
  startY: number;
  endY: number;
  direction: 'right' | 'left';
  curveIntensity: number;
}

const colorClasses = {
  blue: 'border-blue-400/40 text-blue-400',
  purple: 'border-purple-400/40 text-purple-400',
  cyan: 'border-cyan-400/40 text-cyan-400',
  pink: 'border-pink-400/40 text-pink-400',
};

const bgColorClasses = {
  blue: 'bg-blue-500/10',
  purple: 'bg-purple-500/10',
  cyan: 'bg-cyan-500/10',
  pink: 'bg-pink-500/10',
};

export default function ParallaxFlowPoints() {
  const [scrollY, setScrollY] = useState(0);
  const [flowPoints, setFlowPoints] = useState<FlowPoint[]>([]);
  const [windowHeight, setWindowHeight] = useState(0);
  const [riverSections, setRiverSections] = useState<RiverSection[]>([]);

  // Define river sections for different parts of the page
  useEffect(() => {
    const sections: RiverSection[] = [
      { startY: 0, endY: 400, direction: 'right', curveIntensity: 1.2 },      // Header to Upload
      { startY: 400, endY: 800, direction: 'left', curveIntensity: 1.5 },    // Upload to Settings
      { startY: 800, endY: 1200, direction: 'right', curveIntensity: 1.3 },  // Settings to LLM Config
      { startY: 1200, endY: 1600, direction: 'left', curveIntensity: 1.4 },  // LLM Config to Translation
      { startY: 1600, endY: 2000, direction: 'right', curveIntensity: 1.1 }, // Translation to Results
      { startY: 2000, endY: 2400, direction: 'left', curveIntensity: 1.0 },  // Results and beyond
    ];
    setRiverSections(sections);
  }, []);

  // Initialize flow points
  useEffect(() => {
    if (riverSections.length === 0) return;
    
    const updateWindowHeight = () => {
      setWindowHeight(window.innerHeight);
    };
    
    updateWindowHeight();
    window.addEventListener('resize', updateWindowHeight);
    
    const points: FlowPoint[] = [];
    const colors: Array<'blue' | 'purple' | 'cyan' | 'pink'> = ['blue', 'purple', 'cyan', 'pink'];
    
    for (let i = 0; i < 12; i++) {
      const sectionIndex = Math.floor(i / 2);
      const section = riverSections[sectionIndex] || riverSections[riverSections.length - 1];
      
      points.push({
        id: i,
        y: i * 200 + Math.random() * 100,
        x: section?.direction === 'right' ? 10 : 60,
        opacity: Math.random() * 0.4 + 0.3,
        size: Math.random() * 16 + 12,
        delay: Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 0.1 + Math.random() * 0.2,
        section: sectionIndex,
      });
    }
    
    setFlowPoints(points);
    
    return () => window.removeEventListener('resize', updateWindowHeight);
  }, [riverSections]);

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  // Calculate river path position
  const getRiverPosition = (y: number, section: RiverSection | undefined) => {
    if (!section) return { x: 30, curve: 0 };
    
    const progress = Math.max(0, Math.min(1, (y - section.startY) / (section.endY - section.startY)));
    const baseX = section.direction === 'right' ? 10 : 60;
    const targetX = section.direction === 'right' ? 60 : 10;
    
    // Create S-curve effect
    const easeProgress = 0.5 * (1 + Math.sin((progress - 0.5) * Math.PI));
    const x = baseX + (targetX - baseX) * easeProgress;
    
    // Add sinusoidal curve for river-like flow
    const curve = Math.sin(progress * Math.PI * section.curveIntensity) * 15;
    
    return { x: x + curve, curve };
  };

  if (!windowHeight) return null;

  return (
    <div className="fixed left-0 top-0 w-24 h-full pointer-events-none z-10 overflow-hidden">
      {/* River path background */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        style={{ height: '200vh' }}
        viewBox="0 0 96 2000"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="riverGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="25%" stopColor="rgba(147, 51, 234, 0.1)" />
            <stop offset="50%" stopColor="rgba(6, 182, 212, 0.1)" />
            <stop offset="75%" stopColor="rgba(236, 72, 153, 0.1)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* River path */}
        <path
          d={`M 30 0 ${riverSections.map((section) => {
            const steps = 20;
            let path = '';
            for (let i = 0; i <= steps; i++) {
              const progress = i / steps;
              const y = section.startY + (section.endY - section.startY) * progress;
              const { x } = getRiverPosition(y, section);
              path += `L ${x} ${y * 0.5} `;
            }
            return path;
          }).join(' ')}`}
          stroke="url(#riverGradient)"
          strokeWidth="3"
          fill="none"
          opacity="0.6"
        />
      </svg>
      
      {/* Animated flow points */}
      {flowPoints.map((point) => {
        const parallaxOffset = scrollY * point.speed;
        const yPosition = point.y - parallaxOffset;
        const isVisible = yPosition > -100 && yPosition < windowHeight + 100;
        
        if (!isVisible) return null;
        
        const currentSection = riverSections.find(section => 
          yPosition >= section.startY && yPosition <= section.endY
        ) || riverSections[Math.floor(point.section) % riverSections.length];
        
        const { x, curve } = getRiverPosition(yPosition, currentSection);
        const flowProgress = (scrollY * 0.01 + point.delay) % 2;
        const pulseEffect = 1 + 0.3 * Math.sin(scrollY * 0.02 + point.delay);

        return (
          <div
            key={point.id}
            className={`absolute transition-all duration-1000 ease-out flow-point ${colorClasses[point.color]} ${bgColorClasses[point.color]}`}
            style={{
              left: `${x + Math.sin(flowProgress * Math.PI) * 5}px`,
              top: `${yPosition}px`,
              width: `${point.size * pulseEffect}px`,
              height: `${point.size * pulseEffect}px`,
              opacity: point.opacity * Math.max(0.3, 1 - Math.abs(yPosition - windowHeight / 2) / (windowHeight / 2)),
              animationDelay: `${point.delay}s`,
              transform: `rotate(${curve * 2}deg)`,
              borderRadius: '50%',
              border: '1px solid currentColor',
              boxShadow: `0 0 ${point.size}px currentColor`,
            }}
          >
            {/* Connection line to river flow */}
            <div 
              className={`absolute left-1/2 top-1/2 w-px h-8 bg-gradient-to-b from-current to-transparent opacity-30`}
              style={{ 
                transform: `translate(-50%, -50%) rotate(${curve}deg)`,
                transformOrigin: 'center'
              }}
            ></div>
          </div>
        );
      })}
      
      {/* Flowing particles along the river */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => {
          const particleY = (scrollY * 0.5 + i * 300) % (windowHeight * 2);
          const currentSection = riverSections.find(section => 
            particleY >= section.startY && particleY <= section.endY
          ) || riverSections[0];
          const { x } = getRiverPosition(particleY, currentSection);
          
          return (
            <div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/70 rounded-full animate-pulse"
              style={{
                left: `${x}px`,
                top: `${particleY}px`,
                animationDelay: `${i * 0.8}s`,
                transition: 'all 0.3s ease-out',
              }}
            ></div>
          );
        })}
      </div>
      
      {/* River glow effect */}
      <div 
        className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 pointer-events-none opacity-50"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      ></div>
    </div>
  );
}
