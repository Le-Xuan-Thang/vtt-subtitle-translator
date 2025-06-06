'use client';

import React, { useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { VTTFile } from '@/types';
import { parseVTT, detectLanguage } from '@/lib/vtt-parser';

interface FileUploadProps {
  files: VTTFile[];
  onFilesChange: (files: VTTFile[]) => void;
}

export default function FileUpload({ files, onFilesChange }: FileUploadProps) {
  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    const vttFiles = selectedFiles.filter(file => file.name.toLowerCase().endsWith('.vtt'));
    
    if (vttFiles.length === 0) {
      alert('Please select VTT files only.');
      return;
    }

    const parsedFiles: VTTFile[] = [];
    
    for (const file of vttFiles) {
      try {
        const content = await file.text();
        const parsedFile = parseVTT(content, file.name);
        
        // Detect language from first few subtitles
        const sampleText = parsedFile.subtitles
          .slice(0, 5)
          .map(sub => sub.text)
          .join(' ');
        
        parsedFile.detectedLanguage = detectLanguage(sampleText);
        parsedFiles.push(parsedFile);
      } catch (error) {
        console.error(`Error parsing ${file.name}:`, error);
        alert(`Failed to parse ${file.name}. Please check if it's a valid VTT file.`);
      }
    }

    onFilesChange([...files, ...parsedFiles]);
    event.target.value = ''; // Reset input
  }, [files, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  }, [files, onFilesChange]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const vttFiles = droppedFiles.filter(file => file.name.toLowerCase().endsWith('.vtt'));
    
    if (vttFiles.length === 0) {
      alert('Please drop VTT files only.');
      return;
    }

    // Create a fake input event to reuse the upload logic
    const fakeInput = document.createElement('input');
    fakeInput.type = 'file';
    fakeInput.multiple = true;
    
    // Create a fake FileList
    const dt = new DataTransfer();
    vttFiles.forEach(file => dt.items.add(file));
    fakeInput.files = dt.files;
    
    handleFileUpload({ target: fakeInput } as any);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
  }, []);

  return (    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 shadow-lg">
          <Upload className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-white mb-3">Upload VTT Files</h2>
        <p className="text-gray-400">Select or drag and drop your VTT subtitle files</p>
      </div>

      <div
        className="apple-card p-12 border-2 border-dashed hover:border-blue-400 transition-all duration-300 cursor-pointer group"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => document.getElementById('file-input')?.click()}
        style={{ borderColor: 'var(--border-color)' }}
      >
        <div className="text-center">
          <div className="mb-6 relative">
            <Upload className="mx-auto h-16 w-16 text-gray-500 group-hover:text-blue-400 transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 mx-auto h-16 w-16 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <div className="text-xl font-medium text-white mb-3 group-hover:text-blue-300 transition-colors">
            Drop VTT files here or click to browse
          </div>
          <p className="text-gray-400 text-lg">
            Supports multiple .vtt files
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Secure local processing
          </div>
        </div>
        <input
          id="file-input"
          type="file"
          multiple
          accept=".vtt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-semibold text-white">Uploaded Files</h3>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30">
              {files.length} files
            </span>
          </div>
          <div className="grid gap-3">
            {files.map((file, index) => (
              <div key={index} className="apple-card p-5 flex items-center justify-between group hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <File className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-white text-lg">{file.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-400">
                        {file.subtitles.length} subtitles
                      </span>
                      {file.detectedLanguage && (
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-lg text-xs border border-green-500/30">
                          {file.detectedLanguage}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="text-gray-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
