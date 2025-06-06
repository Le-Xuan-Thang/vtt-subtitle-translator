import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VTT Subtitle Translator',
  description: 'Translate VTT subtitle files using AI with stunning dark mode design',
  keywords: 'subtitle, translation, VTT, AI, dark mode, Apple design',
  authors: [{ name: 'VTT Translator' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className="font-sf-pro antialiased min-h-screen">
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}
