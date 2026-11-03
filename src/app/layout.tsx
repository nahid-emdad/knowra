import type { Metadata } from 'next';
import { Poppins, Raleway, Noto_Sans_Bengali } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-raleway',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bengali',
  display: 'swap',
});

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
    <html
      lang="en"
      className={`${poppins.variable} ${raleway.variable} ${notoSansBengali.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-accent/20">
        {children}
      </body>
    </html>
  );
}
