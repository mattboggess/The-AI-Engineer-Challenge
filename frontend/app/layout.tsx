import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OpenAI Chat Interface',
  description: 'Streaming chat interface powered by OpenAI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

