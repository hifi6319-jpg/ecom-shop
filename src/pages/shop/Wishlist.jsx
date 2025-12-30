import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'

export default function Wishlist() {
    // Mock Wishlist Data (since backend is unstable)
    const [wishlistItems, setWishlistItems] = useState([
        {
            id: 1,
            name: 'Classic Navy Tee',
            price: 599,
            image_url: '/images/product-navy.png',
            inStock: true
        }
    ])

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-luxury mb-8">My Wishlist</h1>

            {wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-8">Save items you love to buy later.</p>
                    <Link to="/products" className="btn-primary">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="premium-card group relative">
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Link to={`/products/${item.id}`} className="btn-white text-sm px-6 py-2 bg-white rounded-full font-medium hover:bg-gray-100">
                                        View Product
                                    </Link>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-gold font-bold">₹{item.price}</span>
                                    {item.inStock ? (
                                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">In Stock</span>
                                    ) : (
                                        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded-full">Out of Stock</span>
                                    )}
                                </div>
                                <button className="w-full mt-4 btn-outline text-sm py-2">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
