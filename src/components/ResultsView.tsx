'use client';

import React, { useState } from 'react';
import { Download, Eye, FileText, Package, Star, CheckCircle2 } from 'lucide-react';
import JSZip from 'jszip';
import { VTTFile } from '@/types';
import { generateVTT } from '@/lib/vtt-parser';
import CustomSelect from './CustomSelect';

interface ResultsViewProps {
  originalFiles: VTTFile[];
  translatedFiles: VTTFile[];
}

export default function ResultsView({ originalFiles, translatedFiles }: ResultsViewProps) {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'original' | 'translated' | 'both'>('both');

  if (translatedFiles.length === 0) {
    return null;
  }

  const downloadSingleFile = (file: VTTFile, isTranslated: boolean = false) => {
    const content = generateVTT(file.subtitles);
    const blob = new Blob([content], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAllFiles = async () => {
    const zip = new JSZip();
    
    // Add original files
    const originalFolder = zip.folder('original');
    originalFiles.forEach(file => {
      const content = file.content || generateVTT(file.subtitles);
      originalFolder?.file(file.name, content);
    });

    // Add translated files
    const translatedFolder = zip.folder('translated');
    translatedFiles.forEach(file => {
      const content = generateVTT(file.subtitles);
      translatedFolder?.file(file.name, content);
    });

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'translated-subtitles.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentOriginal = originalFiles[selectedFileIndex];
  const currentTranslated = translatedFiles[selectedFileIndex];
  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500 rounded-2xl mb-6 shadow-2xl animate-float">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
          Translation Complete! 🎉
        </h2>
        <p className="text-gray-400 text-lg">Review and download your translated subtitles</p>
      </div>

      {/* Download Actions */}
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={downloadAllFiles}
            className="apple-button flex-1 flex items-center justify-center space-x-3 py-4 text-lg font-semibold hover:scale-105 transform transition-all duration-300"
          >
            <Package className="h-6 w-6" />
            <span>📦 Download All as ZIP</span>
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => downloadSingleFile(currentOriginal)}
              className="apple-button-secondary flex items-center space-x-2 px-6 py-4"
            >
              <FileText className="h-5 w-5" />
              <span>Original</span>
            </button>
            <button
              onClick={() => downloadSingleFile(currentTranslated, true)}
              className="apple-button-secondary flex items-center space-x-2 px-6 py-4"
            >
              <Download className="h-5 w-5" />
              <span>Translated</span>
            </button>
          </div>
        </div>
      </div>

      {/* File Selection */}
      <div className="glass-card p-8">
        <div className="flex flex-col sm:flex-row gap-6 items-center">          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
              Select File to Preview
            </label>
            <CustomSelect
              value={selectedFileIndex.toString()}
              onChange={(value) => setSelectedFileIndex(Number(value))}
              options={originalFiles.map((file, index) => ({
                value: index.toString(),
                label: file.name
              }))}
              className="text-lg"
            />
          </div>
          
          <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20">
            <button
              onClick={() => setViewMode('original')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === 'original'
                  ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setViewMode('translated')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === 'translated'
                  ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Translated
            </button>
            <button
              onClick={() => setViewMode('both')}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                viewMode === 'both'
                  ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Both
            </button>
          </div>
        </div>
      </div>      {/* Subtitle Preview */}
      <div className="glass-card p-8">
        <h3 className="text-xl font-bold text-gray-200 mb-6 flex items-center">
          <Eye className="h-6 w-6 mr-3 text-blue-400" />
          Subtitle Preview
          <Star className="h-5 w-5 ml-2 text-yellow-400" />
        </h3>
        
        <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar">
          {currentOriginal?.subtitles.map((subtitle, index) => (
            <div key={index} className="border-b border-white/10 pb-6 last:border-b-0">
              <div className="flex items-center text-sm text-gray-400 mb-4 bg-white/5 px-3 py-2 rounded-lg">
                <FileText className="w-4 h-4 mr-2" />
                <span className="font-mono">{subtitle.startTime} → {subtitle.endTime}</span>
              </div>
              
              <div className={`grid gap-6 ${viewMode === 'both' ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {(viewMode === 'original' || viewMode === 'both') && (
                  <div>
                    <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">Original</div>
                    <div className="p-4 bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 rounded-xl text-gray-200 font-medium leading-relaxed">
                      {subtitle.text}
                    </div>
                  </div>
                )}
                
                {(viewMode === 'translated' || viewMode === 'both') && currentTranslated?.subtitles[index] && (
                  <div>
                    <div className="text-xs font-semibold text-blue-400 mb-3 uppercase tracking-wide flex items-center">
                      <Star className="w-3 h-3 mr-1" />
                      Translated
                    </div>
                    <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl text-white font-medium leading-relaxed shadow-lg">
                      {currentTranslated.subtitles[index].text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
