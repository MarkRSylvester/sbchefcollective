'use client';

import './globals.css';
import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'Santa Barbara Chef Collective',
  description: 'Extraordinary private culinary experiences in Santa Barbara',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement contact form submission
  };

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-sans">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
          <div className="flex items-center space-x-4">
            <img src="/assets/images/logo.png" alt="SBCC Logo" className="h-12" />
            <div>
              <h1 className={`${playfair.className} text-2xl text-gray-900`}>
                Santa Barbara Chef Collective
              </h1>
              <p className={`${playfair.className} text-sm text-gray-600 italic`}>
                Handpicked Talent. Personal Touch. Unforgettable Experiences.
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 h-16 bg-white shadow-lg">
          <div className="container mx-auto px-6 h-full flex items-center justify-between">
            <div className="flex space-x-6 text-sm text-gray-600">
              {['Home', 'About', 'Menus', 'Chefs', 'Services', 'Contact'].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="hover:text-gray-900 transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>

            <form onSubmit={handleContactSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Name"
                className="px-2 py-1 text-sm border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                className="px-2 py-1 text-sm border rounded"
              />
              <input
                type="text"
                placeholder="Message"
                className="px-2 py-1 text-sm border rounded"
              />
              <button
                type="submit"
                className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Send
              </button>
            </form>

            <div className="text-xs text-gray-500">
              Copyright 2025 Santa Barbara Chef Collective
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 