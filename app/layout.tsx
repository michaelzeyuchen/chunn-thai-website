import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  weight: ['400', '700']
});

export const metadata: Metadata = {
  metadataBase: new URL('https://chunnthai.com.au'),
  title: 'Chunn Thai Cuisine - Authentic Thai Restaurant in Menai Sydney | Opening August 2025',
  description: 'Experience authentic Thai cuisine with a modern twist at Chunn Thai, Menai\'s newest restaurant. Opening August 1st, 2025. Fresh ingredients, traditional recipes, contemporary presentation. Book your table today!',
  keywords: 'Thai restaurant Menai, Thai food Sydney, authentic Thai cuisine, Chunn Thai restaurant, Thai restaurant Sutherland Shire, best Thai food Menai, Thai restaurant opening 2025, Thai takeaway Menai, dine in Thai restaurant, Allison Crescent Menai restaurants',
  openGraph: {
    title: 'Chunn Thai Cuisine - Authentic Thai Restaurant Opening in Menai',
    description: 'Where golden traditions meet contemporary elegance. Opening August 1st, 2025 in Menai, Sydney. Experience the perfect harmony of traditional Thai flavors and modern culinary artistry.',
    images: ['/chunn-thai-logo.svg'],
    type: 'website',
    locale: 'en_AU',
    siteName: 'Chunn Thai Cuisine',
    url: 'https://chunnthai.com.au',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Chunn Thai Cuisine - Opening August 2025 in Menai',
    description: 'Authentic Thai • Modern Soul • Fresh Ingredients • Traditional Recipes',
    images: ['/chunn-thai-logo.svg'],
  },
  icons: {
    icon: [
      { url: '/chunn-thai-logo.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml', sizes: '32x32' },
    ],
    shortcut: '/chunn-thai-logo.svg',
    apple: '/chunn-thai-logo.svg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/chunn-thai-logo.svg',
    },
  },
  manifest: '/manifest.json',
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
  alternates: {
    canonical: 'https://chunnthai.com.au',
  },
  category: 'restaurant',
  verification: {
    google: 'google-site-verification-code', // Add your Google verification code when available
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Aggressive inline style to override webkit-text-fill-color on mobile */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (max-width: 768px) {
            /* Nuclear option - override ALL webkit-text-fill-color on mobile */
            * {
              -webkit-text-fill-color: unset !important;
            }
            
            /* Target logo SVG specifically */
            .logo-container svg,
            .logo-container svg *,
            svg[data-mobile="true"],
            svg[data-mobile="true"] * {
              -webkit-text-fill-color: unset !important;
            }
            
            /* Force path elements to have black fill */
            .logo-container svg path,
            svg[data-mobile="true"] path {
              fill: #2C2416 !important;
              -webkit-text-fill-color: unset !important;
              color: #2C2416 !important;
            }
            
            /* Force text elements to have black fill */
            .logo-container svg text,
            svg[data-mobile="true"] text {
              fill: #000000 !important;
              -webkit-text-fill-color: #000000 !important;
              color: #000000 !important;
            }
          }
        `}} />
        
        {/* Viewport optimizations */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
        <meta name="theme-color" content="#d4af37" />
        <meta name="color-gamut" content="srgb" />
        <meta name="supported-color-schemes" content="light dark" />
        <meta name="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta name="pragma" content="no-cache" />
        <meta name="expires" content="0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Chunn Thai" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#d4af37" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to optimize font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Thai fonts */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500&family=Sarabun:wght@300;400;500&display=swap" rel="stylesheet" />
        
        {/* Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        
        {/* Preload critical fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-27Q5CMN11B"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-27Q5CMN11B', {
                'linker': {
                  'domains': ['chunnthai.com.au', 'chunnthai.web.app', 'chunnthai.firebaseapp.com']
                },
                'cookie_domain': 'auto'
              });
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": "Chunn Thai Cuisine",
              "image": "https://chunnthai.com.au/chunn-thai-logo.svg",
              "url": "https://chunnthai.com.au",
              "telephone": "+61432506436",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Shop 21, HomeCo Menai Marketplace, 152-194 Allison Crescent",
                "addressLocality": "Menai",
                "addressRegion": "NSW",
                "postalCode": "2234",
                "addressCountry": "AU"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -34.0169,
                "longitude": 151.0131
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "11:30",
                "closes": "22:00"
              },
              "servesCuisine": "Thai",
              "acceptsReservations": "true",
              "menu": "https://chunnthai.com.au/menu",
              "email": "cuisine@chunnthai.com.au",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61576853373611",
                "https://www.instagram.com/chunn_thai/"
              ],
              "potentialAction": {
                "@type": "ReserveAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://chunnthai.com.au/reservations",
                  "inLanguage": "en-AU",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/MobileWebPlatform"
                  ]
                },
                "result": {
                  "@type": "Reservation",
                  "name": "Book a table at Chunn Thai Cuisine"
                }
              }
            })
          }}
        />
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `
        }} />
      </body>
    </html>
  );
}