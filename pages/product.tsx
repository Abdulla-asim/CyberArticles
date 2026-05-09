"use client"

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { useAuth } from '@clerk/nextjs';
import { Protect, PricingTable, UserButton } from '@clerk/nextjs';
import { fetchEventSource } from '@microsoft/fetch-event-source';

function IdeaGenerator() {
    const { getToken } = useAuth();
    const [idea, setIdea] = useState<string>('…loading');

    useEffect(() => {
        let buffer = '';
        (async () => {
            const jwt = await getToken();
            if (!jwt) {
                setIdea('Authentication required');
                return;
            }
            
            await fetchEventSource('/api', {
                headers: { Authorization: `Bearer ${jwt}` },
                onmessage(ev) {
                    buffer += ev.data;
                    setIdea(buffer);
                },
                onerror(err) {
                    console.error('SSE error:', err);
                    // Don't throw - let it retry
                }
            });
        })();
    }, []); // Empty dependency array - run once on mount

    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-primary-900 dark:to-secondary-500">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-primary-200 dark:border-secondary-700 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:opacity-80 transition">
                            CyberArticles
                        </Link>
                        <UserButton/>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                        Top Cyber Articles Finder & Summarizer
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mt-2">
                        AI-powered summarization at your fingertips
                    </p>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 backdrop-blur-lg bg-opacity-95 border border-primary-100 dark:border-secondary-700">
                        {idea === '…loading' ? (
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