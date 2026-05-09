"use client"

import Link from 'next/link';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-primary-900 dark:to-secondary-500">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-primary-200 dark:border-secondary-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            CyberArticles
          </h1>
          <div>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-all transform hover:shadow-lg">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link 
                  href="/product" 
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-6 rounded-lg transition-all transform hover:shadow-lg"
                >
                  Go to App
                </Link>
                <UserButton/>
              </div>
            </SignedIn>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center py-20">
          <h2 className="text-7xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-8">
            Find and Summarize
            <br />
            Top Cyber Articles
          </h2>
          <p className="text-xl text-white-600 dark:text-white-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Harness the power of AI to discover and summarize important cyber news articles in seconds.
          </p>
          
            {/* Pricing Preview */}
          <div className="bg-white/80 dark:bg-secondary-800/80 backdrop-blur-lg rounded-xl p-6 max-w-sm mx-auto mb-8">
            <h3 className="text-2xl font-bold mb-2">Premium Subscription</h3>
            <p className="text-4xl font-bold text-primary-600 mb-2">$2<span className="text-lg text-secondary-600">/month</span></p>
            <ul className="text-left text-grey-600 dark:text-white-400 mb-6">
              <li className="mb-2">✓ Unlimited summary generation</li>
              <li className="mb-2">✓ Advanced AI models</li>
              <li className="mb-2">✓ Priority support</li>
            </ul>
          </div>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg">
                Start Your Free Trial
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/product">
              <button className="bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-bold py-4 px-10 rounded-xl text-lg transition-all transform hover:scale-105 hover:shadow-2xl shadow-lg">
                Access Premium Features
              </button>
            </Link>
          </SignedIn>
        </div>

        {/* Features Section */}
        <div className="py-20 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl text-white">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Lightning Fast</h3>
            <p className="text-gray-600 dark:text-gray-400">Get AI-powered summaries in seconds, not minutes. Save time and stay informed.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl text-white">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Secure & Private</h3>
            <p className="text-gray-600 dark:text-gray-400">Your data is encrypted and never shared. Enterprise-grade security standards.</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <span className="text-2xl text-white">🎯</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Curated Content</h3>
            <p className="text-gray-600 dark:text-gray-400">Handpicked cybersecurity articles from trusted sources worldwide.</p>
          </div>
        </div>
      </div>
    </main>
  );
}