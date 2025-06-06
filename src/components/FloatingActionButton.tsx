'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUp, Settings, Upload, Download, Zap } from 'lucide-react';

interface FloatingActionButtonProps {
  scrollY: number;
}

export default function FloatingActionButton({ scrollY }: FloatingActionButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Show FAB when scrolled down more than 300px
    setIsVisible(scrollY > 300);
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* Secondary Actions */}
      <div className={`flex flex-col space-y-2 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        <button
          onClick={() => scrollToSection('upload-section')}
          className="w-12 h-12 bg-blue-600/90 hover:bg-blue-600 backdrop-blur-xl rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group"
          title="Go to Upload Section"
        >
          <Upload className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={() => scrollToSection('settings-section')}
          className="w-12 h-12 bg-purple-600/90 hover:bg-purple-600 backdrop-blur-xl rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group"
          title="Go to Settings"
        >
          <Settings className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
        
        <button
          onClick={() => scrollToSection('translate-section')}
          className="w-12 h-12 bg-green-600/90 hover:bg-green-600 backdrop-blur-xl rounded-full shadow-lg transition-all duration-200 flex items-center justify-center group"
          title="Go to Translation"
        >
          <Zap className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Main FAB */}
      <div className="relative">
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
          className="w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 backdrop-blur-xl rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
          title="Scroll to Top"
        >
          <ArrowUp className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        </button>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 animate-ping"></div>
      </div>
    </div>
  );
}
