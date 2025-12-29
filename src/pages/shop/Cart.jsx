import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { generateWhatsAppUrl } from '../../services/whatsapp'

export default function Cart() {
    const { user } = useAuth()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        if (!user) return
        const { data } = await supabase
            .from('cart_items')
            .select('*, product_variants(product:products(name, price, image_url), size, color)')
        // Transform data for easier display
        const formatted = (data || []).map(item => ({
            ...item,
            // Flatten structure
            name: item.product_variants.product.name,
            price: item.product_variants.product.price,
            image: item.product_variants.product.image_url,
            size: item.product_variants.size,
            color: item.product_variants.color,
        }))
        setItems(formatted)
        setLoading(false)
    }

    const updateQuantity = async (id, quantity) => {
        if (quantity < 1) return removeItem(id)
        await supabase.from('cart_items').update({ quantity }).eq('id', id)
        fetchCart()
    }

    const removeItem = async (id) => {
        await supabase.from('cart_items').delete().eq('id', id)
        fetchCart()
    }

    const handleCheckout = async () => {
        if (items.length === 0) return
        if (!user?.email) return alert("Please sign in")

        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        try {
            // 1. Create Order
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: user.id,
                    customer_name: user.email, // or actual name from profile
                    status: 'pending',
                    total_amount: total
                })
                .select()
                .single()

            if (orderError) throw orderError

            // 2. Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                variant_id: item.variant_id,
                product_name: item.name,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.price
            }))

            const { error: itemsError } = await supabase
                .from('order_items')
                .insert(orderItems)

            if (itemsError) throw itemsError

            // 3. Clear Cart
            await supabase.from('cart_items').delete().eq('user_id', user.id)

            // 4. Redirect to WhatsApp
            const url = generateWhatsAppUrl(order, orderItems)
            window.location.href = url

        } catch (error) {
            console.error(error)
            alert('Checkout failed: ' + error.message)
        }
    }

    if (loading) return <div>Loading cart...</div>

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <li key={item.id} className="p-4 flex items-center">
                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="h-full w-full object-cover object-center" />
                                </div>
                                <div className="ml-4 flex-1 flex flex-col">
                                    <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                            <h3>{item.name}</h3>
                                            <p className="ml-4">₹{item.price * item.quantity}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.color} | {item.size}</p>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <label>Qty</label>
                                            <select
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                className="rounded border-gray-300"
                                            >
                                                {[1, 2, 3, 4, 5].map(x => <option key={x} value={x}>{x}</option>)}
                                            </select>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="font-medium text-indigo-600 hover:text-indigo-500">Remove</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                            <p>Subtotal</p>
                            <p>₹{items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</p>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                            Buy Now on WhatsApp
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
