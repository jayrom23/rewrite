import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import RootWrapper from '@/components/RootWrapper';

const inter = Inter({ subsets: ['latin'] });

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <RootWrapper>
            {children}
          </RootWrapper>
        </ErrorBoundary>
      </body>
    </html>
  );
}
