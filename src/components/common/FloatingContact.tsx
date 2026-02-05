'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { ZaloIcon, MessengerIcon, WhatsAppIcon } from './BrandIcons'

export function FloatingContact() {
    const [isOpen, setIsOpen] = useState(false)
    const [config, setConfig] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings')
                const data = await res.json()
                if (data.success && data.data?.chat_bubble) {
                    setConfig(data.data.chat_bubble)
                }
            } catch (error) {
                console.error('Failed to load chat bubble settings', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    if (loading || !config || config.enabled === false || config.enabled === 'false') return null

    const contacts = [
        {
            name: 'Zalo',
            icon: <ZaloIcon className="h-6 w-6" />,
            color: 'bg-[#0068ff]',
            link: config.zalo || 'https://zalo.me/0913381683',
            label: 'Chat Zalo'
        },
        {
            name: 'Messenger',
            icon: <MessengerIcon className="h-6 w-6" />,
            color: 'bg-[#0084ff]',
            link: config.messenger || 'https://m.me/siphonetjsc',
            label: 'Facebook'
        },
        {
            name: 'WhatsApp',
            icon: <WhatsAppIcon className="h-6 w-6" />,
            color: 'bg-[#25d366]',
            link: config.whatsapp ? `https://wa.me/${config.whatsapp.replace(/\+/g, '').replace(/\s/g, '')}` : 'https://wa.me/84913381683',
            label: 'WhatsApp'
        }
    ].filter(c => c.link)

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 pointer-events-none">
            {/* Contact Options */}
            <div className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
                }`}>
                {contacts.map((contact) => (
                    <a
                        key={contact.name}
                        href={contact.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 group pointer-events-auto"
                    >
                        <span className="bg-white px-3 py-1.5 rounded-lg shadow-xl text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100">
                            {contact.label}
                        </span>
                        <div className={`h-12 w-12 ${contact.color} text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all`}>
                            {contact.icon}
                        </div>
                    </a>
                ))}
            </div>

            {/* Main Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all pointer-events-auto active:scale-90 ${isOpen ? 'bg-slate-800 rotate-90' : 'bg-accent animate-bounce-slow'
                    }`}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
                        <MessageCircle className="h-7 w-7 text-white relative z-10" />
                    </div>
                )}
            </button>

            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    )
}
