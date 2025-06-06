'use client';

import React from 'react';
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
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-4 shadow-lg">
          <span className="text-2xl">🌐</span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3">Translation Settings</h2>
        <p className="text-gray-400">Configure source and target languages</p>
      </div>

      <div className="apple-card p-8 space-y-8">
        {/* Detected Languages Display */}
        {detectedLanguages.length > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl">
            <h3 className="font-medium text-emerald-200 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Detected Languages
            </h3>
            <div className="flex flex-wrap gap-3">
              {Array.from(new Set(detectedLanguages)).map(lang => (
                <span
                  key={lang}
                  className="px-3 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium border border-emerald-500/30"
                >
                  {LANGUAGE_NAMES[lang] || lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Source Language */}        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Source Language
          </label>
          <CustomSelect
            value={settings.sourceLanguage}
            onChange={handleSourceLanguageChange}
            options={availableSourceLanguages.map(lang => ({
              value: lang,
              label: LANGUAGE_NAMES[lang]
            }))}
            className=""
          />
          {settings.autoDetect && (
            <p className="text-sm text-blue-400 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
              Language will be automatically detected from your files
            </p>
          )}
        </div>        {/* Target Language */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Target Language
          </label>
          <CustomSelect
            value={settings.targetLanguage}
            onChange={handleTargetLanguageChange}
            options={availableTargetLanguages.map(lang => ({
              value: lang,
              label: LANGUAGE_NAMES[lang]
            }))}
            className=""
          />
        </div>

        {/* Quick Language Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Quick Select
          </label>
          <div className="flex flex-wrap gap-3">
            {['vi', 'es', 'fr', 'de', 'ja', 'ko'].map(lang => (
              <button
                key={lang}
                onClick={() => handleTargetLanguageChange(lang)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  settings.targetLanguage === lang
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white border border-white/20'
                }`}
              >
                {LANGUAGE_NAMES[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
