import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function Profile() {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .then(({ data }) => setOrders(data || []))
    }, [])

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Order History</h2>

            {orders.length === 0 ? (
                <p className="text-gray-500">No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order ID: {order.id}</p>
                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize 
                  ${order.status === 'paid' ? 'bg-green-100 text-green-800' :
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100'}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-t pt-4">
                                <p className="font-semibold">Total: ₹{order.total_amount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
