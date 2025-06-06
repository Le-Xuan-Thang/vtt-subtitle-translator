'use client';

import React from 'react';
import { Globe, Sparkles } from 'lucide-react';
import { TranslationSettings } from '@/types';
import { LANGUAGE_NAMES } from '@/lib/vtt-parser';
import CustomSelect from './CustomSelect';

interface TranslationSettingsProps {
  settings: TranslationSettings;
  onSettingsChange: (settings: TranslationSettings) => void;
  detectedLanguages: string[];
}

export default function TranslationSettingsComponent({ 
  settings, 
  onSettingsChange, 
  detectedLanguages 
}: TranslationSettingsProps) {
  const handleSourceLanguageChange = (language: string) => {
    onSettingsChange({
      ...settings,
      sourceLanguage: language,
      autoDetect: language === 'auto'
    });
  };

  const handleTargetLanguageChange = (language: string) => {
    onSettingsChange({
      ...settings,
      targetLanguage: language
    });
  };

  const availableSourceLanguages = ['auto', ...Object.keys(LANGUAGE_NAMES).filter(lang => lang !== 'auto')];
  const availableTargetLanguages = Object.keys(LANGUAGE_NAMES).filter(lang => lang !== 'auto');
  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 rounded-2xl mb-6 shadow-2xl animate-float">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
          Translation Settings
        </h2>
        <p className="text-gray-400 text-lg">Configure source and target languages</p>
      </div>

      <div className="glass-card p-8 space-y-8">
        {/* Detected Languages Display */}
        {detectedLanguages.length > 0 && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 p-6 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center mb-4">
              <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="font-semibold text-blue-300">Detected Languages</h3>
            </div>
            <div className="flex flex-wrap gap-3">              {Array.from(new Set(detectedLanguages)).map(lang => (
                <span
                  key={lang}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg animate-pulse"
                >
                  {LANGUAGE_NAMES[lang] || lang}
                </span>
              ))}
            </div>
          </div>
        )}        {/* Source Language */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Source Language
          </label>
          <CustomSelect
            value={settings.sourceLanguage}
            onChange={handleSourceLanguageChange}
            options={availableSourceLanguages.map(lang => ({
              value: lang,
              label: LANGUAGE_NAMES[lang]
            }))}
            className="text-lg"
          />
          {settings.autoDetect && (
            <div className="flex items-center space-x-2 text-sm text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Language will be automatically detected from the content</span>
            </div>
          )}
        </div>        {/* Target Language */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300">
            Target Language
          </label>
          <CustomSelect
            value={settings.targetLanguage}
            onChange={handleTargetLanguageChange}
            options={availableTargetLanguages.map(lang => ({
              value: lang,
              label: LANGUAGE_NAMES[lang]
            }))}
            className="text-lg"
          />
        </div>

        {/* Quick Vietnamese Selection */}
        <div className="flex items-center space-x-4 pt-4">
          <button
            onClick={() => handleTargetLanguageChange('vi')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              settings.targetLanguage === 'vi'
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg transform scale-105'
                : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
            }`}
          >
            🇻🇳 Vietnamese
          </button>
          <span className="text-sm text-gray-500">Quick select</span>
        </div>
      </div>
    </div>
  );
}
