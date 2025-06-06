import { VTTFile, VTTSubtitle } from '@/types';

// Parse VTT file content
export function parseVTT(content: string, fileName: string): VTTFile {
  const lines = content.split('\n');
  const subtitles: VTTSubtitle[] = [];
  let currentSubtitle: Partial<VTTSubtitle> = {};
  let index = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip WEBVTT header and empty lines
    if (line === 'WEBVTT' || line === '') continue;
    
    // Time code line (contains -->)
    if (line.includes('-->')) {
      const [startTime, endTime] = line.split('-->').map(time => time.trim());
      currentSubtitle = {
        index: index++,
        startTime,
        endTime,
        text: ''
      };
    }
    // Text line
    else if (currentSubtitle.startTime && currentSubtitle.endTime !== undefined) {
      if (currentSubtitle.text) {
        currentSubtitle.text += '\n' + line;
      } else {
        currentSubtitle.text = line;
      }
      
      // Check if next line is empty or contains time code (end of subtitle)
      if (i + 1 >= lines.length || lines[i + 1].trim() === '' || lines[i + 1].includes('-->')) {
        if (currentSubtitle.text) {
          subtitles.push(currentSubtitle as VTTSubtitle);
        }
        currentSubtitle = {};
      }
    }
  }

  return {
    name: fileName,
    content,
    subtitles,
  };
}

// Generate VTT content from subtitles
export function generateVTT(subtitles: VTTSubtitle[]): string {
  let vttContent = 'WEBVTT\n\n';
  
  subtitles.forEach(subtitle => {
    vttContent += `${subtitle.startTime} --> ${subtitle.endTime}\n`;
    vttContent += `${subtitle.text}\n\n`;
  });
  
  return vttContent;
}

// Detect language from text (simple implementation)
export function detectLanguage(text: string): string {
  const sampleText = text.toLowerCase();
  
  // Simple language detection based on common words
  if (sampleText.includes('the ') || sampleText.includes(' and ') || sampleText.includes(' is ')) {
    return 'en';
  }
  if (sampleText.includes('và ') || sampleText.includes('của ') || sampleText.includes('là ')) {
    return 'vi';
  }
  if (sampleText.includes('の ') || sampleText.includes('は ') || sampleText.includes('を ')) {
    return 'ja';
  }
  if (sampleText.includes('的 ') || sampleText.includes('是 ') || sampleText.includes('在 ')) {
    return 'zh';
  }
  if (sampleText.includes('el ') || sampleText.includes('la ') || sampleText.includes('es ')) {
    return 'es';
  }
  if (sampleText.includes('le ') || sampleText.includes('la ') || sampleText.includes('est ')) {
    return 'fr';
  }
  
  return 'auto'; // Default to auto-detect
}

// Language names mapping
export const LANGUAGE_NAMES: Record<string, string> = {
  'auto': 'Auto Detect',
  'en': 'English',
  'vi': 'Vietnamese',
  'ja': 'Japanese',
  'zh': 'Chinese',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'ko': 'Korean',
  'pt': 'Portuguese',
  'ru': 'Russian',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'it': 'Italian',
  'nl': 'Dutch',
};

// Generate translated filename with language extension
export function generateTranslatedFilename(originalFilename: string, targetLanguage: string): string {
  const languageName = LANGUAGE_NAMES[targetLanguage] || targetLanguage;
  
  // Remove .vtt extension
  const nameWithoutExtension = originalFilename.replace(/\.vtt$/i, '');
  
  // Check if filename already contains a language name (case insensitive)
  const existingLanguagePattern = new RegExp(`\\b(${Object.values(LANGUAGE_NAMES).join('|')})\\b`, 'i');
  const hasExistingLanguage = existingLanguagePattern.test(nameWithoutExtension);
  
  if (hasExistingLanguage) {
    // Replace existing language with new language
    const updatedName = nameWithoutExtension.replace(existingLanguagePattern, languageName);
    return `${updatedName}.vtt`;
  } else {
    // Add language to the end
    return `${nameWithoutExtension} ${languageName}.vtt`;
  }
}
