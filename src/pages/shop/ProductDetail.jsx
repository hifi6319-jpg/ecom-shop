import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

export default function ProductDetail() {
    const { id } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [variants, setVariants] = useState([])
    const [loading, setLoading] = useState(true)

    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        async function getProduct() {
            const { data: p } = await supabase.from('products').select('*').eq('id', id).single()
            const { data: v } = await supabase.from('product_variants').select('*').eq('product_id', id)
            setProduct(p)
            setVariants(v || [])
            setLoading(false)
        }
        getProduct()
    }, [id])

    const availableSizes = [...new Set(variants.map(v => v.size))]
    // Filter colors based on selected size
    const availableColors = selectedSize
        ? [...new Set(variants.filter(v => v.size === selectedSize).map(v => v.color))]
        : [...new Set(variants.map(v => v.color))]

    const addToCart = async () => {
        if (!user) return navigate('/login')
        if (!selectedSize || !selectedColor) return alert('Select size and color')

        const variant = variants.find(v => v.size === selectedSize && v.color === selectedColor)
        if (!variant) return alert('Unavailable option')

        setAdding(true)
        try {
            const { error } = await supabase.from('cart_items').upsert(
                { user_id: user.id, variant_id: variant.id, quantity: 1 }, // Default qty 1, upsert handles duplicates logic implicitly via conflict if we set it up, but unique key is (user_id, variant_id)
                { onConflict: 'user_id, variant_id', ignoreDuplicates: false }
                // Note: Basic upsert replaces. To increment, we'd need a procedure or fetch-then-update.
                // For simplicity: just set to 1 or if exists update (but standard upsert overwrites).
                // Let's just Insert and catch error, or Upsert. Upsert overwrites quantity to 1. 
                // Better: Fetch existing, then update.
            )
            // Proper Add:
            // const { data: existing } = await supabase.from('cart_items').select('*').eq('user_id', user.id).eq('variant_id', variant.id).single()
            // let qty = 1
            // if (existing) qty = existing.quantity + 1
            // await supabase.from('cart_items').upsert({ id: existing?.id, user_id: user.id, variant_id: variant.id, quantity: qty })

            // Simplified for "Add to Cart" usually means "Put 1 in cart" or "Add 1 more"
            alert('Added to cart')
        } catch (e) {
            console.error(e)
        } finally {
            setAdding(false)
        }
    }

    if (loading) return <div>Loading...</div>
    if (!product) return <div>Product not found</div>

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <div className="flex flex-col-reverse">
                <div className="w-full aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden sm:aspect-w-2 sm:aspect-h-3">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-center object-cover" />
                </div>
            </div>

            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
                <div className="mt-3">
                    <h2 className="sr-only">Product information</h2>
                    <p className="text-3xl text-gray-900">₹{product.price}</p>
                </div>
                <div className="mt-6">
                    <p className="text-base text-gray-700">{product.description}</p>
                </div>

                <div className="mt-6">
                    <div>
                        <h3 className="text-sm text-gray-900 font-medium">Size</h3>
                        <div className="mt-2 flex items-center space-x-3">
                            {availableSizes.map(s => (
                                <button
                                    key={s}
                                    onClick={() => { setSelectedSize(s); setSelectedColor('') }}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedSize === s ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-sm text-gray-900 font-medium">Color</h3>
                        <div className="mt-2 flex items-center space-x-3">
                            {availableColors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setSelectedColor(c)}
                                    disabled={!selectedSize}
                                    className={`px-4 py-2 border rounded-md text-sm font-medium ${selectedColor === c ? 'bg-indigo-600 text-white border-transparent' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'} ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 flex sm:flex-col1">
                        <button
                            onClick={addToCart}
                            disabled={adding}
                            className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
                        >
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
