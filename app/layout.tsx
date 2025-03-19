import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import RootWrapper from '@/components/RootWrapper';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: 'AI Fashion Model Generator',
  description: 'Transform clothing product photos into professional fashion model images',
  // Disable iOS format detection which can cause hydration issues
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
    url: false,
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={`${inter.className} text-gray-900 antialiased`} suppressHydrationWarning>
        <ErrorBoundary>
          <RootWrapper>
            {children}
          </RootWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
