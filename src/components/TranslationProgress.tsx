'use client';

import React, { useState } from 'react';
import { Play, Loader, CheckCircle, AlertCircle, Zap, FileText, Clock } from 'lucide-react';
import { VTTFile, LLMConfig, TranslationSettings } from '@/types';
import { TranslationService } from '@/lib/translation-service';
import { LANGUAGE_NAMES, generateTranslatedFilename } from '@/lib/vtt-parser';

interface TranslationProgressProps {
  files: VTTFile[];
  llmConfig: LLMConfig;
  translationSettings: TranslationSettings;
  onTranslationComplete: (translatedFiles: VTTFile[]) => void;
}

export default function TranslationProgress({
  files,
  llmConfig,
  translationSettings,
  onTranslationComplete
}: TranslationProgressProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [error, setError] = useState('');
  const [translatedFiles, setTranslatedFiles] = useState<VTTFile[]>([]);

  const canTranslate = files.length > 0 && llmConfig.apiKey && translationSettings.targetLanguage;

  const startTranslation = async () => {
    if (!canTranslate) return;

    setIsTranslating(true);
    setProgress(0);
    setError('');
    setTranslatedFiles([]);

    try {
      const translationService = new TranslationService(llmConfig);
      const results: VTTFile[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setCurrentFile(file.name);
        
        const sourceLanguage = translationSettings.autoDetect 
          ? (file.detectedLanguage || 'en')
          : translationSettings.sourceLanguage;

        // Extract all subtitle texts
        const textsToTranslate = file.subtitles.map(sub => sub.text);
          // Translate all texts in one batch request
        const translatedTexts = await translationService.translateBatch(
          textsToTranslate,
          LANGUAGE_NAMES[sourceLanguage] || sourceLanguage,
          LANGUAGE_NAMES[translationSettings.targetLanguage] || translationSettings.targetLanguage,
          (completed, total) => {
            // Since we're doing batch translation, show file-level progress
            const fileProgress = (i / files.length) + (completed === total ? 1 / files.length : 0);
            setProgress(Math.round(fileProgress * 100));
          }
        );

        // Create translated subtitles
        const translatedSubtitles = file.subtitles.map((subtitle, index) => ({
          ...subtitle,
          text: translatedTexts[index] || subtitle.text
        }));        // Create translated file
        const translatedFile: VTTFile = {
          ...file,
          name: generateTranslatedFilename(file.name, translationSettings.targetLanguage),
          subtitles: translatedSubtitles,
          content: '' // Will be generated when downloading
        };

        results.push(translatedFile);
        setTranslatedFiles([...results]);
      }

      setProgress(100);
      onTranslationComplete(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Translation failed');
    } finally {
      setIsTranslating(false);
      setCurrentFile('');
    }
  };
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-400 via-purple-400 to-indigo-500 rounded-2xl mb-6 shadow-2xl animate-float">
          <Zap className="w-8 h-8 text-white" />
        </div>        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
          Translation Engine
        </h2>
        <p className="text-gray-400 text-lg">AI-powered batch translation • One request per file</p>
        <div className="inline-flex items-center space-x-2 mt-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span className="text-sm text-emerald-300 font-medium">Optimized for speed & efficiency</span>
        </div>
      </div>

      <div className="glass-card p-8 space-y-8">
        {/* Translation Summary */}
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-6 rounded-2xl backdrop-blur-sm">
          <h3 className="font-semibold text-indigo-300 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Translation Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{files.length}</div>
              <div className="text-gray-400">Files</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-emerald-400 mb-1">
                {translationSettings.autoDetect 
                  ? 'Auto Detect' 
                  : LANGUAGE_NAMES[translationSettings.sourceLanguage]}
              </div>
              <div className="text-gray-400">From Language</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-400 mb-1">
                {LANGUAGE_NAMES[translationSettings.targetLanguage]}
              </div>
              <div className="text-gray-400">To Language</div>
            </div>
          </div>
        </div>

        {/* File List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-300 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Files to Translate
          </h3>
          <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="font-medium text-white">{file.name}</div>
                    <div className="text-sm text-gray-400 flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {file.subtitles.length} subtitles
                    </div>
                  </div>
                </div>
                {translatedFiles.find(tf => tf.name.includes(file.name.replace('.vtt', ''))) && (
                  <CheckCircle className="h-6 w-6 text-emerald-400 animate-bounce" />
                )}
              </div>
            ))}
          </div>
        </div>        {/* Progress */}
        {isTranslating && (
          <div className="space-y-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Loader className="h-6 w-6 text-purple-400 animate-spin" />                <span className="font-medium text-white">
                  {currentFile ? `Batch translating all subtitles in: ${currentFile}` : 'Preparing batch translation...'}
                </span>
              </div>
              <div className="text-lg font-bold text-purple-400">{progress}%</div>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center p-6 bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/20 rounded-2xl backdrop-blur-sm">
            <AlertCircle className="h-6 w-6 text-red-400 mr-4 flex-shrink-0" />
            <div className="text-red-300 font-medium">{error}</div>
          </div>
        )}

        {/* Translate Button */}
        <div className="pt-4">
          <button
            onClick={startTranslation}
            disabled={!canTranslate || isTranslating}
            className={`apple-button w-full flex items-center justify-center space-x-3 py-4 text-lg font-semibold ${
              isTranslating ? 'animate-pulse' : 'hover:scale-105 transform transition-all duration-300'
            }`}
          >
            {isTranslating ? (
              <>
                <Loader className="h-6 w-6 animate-spin" />
                <span>Translating Magic in Progress...</span>
              </>
            ) : (
              <>
                <Play className="h-6 w-6" />
                <span>🚀 Start Translation</span>
              </>
            )}
          </button>
        </div>

        {!canTranslate && (
          <div className="text-center p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="text-yellow-300 font-medium">
              {!files.length && '📁 Please upload VTT files first'}
              {files.length > 0 && !llmConfig.apiKey && '🔑 Please configure API key'}
              {files.length > 0 && llmConfig.apiKey && !translationSettings.targetLanguage && '🌍 Please select target language'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
