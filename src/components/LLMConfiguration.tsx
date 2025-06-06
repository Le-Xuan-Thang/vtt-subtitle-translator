'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Cpu, Key, Settings, Info, MessageSquare } from 'lucide-react';
import { LLMConfig, TRANSLATION_STYLES } from '@/types';
import { LLM_PROVIDERS } from '@/lib/translation-service';
import CustomSelect from './CustomSelect';

interface LLMConfigurationProps {
  config: LLMConfig;
  onConfigChange: (config: LLMConfig) => void;
}

export default function LLMConfiguration({ config, onConfigChange }: LLMConfigurationProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  const handleProviderChange = (provider: string) => {
    const providerInfo = LLM_PROVIDERS.find(p => p.id === provider);
    onConfigChange({
      ...config,
      provider,
      model: providerInfo?.models?.[0] || 'gemini-1.5-pro'
    });
  };

  const handleModelChange = (model: string) => {
    onConfigChange({
      ...config,
      model
    });
  };

  const handleApiKeyChange = (apiKey: string) => {
    onConfigChange({
      ...config,
      apiKey
    });
  };
  const handleStyleChange = (style: string) => {
    onConfigChange({
      ...config,
      translationStyle: style
    });
  };

  const handleCustomRequirementsChange = (requirements: string) => {
    onConfigChange({
      ...config,
      customRequirements: requirements
    });
  };

  const currentProvider = LLM_PROVIDERS.find(p => p.id === config.provider);  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-400 to-red-500 rounded-2xl mb-6 shadow-2xl animate-float">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
          AI Configuration
        </h2>
        <p className="text-gray-400 text-lg">Configure your translation engine</p>
      </div>

      <div className="glass-card p-8 space-y-8">        {/* Provider Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            AI Provider
          </label>
          <CustomSelect
            value={config.provider}
            onChange={handleProviderChange}
            options={LLM_PROVIDERS.map(provider => ({
              value: provider.id,
              label: provider.name
            }))}
            className="text-lg"
          />
        </div>

        {/* API Key */}
        {currentProvider?.apiKeyRequired && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300 flex items-center">
              <Key className="w-4 h-4 mr-2" />
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={config.apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="Enter your API key"
                className="apple-input pr-12 text-lg"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {showApiKey ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
            <div className="flex items-center text-sm text-emerald-400">
              <Info className="w-4 h-4 mr-2" />
              <span>Your API key is stored locally and never sent to our servers</span>
            </div>
          </div>
        )}        {/* Model Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300 flex items-center">
            <Cpu className="w-4 h-4 mr-2" />
            Model
          </label>
          <CustomSelect
            value={config.model}
            onChange={handleModelChange}
            options={currentProvider?.models?.map(model => ({
              value: model,
              label: `${model}${model === 'gemini-2.0-flash-exp' ? ' (Limited quota - 10/min)' : ''}${model === 'gemini-1.5-flash' ? ' (Recommended)' : ''}`
            })) || []}
            className="text-lg"
          />
          {config.model === 'gemini-2.0-flash-exp' && (
            <div className="flex items-center space-x-2 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>⚠️ Experimental model has limited quota (10 requests/minute). Consider using &quot;gemini-1.5-flash&quot; for better performance.</span>
            </div>
          )}
        </div>        {/* Translation Style */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-300 flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Translation Style
          </label>
          <CustomSelect
            value={config.translationStyle}
            onChange={handleStyleChange}
            options={Object.entries(TRANSLATION_STYLES).map(([key, description]) => ({
              value: key,
              label: `${key.charAt(0).toUpperCase() + key.slice(1)} - ${description}`
            }))}
            className="text-lg"
          />
        </div>

        {/* Custom Requirements */}
        {config.translationStyle === 'custom' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-300 flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              Custom Translation Requirements
            </label>
            <textarea
              value={config.customRequirements || ''}
              onChange={(e) => handleCustomRequirementsChange(e.target.value)}
              placeholder="Enter your specific translation requirements, style preferences, terminology, or any special instructions..."
              className="apple-input resize-none h-32 text-lg"
              rows={4}
            />
            <div className="flex items-center text-sm text-blue-400">
              <Info className="w-4 h-4 mr-2" />
              <span>Specify your exact needs: tone, terminology, audience, formatting, etc.</span>
            </div>
          </div>
        )}

        {/* API Key Help */}
        {config.provider === 'gemini' && !config.apiKey && (
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-6 rounded-2xl backdrop-blur-sm">
            <div className="text-blue-300">
              <div className="flex items-center mb-3">
                <Key className="w-5 h-5 mr-2" />
                <strong>Get your Gemini API Key:</strong>
              </div>
              <ol className="mt-2 list-decimal list-inside space-y-2 text-sm">
                <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-200 transition-colors">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Click &quot;Create API key&quot;</li>
                <li>Copy and paste the key above</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
