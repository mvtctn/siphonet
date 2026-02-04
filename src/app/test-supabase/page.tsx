'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Database, RefreshCw, Loader2 } from 'lucide-react'

interface TestResult {
    success: boolean
    timestamp: string
    message: string
    config: {
        url: string
        anonKey: string
        serviceKey: string
    }
    tests: {
        categories: {
            success: boolean
            count: number
            data: any[]
            error: string | null
        }
        products: {
            success: boolean
            count: number
            data: any[]
            error: string | null
        }
    }
}

export default function TestSupabasePage() {
    const [result, setResult] = useState<TestResult | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const runTest = async () => {
        setLoading(true)
        setError(null)
        console.log('🚀 Starting Supabase test...')

        try {
            console.log('📡 Fetching from /api/test-supabase...')
            const response = await fetch('/api/test-supabase')
            console.log('📥 Response status:', response.status)

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            const data = await response.json()
            console.log('✅ Data received:', data)
            setResult(data)
        } catch (err: any) {
            console.error('❌ Error:', err)
            setError(err.message || 'Unknown error occurred')
        } finally {
            setLoading(false)
            console.log('🏁 Test completed')
        }
    }

    useEffect(() => {
        runTest()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                        <Database className="h-4 w-4" />
                        Supabase Connection Test
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">
                        Database Connection Status
                    </h1>
                    <p className="text-slate-600">
                        Testing connection to Supabase PostgreSQL database
                    </p>
                </div>

                {/* Test Again Button */}
                <div className="flex justify-center mb-6">
                    <button
                        onClick={runTest}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Testing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-5 w-5" />
                                Test Again
                            </>
                        )}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
                        <div className="flex items-start gap-3">
                            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold text-red-900 mb-2">Connection Failed</h3>
                                <p className="text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        {/* Overall Status */}
                        <div className={`rounded-2xl p-8 ${result.success
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
                            : 'bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200'
                            }`}>
                            <div className="flex items-center gap-4 mb-4">
                                {result.success ? (
                                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                                ) : (
                                    <XCircle className="h-12 w-12 text-red-600" />
                                )}
                                <div>
                                    <h2 className={`text-2xl font-bold ${result.success ? 'text-green-900' : 'text-red-900'
                                        }`}>
                                        {result.message}
                                    </h2>
                                    <p className="text-sm text-slate-600">
                                        {new Date(result.timestamp).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Configuration */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-lg text-slate-900 mb-4">Configuration</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-700">Supabase URL:</span>
                                    <code className="text-sm text-primary font-mono">{result.config.url}</code>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-700">Anon Key:</span>
                                    <span className="text-sm font-semibold">{result.config.anonKey}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-700">Service Key:</span>
                                    <span className="text-sm font-semibold">{result.config.serviceKey}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories Test */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-slate-900">Categories Table</h3>
                                {result.tests.categories.success ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                ) : (
                                    <XCircle className="h-6 w-6 text-red-600" />
                                )}
                            </div>
                            {result.tests.categories.error ? (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-red-700 text-sm">{result.tests.categories.error}</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-600 mb-4">
                                        Found <strong>{result.tests.categories.count}</strong> categories
                                    </p>
                                    {result.tests.categories.data.length > 0 && (
                                        <div className="space-y-2">
                                            {result.tests.categories.data.map((cat: any) => (
                                                <div key={cat.id} className="p-3 bg-slate-50 rounded-lg">
                                                    <div className="font-semibold text-slate-900">{cat.name}</div>
                                                    <div className="text-sm text-slate-500">/{cat.slug}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Products Test */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg text-slate-900">Products Table</h3>
                                {result.tests.products.success ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                ) : (
                                    <XCircle className="h-6 w-6 text-red-600" />
                                )}
                            </div>
                            {result.tests.products.error ? (
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-red-700 text-sm">{result.tests.products.error}</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-slate-600 mb-4">
                                        Found <strong>{result.tests.products.count}</strong> products
                                    </p>
                                    {result.tests.products.data.length > 0 && (
                                        <div className="space-y-2">
                                            {result.tests.products.data.map((product: any) => (
                                                <div key={product.id} className="p-3 bg-slate-50 rounded-lg flex items-center justify-between">
                                                    <div className="font-semibold text-slate-900">{product.name}</div>
                                                    <div className="text-sm text-slate-600">
                                                        {new Intl.NumberFormat('vi-VN').format(product.price)} đ | Stock: {product.stock}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
