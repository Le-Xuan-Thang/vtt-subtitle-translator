# VTT Subtitle Translator

A modern, AI-powered subtitle translation application with Apple-inspired design. Translate VTT subtitle files using advanced AI language models.

## Features

- **Multi-file Upload**: Upload and process multiple VTT files simultaneously
- **Auto Language Detection**: Automatically detect source language from subtitle content
- **AI Translation**: Powered by advanced language models for accurate translations
- **Translation Styles**: Choose from various translation styles (formal, casual, literal, natural, subtitle-optimized)
- **Real-time Preview**: Side-by-side comparison of original and translated subtitles
- **Batch Download**: Download all files as a ZIP archive
- **Apple-inspired UI**: Beautiful, modern interface following Apple design principles
- **Local Processing**: Your API keys and files remain secure on your device

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- An AI service API key (such as Google Gemini from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vtt-translator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. **Upload Files**: Drag and drop or select multiple VTT files
2. **Configure Translation**: Set source and target languages (Vietnamese is pre-selected)
3. **Configure LLM**: Enter your API key and select model/translation style
4. **Translate**: Start the translation process and monitor progress
5. **Download**: Download individual files or all files as ZIP

## Supported Languages

- English
- Vietnamese (default target)
- Japanese
- Chinese
- Spanish
- French
- German
- Korean
- Portuguese
- Russian
- Arabic
- Hindi
- Thai
- Italian
- Dutch

## API Configuration

### AI Translation Service

1. Get an API key from your preferred AI service provider
2. Enter the key in the LLM Configuration section
3. Choose between available models based on your needs:
   - **Latest Models** (Newest features, recommended)
   - **High Quality Models** (Best accuracy)
   - **Fast Models** (Quick processing)
   - **Compact Models** (Efficient)

### Troubleshooting API Issues

If you encounter API key errors:

1. **Check Model Availability**: Some models may not be available in all regions
2. **Verify API Key**: Ensure your API key is valid and has proper permissions
3. **Test Translation**: Use the test page at `/test` to debug API issues
4. **Rate Limits**: The app includes automatic rate limiting to prevent quota exceeded errors

### Testing

Visit `/test` to test your API configuration before processing files. This page allows you to:
- Test different models
- Verify your API key works
- Check translation quality
- Debug any issues

## Translation Styles

- **Formal**: Professional and formal translations
- **Casual**: Conversational and relaxed translations
- **Literal**: Word-for-word translations
- **Natural**: Fluent and natural-sounding translations
- **Subtitle**: Optimized for subtitle display (default, recommended)

## Technology Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **AI Translation** - Advanced language models
- **JSZip** - File compression
- **Lucide React** - Icons

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Security

- API keys are stored locally in your browser
- Files are processed entirely on your device
- No data is sent to our servers
- Translations go directly to your chosen LLM provider

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Copyright

© 2024-2025 Le Xuan Thang. All rights reserved.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
