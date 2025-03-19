import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GeneratorProvider } from '@/lib/context';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Fashion Model Generator',
  description: 'Transform clothing product photos into professional fashion model images',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <GeneratorProvider>
            {children}
          </GeneratorProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
