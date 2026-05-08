import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grand Library | Intellectual Storytelling Platform',
  description: 'A sophisticated platform for collaborative IP creation and real-time writer collaboration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-void text-text-primary">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
