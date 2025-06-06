'use client';

import React, { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import TranslationSettings from '@/components/TranslationSettings';
import LLMConfiguration from '@/components/LLMConfiguration';
import TranslationProgress from '@/components/TranslationProgress';
import ResultsView from '@/components/ResultsView';
import ParallaxFlowPoints from '@/components/ParallaxFlowPoints';
import ScrollIndicator from '@/components/ScrollIndicator';
import FloatingActionButton from '@/components/FloatingActionButton';
import { VTTFile, TranslationSettings as ITranslationSettings, LLMConfig } from '@/types';
import { DEFAULT_LLM_CONFIG } from '@/lib/translation-service';
import { useScrollHeader } from '@/hooks/useScrollHeader';

export default function Home() {
  const [files, setFiles] = useState<VTTFile[]>([]);
  const [translationSettings, setTranslationSettings] = useState<ITranslationSettings>({
    sourceLanguage: 'auto',
    targetLanguage: 'vi',
    autoDetect: true
  });
  const [llmConfig, setLlmConfig] = useState<LLMConfig>(DEFAULT_LLM_CONFIG);
  const [translatedFiles, setTranslatedFiles] = useState<VTTFile[]>([]);
  
  // Use scroll header hook for dynamic header behavior
  const { isHeaderVisible, scrollY } = useScrollHeader();

  // Load saved configuration from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('vtt-translator-config');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setLlmConfig(prev => ({ ...prev, ...config }));
      } catch (error) {
        console.error('Failed to load saved configuration:', error);
      }
    }
  }, []);

  // Save configuration to localStorage
  useEffect(() => {
    localStorage.setItem('vtt-translator-config', JSON.stringify({
      provider: llmConfig.provider,
      model: llmConfig.model,
      translationStyle: llmConfig.translationStyle,
      // Don't save API key for security
    }));
  }, [llmConfig]);

  const detectedLanguages = files
    .map(file => file.detectedLanguage)
    .filter((lang): lang is string => Boolean(lang));

  const handleTranslationComplete = (translated: VTTFile[]) => {
    setTranslatedFiles(translated);
  };  return (
    <div className="min-h-screen relative">
      {/* Scroll Progress and Indicators */}
      <ScrollIndicator />
      
      {/* Parallax Flow Points */}
      <ParallaxFlowPoints />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl float-animation"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl float-animation" 
          style={{ 
            animationDelay: '2s',
            transform: `translateY(${scrollY * -0.05}px)` 
          }}
        ></div>
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl float-animation"
          style={{ 
            animationDelay: '4s',
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.08}px)` 
          }}
        ></div>
      </div>

      {/* Header with scroll behavior */}
      <div 
        className={`glass-header fixed top-0 w-full z-50 transition-all duration-300 ${
          isHeaderVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl">
                <span className="text-2xl">🎬</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              VTT Subtitle Translator
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Transform your subtitle files with cutting-edge AI translation technology
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <a 
                href="/test" 
                className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors bg-blue-500/10 px-4 py-2 rounded-lg border border-blue-500/20"
              >
                🧪 API Testing Lab
              </a>              <div className="text-sm text-gray-500">
                Professional Subtitle Translation
              </div>
            </div>
          </div>
        </div>
      </div>      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ml-8 sm:ml-12 lg:ml-16">
        {/* Top spacing to account for fixed header */}
        <div className="h-32"></div>
          <div className="space-y-16">
          {/* Step 1: File Upload */}
          <section id="upload-section">
            <FileUpload files={files} onFilesChange={setFiles} />
          </section>

          {/* Step 2: Translation Settings */}
          {files.length > 0 && (
            <section id="settings-section">
              <TranslationSettings
                settings={translationSettings}
                onSettingsChange={setTranslationSettings}
                detectedLanguages={detectedLanguages}
              />
            </section>
          )}

          {/* Step 3: LLM Configuration */}
          {files.length > 0 && (
            <section>
              <LLMConfiguration
                config={llmConfig}
                onConfigChange={setLlmConfig}
              />
            </section>
          )}

          {/* Step 4: Translation Progress */}
          {files.length > 0 && (
            <section id="translate-section">
              <TranslationProgress
                files={files}
                llmConfig={llmConfig}
                translationSettings={translationSettings}
                onTranslationComplete={handleTranslationComplete}
              />
            </section>
          )}

          {/* Step 5: Results */}
          {translatedFiles.length > 0 && (
            <section id="results-section">
              <ResultsView
                originalFiles={files}
                translatedFiles={translatedFiles}
              />
            </section>
          )}
        </div>        {/* Footer */}        <footer className="mt-16 py-8 text-center text-gray-500 text-sm">
          <div className="space-y-2">
            <p>© 2024 Le Xuan Thang. All rights reserved.</p>
            <p>Your files are processed locally and never uploaded to our servers</p>
          </div>
        </footer>
      </div>
      
      {/* Floating Action Button */}
      <FloatingActionButton scrollY={scrollY} />
    </div>
  );
}
