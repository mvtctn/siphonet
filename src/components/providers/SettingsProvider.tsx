'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface Settings {
    site_info: {
        title: string
        description: string
        email: string
        phone: string
        address: string
        logo_url: string
        favicon_url: string
        working_hours: string
    }
    social: {
        facebook: string
        zalo: string
        youtube: string
        linkedin: string
    }
    seo: {
        meta_title: string
        meta_description: string
        keywords: string
    }
    analytics: {
        google_analytics_id: string
        google_console_id: string
        facebook_pixel: string
    }
    chat_bubble: {
        enabled: boolean
        zalo: string
        messenger: string
        whatsapp: string
    }
}

const SettingsContext = createContext<Settings | null>(null)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<Settings | null>(null)

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setSettings(data.data)
                }
            })
            .catch(console.error)
    }, [])

    return (
        <SettingsContext.Provider value={settings}>
            {children}
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    return useContext(SettingsContext)
}
