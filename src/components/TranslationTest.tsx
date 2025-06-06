'use client';

import React, { useState } from 'react';
import { TranslationService } from '@/lib/translation-service';
import CustomSelect from './CustomSelect';

export default function TranslationTest() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gemini-2.0-flash-exp');
  const [sourceText, setSourceText] = useState('Hello, how are you?');
  const [targetLanguage, setTargetLanguage] = useState('Spanish');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testTranslation = async () => {
    if (!apiKey) {
      setError('Please enter your API key');
      return;
    }

    setLoading(true);
    setError('');
    setResult('');

    try {
      const service = new TranslationService({
        provider: 'gemini',
        apiKey,
        model,
        translationStyle: 'natural'
      });

      const translation = await service.translateText(
        sourceText,
        'English',
        targetLanguage
      );

      setResult(translation);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl mb-6 shadow-2xl">
          <span className="text-3xl">🧪</span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">Translation Lab</h1>
        <p className="text-gray-400 text-lg">Test your API configuration and translation quality</p>
      </div>

      <div className="apple-card p-8 space-y-6">        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="apple-input"
          />
        </div>        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Model
          </label>
          <CustomSelect
            value={model}
            onChange={setModel}
            options={[
              { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash Experimental' },
              { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
              { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
              { value: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B' }
            ]}
            className=""
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Text to Translate
          </label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter text to translate"
            className="apple-input h-32 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Target Language
          </label>
          <input
            type="text"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
            placeholder="e.g., Spanish, French, German"
            className="apple-input"
          />
        </div>

        <button
          onClick={testTranslation}
          disabled={loading}
          className={`apple-button w-full ${loading ? 'pulse-glow' : ''}`}
        >
          {loading ? 'Translating...' : 'Test Translation'}
        </button>

        {error && (
          <div className="apple-error border rounded-xl p-6">
            <div className="text-red-300">
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        {result && (
          <div className="apple-success border rounded-xl p-6">
            <div className="text-green-300">
              <strong>Translation:</strong>
              <div className="mt-3 text-white text-lg font-medium bg-black/20 p-4 rounded-lg border border-green-500/30">{result}</div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
        <div className="text-blue-300 text-sm">
          <strong className="text-blue-200">Need an API key?</strong>
          <ol className="mt-3 list-decimal list-inside space-y-2 text-gray-300">
            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Click &quot;Create API key&quot;</li>
            <li>Copy and paste the key above</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
