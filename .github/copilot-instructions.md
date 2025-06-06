<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# VTT Subtitle Translator - Copilot Instructions

This is a Next.js TypeScript application for translating VTT subtitle files using AI services.

## Project Structure
- `/src/app` - Next.js App Router pages and layouts
- `/src/components` - React components with Apple-inspired design
- `/src/lib` - Utility functions and services
- `/src/types` - TypeScript type definitions

## Key Technologies
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling (Apple-inspired design system)
- AI translation services for translations
- JSZip for file compression
- Lucide React for icons

## Design Principles
- Follow Apple design guidelines (clean, minimal, functional)
- Use custom CSS classes: `apple-card`, `apple-button`, `apple-input`, `apple-select`
- Maintain consistent spacing and typography
- Implement smooth transitions and hover effects
- Use backdrop blur and glassmorphism effects

## Code Standards
- Use TypeScript strict mode
- Implement proper error handling
- Add loading states for async operations
- Use React hooks appropriately
- Follow Next.js best practices for performance
- Implement accessibility features

## API Integration
- AI translation services for translation services
- Store API keys locally (localStorage)
- Implement proper error handling for API calls
- Add progress tracking for batch operations

## File Processing
- Parse VTT files correctly (WEBVTT format)
- Handle multiple file uploads
- Generate proper VTT output format
- Support batch processing with progress indication

## Fix bugs:
If you meet issues
- "npm: The term 'npm' is not recognized as a name of a cmdlet, function, script file, or executable program.
Check the spelling of the name, or if a path was included, verify that the path is correct and try again."

solution :  $env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("PATH","User"); node --version && npm run dev 
