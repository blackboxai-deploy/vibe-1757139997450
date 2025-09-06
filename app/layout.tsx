import type { Metadata } from 'next'
import { Inter, Amiri } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const amiri = Amiri({ 
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap'
})

export const metadata: Metadata = {
  title: 'تعلم العربية - Learn Arabic',
  description: 'Comprehensive Arabic learning app with interactive lessons, games, and progress tracking',
  keywords: 'Arabic, learning, education, language, lessons, games, pronunciation',
  authors: [{ name: 'Arabic Learning Team' }],
  creator: 'Arabic Learning App',
  publisher: 'Arabic Learning Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://learnarabic.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'ar-SA': '/ar-SA',
    },
  },
  openGraph: {
    title: 'تعلم العربية - Learn Arabic',
    description: 'Master Arabic with interactive lessons, games, and cultural insights',
    url: 'https://learnarabic.app',
    siteName: 'Learn Arabic',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Learn Arabic App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'تعلم العربية - Learn Arabic',
    description: 'Master Arabic with interactive lessons and games',
    images: ['/twitter-image.png'],
    creator: '@learnarabicapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#059669',
      },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Learn Arabic',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'education',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#059669" />
        <meta name="color-scheme" content="light dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body 
        className={`${inter.variable} ${amiri.variable} font-sans antialiased min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative min-h-screen">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 pointer-events-none" />
            <div className="relative z-10">
              {children}
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}