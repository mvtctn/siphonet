import { supabaseAdmin } from '@/lib/supabase'
import { getSession } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        // Fetch counts in parallel
        const [
            ordersCount,
            ordersNew,
            ordersTotal,
            postsCount,
            postsDraft,
            contactsUnread,
            productsCount,
            quotesCount
        ] = await Promise.all([
            // Total Orders
            supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
            // New Orders
            supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new'),
            // Total Revenue (roughly)
            supabaseAdmin.from('orders').select('total_amount').neq('status', 'cancelled'),
            // Total Posts
            supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }),
            // Draft Posts
            supabaseAdmin.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
            // Unread Contacts
            supabaseAdmin.from('contacts').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
            // Total Products
            supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
            // Quote Requests
            supabaseAdmin.from('quote_requests').select('*', { count: 'exact', head: true })
        ])

        const totalRevenue = ordersTotal.data?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0

        // Recent activities
        const [recentOrders, recentContacts] = await Promise.all([
            supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
            supabaseAdmin.from('contacts').select('*').order('created_at', { ascending: false }).limit(5)
        ])

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    orders: {
                        total: ordersCount.count || 0,
                        new: ordersNew.count || 0,
                        revenue: totalRevenue
                    },
                    posts: {
                        total: postsCount.count || 0,
                        draft: postsDraft.count || 0
                    },
                    contacts: {
                        unread: contactsUnread.count || 0
                    },
                    products: {
                        total: productsCount.count || 0
                    },
                    quotes: {
                        total: quotesCount.count || 0
                    }
                },
                recent: {
                    orders: recentOrders.data || [],
                    contacts: recentContacts.data || []
                }
            }
        })
    } catch (error: any) {
        console.error('Stats API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
