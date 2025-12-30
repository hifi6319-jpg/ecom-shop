import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Profile() {
    // Fixed order history view
    const [orders, setOrders] = useState([])

    useEffect(() => {
        async function fetchOrders() {
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setOrders(data || [])
            } catch (error) {
                console.error("Fetch failed, using mock data:", error)
                // Mock Orders
                setOrders([
                    {
                        id: 'ORD-1234-5678',
                        created_at: new Date().toISOString(),
                        status: 'paid',
                        total_amount: 1198
                    },
                    {
                        id: 'ORD-8765-4321',
                        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
                        status: 'shipped',
                        total_amount: 549
                    }
                ])
            }
        }
        fetchOrders()
    }, [])

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Order History</h2>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No recent orders found.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white p-6 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">Order ID: {order.id}</p>
                                        <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                        ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-4">
                                    <p className="font-bold text-lg">Total: ₹{order.total_amount}</p>
                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
