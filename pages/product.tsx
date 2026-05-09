"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useAuth, useUser } from '@clerk/nextjs';
import { Protect, PricingTable, UserButton } from '@clerk/nextjs';
import { fetchEventSource } from '@microsoft/fetch-event-source';

function IdeaGenerator() {
    const { getToken } = useAuth();
    const { user } = useUser();
    const [idea, setIdea] = useState<string>('…loading');
    const [apiKeyMissing, setApiKeyMissing] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchSummary = async () => {
        const jwt = await getToken();
        if (!jwt) {
            setIdea('Authentication required');
            return;
        }

        // Check if user has API key
        const userApiKey = user?.unsafeMetadata?.geminiApiKey as string | undefined;
        if (!userApiKey) {
            setApiKeyMissing(true);
            setIdea('');
            return;
        }

        setApiKeyMissing(false);
        setError('');
        setLoading(true);
        setIdea('…loading');
        let buffer = '';

        try {
            await fetchEventSource('/api', {
                headers: { 
                    Authorization: `Bearer ${jwt}`,
                    'X-API-Key': userApiKey,
                },
                onopen: async (response: any) => {
                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.detail || 'Server error');
                    }
                },
                onmessage(ev) {
                    buffer += ev.data;
                    setIdea(buffer);
                },
                onerror(err: any) {
                    console.error('SSE error:', err);
                    if (err?.status === 401) {
                        setError('Invalid API key. Please check your settings.');
                        setApiKeyMissing(true);
                    } else if (err?.status === 400) {
                        setError('API key is required. Please add one in Settings.');
                        setApiKeyMissing(true);
                    } else {
                        setError('An error occurred. Please try again.');
                    }
                    setLoading(false);
                }
            });
        } catch (err: any) {
            console.error('Fetch error:', err);
            const errorMsg = err?.message || 'An error occurred';
            if (errorMsg.includes('API key')) {
                setError(errorMsg);
                setApiKeyMissing(true);
            } else {
                setError(errorMsg);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, [getToken, user?.unsafeMetadata?.geminiApiKey]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-primary-900 dark:to-secondary-500">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-primary-200 dark:border-secondary-700 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:opacity-80 transition">
                            CyberArticles
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/settings"
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
                            >
                                ⚙️ Settings
                            </Link>
                            <UserButton/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                                Top Cyber Articles Finder & Summarizer
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
                                AI-powered summarization at your fingertips
                            </p>
                        </div>
                        {!apiKeyMissing && (
                            <button
                                onClick={fetchSummary}
                                disabled={loading}
                                className="bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition transform hover:shadow-lg disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {loading ? '⟳ Refreshing...' : '↻ Refresh'}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {apiKeyMissing && (
                        <div className="bg-amber-50 dark:bg-amber-900 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-3">
                                🔑 API Key Required
                            </h3>
                            <p className="text-amber-800 dark:text-amber-200 mb-4">
                                To use CyberArticles, you need to add your Google Gemini API key. Don't worry, it's free!
                            </p>
                            <Link
                                href="/settings"
                                className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-lg transition transform hover:shadow-lg"
                            >
                                Add API Key in Settings →
                            </Link>
                        </div>
                    )}

                    {error && !apiKeyMissing && (
                        <div className="bg-red-50 dark:bg-red-900 border-2 border-red-400 dark:border-red-600 rounded-2xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
                                ❌ Error
                            </h3>
                            <p className="text-red-800 dark:text-red-200 mb-4">{error}</p>
                            <Link
                                href="/settings"
                                className="inline-block text-red-600 dark:text-red-400 hover:underline font-semibold"
                            >
                                Check Settings →
                            </Link>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 backdrop-blur-lg bg-opacity-95 border border-primary-100 dark:border-secondary-700">
                        {apiKeyMissing ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="text-6xl mb-4">🔐</div>
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Set Up Your API Key
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Click the settings button above to add your Google Gemini API key. It only takes a minute!
                                </p>
                            </div>
                        ) : idea === '…loading' ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                    <div className="relative text-center">
                                        <div className="animate-spin w-12 h-12 border-4 border-primary-200 dark:border-secondary-700 border-t-primary-500 dark:border-t-secondary-500 rounded-full mx-auto mb-4"></div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">Generating your summary...</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">This may take a few moments</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="markdown-content text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                >
                                    {idea}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function Product() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-primary-900 dark:to-secondary-800">
            {/* User Menu in Top Right */}
            <div className="absolute top-4 right-4">
                <UserButton showName={true} />
            </div>

            {/* Subscription Protection */}
            <Protect
                plan="cyberarticles"
                fallback={
                    <div className="container mx-auto px-4 py-12">
                        <header className="text-center mb-12">
                            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                                Choose Your Plan
                            </h1>
                            <p className="text-primary-600 dark:text-secondary-400 text-lg mb-8">
                                Unlock unlimited Article Summaries
                            </p>
                        </header>
                        <div className="max-w-4xl mx-auto">
                            <PricingTable />
                        </div>
                    </div>
                }
            >
                <IdeaGenerator />
            </Protect>
        </main>
    );
}