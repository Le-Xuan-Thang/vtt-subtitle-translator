import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMConfig, TranslationStyle, TRANSLATION_STYLES } from '@/types';

export class TranslationService {
  private genAI: GoogleGenerativeAI | null = null;

  constructor(private config: LLMConfig) {
    if (config.provider === 'gemini' && config.apiKey) {
      this.genAI = new GoogleGenerativeAI(config.apiKey);
    }
  }
  async translateText(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string> {
    if (!this.genAI) {
      throw new Error('Translation service not configured. Please check your API key.');
    }

    if (!this.config.apiKey) {
      throw new Error('API key is required. Please configure your Gemini API key.');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.config.model });
        const styleDescription = TRANSLATION_STYLES[this.config.translationStyle as TranslationStyle] || 
                             TRANSLATION_STYLES.subtitle;

      // Use custom requirements if specified
      const translationInstructions = this.config.translationStyle === 'custom' && this.config.customRequirements
        ? this.config.customRequirements
        : styleDescription;

      const prompt = `You are a professional subtitle translator. Translate the following subtitle text from ${sourceLanguage} to ${targetLanguage}.

Translation Style: ${translationInstructions}

Rules:
1. Keep the translation concise and suitable for subtitles
2. Preserve the meaning and tone
3. Use natural, fluent language
4. Keep line breaks if present
5. Don't add any explanations or notes
6. Only return the translated text
7. Keep the techical terms in brackets [] after translate it
8. Each sentence must be conect each other, current part need to check previous and after to have final meaning.

Text to translate:
"${text}"`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error: any) {
      console.error('Translation error:', error);
      
      // Handle specific error types
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key and try again.');
      }
      
      if (error.message?.includes('PERMISSION_DENIED')) {
        throw new Error('Permission denied. Please check your API key permissions for the selected model.');
      }
      
      if (error.message?.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      }
      
      if (error.message?.includes('MODEL_NOT_FOUND')) {
        throw new Error(`Model "${this.config.model}" not found. Please select a different model.`);
      }
      
      if (error.message?.includes('RATE_LIMIT_EXCEEDED')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      
      // Generic error fallback
      throw new Error(`Translation failed: ${error.message || 'Unknown error occurred'}. Please check your API key and model selection.`);
    }
  }  async translateBatch(
    texts: string[],
    sourceLanguage: string,
    targetLanguage: string,
    onProgress?: (completed: number, total: number) => void
  ): Promise<string[]> {
    if (!this.genAI) {
      throw new Error('Translation service not configured. Please check your API key.');
    }

    if (!this.config.apiKey) {
      throw new Error('API key is required. Please configure your Gemini API key.');
    }

    if (texts.length === 0) {
      return [];
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: this.config.model });
        const styleDescription = TRANSLATION_STYLES[this.config.translationStyle as TranslationStyle] || 
                             TRANSLATION_STYLES.subtitle;

      // Use custom requirements if specified
      const translationInstructions = this.config.translationStyle === 'custom' && this.config.customRequirements
        ? this.config.customRequirements
        : styleDescription;

      // Create numbered list of texts for batch translation
      const numberedTexts = texts.map((text, index) => `${index + 1}. "${text}"`).join('\n');

      const prompt = `You are a professional subtitle translator. Translate ALL the following subtitle texts from ${sourceLanguage} to ${targetLanguage}.

Translation Style: ${translationInstructions}

Rules:
1. Keep translations concise and suitable for subtitles
2. Preserve the meaning and tone
3. Use natural, fluent language
4. Keep line breaks if present within each subtitle
5. Keep technical terms in brackets
6. Return ONLY the translated texts in the same numbered format
7. Do not add any explanations or notes
8. Maintain the exact same numbering (1., 2., 3., etc.)

Subtitle texts to translate:
${numberedTexts}

Return format: Each translated text on a new line with its number:
1. "translated text 1"
2. "translated text 2"
etc.`;

      if (onProgress) {
        onProgress(0, texts.length);
      }

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const translatedContent = response.text().trim();

      // Parse the numbered response back into an array
      const translatedTexts = this.parseNumberedResponse(translatedContent, texts.length);

      if (onProgress) {
        onProgress(texts.length, texts.length);
      }

      return translatedTexts;
    } catch (error: any) {
      console.error('Batch translation error:', error);
      
      // Handle specific error types
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key and try again.');
      }
      
      if (error.message?.includes('PERMISSION_DENIED')) {
        throw new Error('Permission denied. Please check your API key permissions for the selected model.');
      }
      
      if (error.message?.includes('QUOTA_EXCEEDED') || error.message?.includes('429') || error.message?.includes('quota')) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again, or switch to a different model like "gemini-1.5-flash" which has higher quotas.');
      }
      
      if (error.message?.includes('MODEL_NOT_FOUND')) {
        throw new Error(`Model "${this.config.model}" not found. Please select a different model.`);
      }
      
      // Generic error fallback
      throw new Error(`Batch translation failed: ${error.message || 'Unknown error occurred'}. Please check your API key and model selection.`);
    }
  }

  private parseNumberedResponse(response: string, expectedCount: number): string[] {
    const lines = response.split('\n').filter(line => line.trim());
    const results: string[] = [];
    
    for (let i = 0; i < expectedCount; i++) {
      const expectedNumber = i + 1;
      const pattern = new RegExp(`^${expectedNumber}\\.\\s*["']?(.*?)["']?$`);
      
      // Find the line that matches this number
      const matchingLine = lines.find(line => pattern.test(line.trim()));
      
      if (matchingLine) {
        const match = matchingLine.trim().match(pattern);
        if (match && match[1]) {
          results.push(match[1].trim());
        } else {
          // Fallback: use original text if parsing fails
          results.push(lines[i]?.replace(/^\d+\.\s*["']?/, '').replace(/["']?$/, '') || '');
        }
      } else {
        // Fallback: try to use the line at this index
        const fallbackLine = lines[i];
        if (fallbackLine) {
          const cleaned = fallbackLine.replace(/^\d+\.\s*["']?/, '').replace(/["']?$/, '').trim();
          results.push(cleaned || '');
        } else {
          results.push(''); // Empty if no line found
        }
      }
    }
    
    return results;
  }
}

export const LLM_PROVIDERS = [
  {
    id: 'gemini',
    name: 'AI Translation',
    apiKeyRequired: true,
    models: [
      'gemini-2.0-flash-exp',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.5-flash-8b'
    ]
  }
];

export const DEFAULT_LLM_CONFIG: LLMConfig = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.0-flash-exp',
  translationStyle: 'subtitle',
  customRequirements: ''
};
