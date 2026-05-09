"use client"

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { UserButton } from '@clerk/nextjs';

export default function Settings() {
    const { user, isLoaded } = useUser();
    const [apiKey, setApiKey] = useState('');
    const [saved, setSaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isLoaded && user) {
            const storedKey = user.unsafeMetadata?.geminiApiKey as string || '';
            setApiKey(storedKey);
        }
    }, [isLoaded, user]);

    const handleSaveApiKey = async () => {
        if (!apiKey.trim()) {
            setError('API key cannot be empty');
            return;
        }

        setLoading(true);
        setError('');
        setSaved(false);

        try {
            await user?.update({
                unsafeMetadata: {
                    geminiApiKey: apiKey.trim(),
                },
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError('Failed to save API key. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClearApiKey = async () => {
        if (!confirm('Are you sure you want to remove your API key?')) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            await user?.update({
                unsafeMetadata: {
                    geminiApiKey: null,
                },
            });
            setApiKey('');
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            setError('Failed to remove API key. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-primary-900 dark:to-secondary-500 flex items-center justify-center">
                <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-primary-900 dark:to-secondary-500">
            {/* Header */}
            <header className="bg-white dark:bg-gray-900 border-b border-primary-200 dark:border-secondary-700 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:opacity-80 transition">
                            CyberArticles
                        </Link>
                        <UserButton />
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 backdrop-blur-lg bg-opacity-95 border border-primary-100 dark:border-secondary-700">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent mb-2">
                            Settings
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Manage your account and API credentials
                        </p>

                        {/* Google Gemini API Key Section */}
                        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                Google Gemini API Key
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                                Add your own Google Gemini API key to use the app. This keeps your data and usage private to you.
                                <br />
                                <a 
                                    href="https://aistudio.google.com/app/apikey" 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                                >
                                    Get your free API key here →
                                </a>
                            </p>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-200 font-semibold mb-3">
                                    API Key
                                </label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full px-4 py-3 rounded-lg border-2 border-primary-200 dark:border-secondary-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-primary-500 dark:focus:border-secondary-400"
                                />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                    Your API key is securely stored in your profile and never shared.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
                                    {error}
                                </div>
                            )}

                            {saved && (
                                <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
                                    ✓ Saved successfully!
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSaveApiKey}
                                    disabled={loading}
                                    className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:shadow-lg"
                                >
                                    {loading ? 'Saving...' : 'Save API Key'}
                                </button>
                                {apiKey && (
                                    <button
                                        onClick={handleClearApiKey}
                                        disabled={loading}
                                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition transform hover:shadow-lg"
                                    >
                                        {loading ? 'Removing...' : 'Remove'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500 p-4 rounded">
                            <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                                ℹ️ Why your own API key?
                            </h3>
                            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
                                <li>✓ Privacy - Your requests use your own API</li>
                                <li>✓ No costs for us - You control your Google Gemini quota</li>
                                <li>✓ No rate limits - Use the app as much as you want (within your quota)</li>
                                <li>✓ Secure - API keys are encrypted in your profile</li>
                            </ul>
                        </div>

                        {/* Back Link */}
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Link 
                                href="/product" 
                                className="inline-block text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                            >
                                ← Back to App
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
