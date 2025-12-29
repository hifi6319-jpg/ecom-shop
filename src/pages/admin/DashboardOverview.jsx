import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function DashboardOverview() {
    const [stats, setStats] = useState({ orders: 0, revenue: 0, products: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            // Not efficient for large scale, but fine for MVP
            const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact' })
            const { count: productsCount } = await supabase.from('products').select('*', { count: 'exact' })

            // Revenue calculation (better done in SQL or edge function, but client side for now)
            const { data: revenueData } = await supabase.from('orders').select('total_amount').neq('status', 'cancelled')
            const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0

            setStats({
                orders: ordersCount,
                revenue: totalRevenue,
                products: productsCount
            })
            setLoading(false)
        }
        fetchStats()
    }, [])

    if (loading) return <div>Loading stats...</div>

    return (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.orders}</dd>
                </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">₹{stats.revenue}</dd>
                </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Products</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.products}</dd>
                </div>
            </div>
        </div>
    )
}
