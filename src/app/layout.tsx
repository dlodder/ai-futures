import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Futures — Trends, Impact & Strategic Readiness',
  description: 'AI education and transformation initiative. Covers AI evolution, knowledge levels, and strategic readiness frameworks.',
  openGraph: {
    title: 'AI Futures — Trends, Impact & Strategic Readiness',
    description: 'From ChatGPT to the orchestration era. AI knowledge levels, evolution timeline, and enterprise readiness.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}
