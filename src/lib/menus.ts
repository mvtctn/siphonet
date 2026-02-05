import { supabase } from '@/lib/supabase'

export interface MenuItem {
    id: string
    label: string
    url: string
    order: number
    parentId?: string
    icon?: string
}

export interface Menu {
    id: string
    name: string
    location: string
    items: MenuItem[]
    active: boolean
}

/**
 * Fetches a menu by its location (e.g., 'header', 'side', 'post')
 */
export async function getMenu(location: string): Promise<Menu | null> {
    try {
        const { data, error } = await supabase
            .from('menus')
            .select('*')
            .eq('location', location)
            .eq('active', true)
            .single()

        if (error) {
            console.error(`Error fetching menu for location ${location}:`, error)
            return null
        }

        return data as Menu
    } catch (error) {
        console.error(`Unexpected error fetching menu for location ${location}:`, error)
        return null
    }
}
