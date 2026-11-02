import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Knowra — Open Source Multilingual Knowledge Infrastructure',
  description:
    'Reliable, source-backed knowledge accessible across languages. Knowledge Without Boundaries.',
  keywords: [
    'knowledge',
    'open source',
    'multilingual',
    'bengali',
    'research',
    'education',
    'verified sources',
  ],
  authors: [{ name: 'Knowra Community' }],
  metadataBase: new URL('https://knowra.org'),
  openGraph: {
    title: 'Knowra — Knowledge Without Boundaries',
    description:
      'Discover, understand, and share reliable knowledge in your language.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-accent/20">
        {children}
      </body>
    </html>
  );
}
