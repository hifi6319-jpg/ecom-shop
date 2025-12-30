import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'
import { AlertCircle, Star, TrendingUp } from 'lucide-react'

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

    // Mock data for demonstration
    const stockCount = 8
    const viewingCount = Math.floor(Math.random() * 20) + 5
    const reviews = [
        { id: 1, name: 'Rahul M.', rating: 5, comment: 'Perfect fit! The fabric quality is amazing. Worth every rupee.', date: '2 days ago' },
        { id: 2, name: 'Priya K.', rating: 5, comment: 'This is my 3rd purchase. Quality is consistently excellent!', date: '1 week ago' },
        { id: 3, name: 'Arjun S.', rating: 4, comment: 'Great t-shirt, slightly longer than expected but still love it.', date: '2 weeks ago' }
    ]
    const avgRating = 4.8

    useEffect(() => {
        async function getProduct() {
            setLoading(true)
            try {
                const { data: p, error } = await supabase.from('products').select('*').eq('id', id).single()
                const { data: v } = await supabase.from('product_variants').select('*').eq('product_id', id)

                if (error) throw error

                setProduct(p)
                setVariants(v || [])
            } catch (error) {
                console.error("Fetch failed, using mock data:", error)
                // Mock Data Fallback
                const mockProducts = [
                    {
                        id: 1,
                        name: 'Classic Navy Tee',
                        price: 599,
                        image_url: '/images/product-navy.png',
                        description: 'Premium quality navy cotton t-shirt. Made from 100% organic cotton for breathability and comfort.',
                        variants: [{ id: 101, size: 'M', color: 'Navy' }, { id: 102, size: 'L', color: 'Navy' }]
                    },
                    {
                        id: 2,
                        name: 'Vibrant Red Tee',
                        price: 599,
                        image_url: '/images/product-red.png',
                        description: 'Bold red casual t-shirt. Stand out from the crowd with this vibrant color.',
                        variants: [{ id: 201, size: 'S', color: 'Red' }]
                    },
                    {
                        id: 3,
                        name: 'Essential Black Tee',
                        price: 549,
                        image_url: 'https://placehold.co/400x400/000000/FFFFFF/png?text=Black+Tee',
                        description: 'Classic black tee for everyday wear. A wardrobe staple.',
                        variants: [{ id: 301, size: 'L', color: 'Black' }]
                    },
                    {
                        id: 4,
                        name: 'Pure White Tee',
                        price: 549,
                        image_url: 'https://placehold.co/400x400/FFFFFF/000000/png?text=White+Tee',
                        description: 'Crisp white tee, essential for any wardrobe.',
                        variants: [{ id: 401, size: 'M', color: 'White' }]
                    }
                ]
                // eslint-disable-next-line eqeqeq
                const mock = mockProducts.find(p => p.id == id)
                setProduct(mock || mockProducts[0])
                setVariants(mock?.variants || [])
            } finally {
                setLoading(false)
            }
        }
        getProduct()
    }, [id])

    const availableSizes = [...new Set(variants.map(v => v.size))]
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
            await supabase.from('cart_items').upsert(
                { user_id: user.id, variant_id: variant.id, quantity: 1 },
                { onConflict: 'user_id, variant_id', ignoreDuplicates: false }
            )
            alert('Added to cart')
        } catch (e) {
            console.error(e)
        } finally {
            setAdding(false)
        }
    }

    if (loading) return <div className="text-center py-20">Loading...</div>
    if (!product) return <div className="text-center py-20">Product not found</div>

    return (
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
            <div className="flex flex-col-reverse">
                <div className="w-full aspect-square bg-gray-50 overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-center object-cover" />
                </div>
            </div>

            <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
                {/* Product Name & Rating */}
                <div className="flex items-start justify-between">
                    <h1 className="text-3xl font-black tracking-tight text-luxury uppercase">{product.name}</h1>
                    <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-gold text-gold" />
                        <span className="text-sm font-bold">{avgRating}</span>
                        <span className="text-xs text-ash-grey">({reviews.length} reviews)</span>
                    </div>
                </div>

                {/* Stock Alert & Urgency */}
                <div className="mt-4 space-y-2">
                    {stockCount < 10 && (
                        <div className="flex items-center gap-2 text-sm">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-red-600 font-semibold">Only {stockCount} left in stock!</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-ash-grey">
                        <TrendingUp className="h-4 w-4" />
                        <span>{viewingCount} people viewing this right now</span>
                    </div>
                </div>

                {/* Price */}
                <div className="mt-6">
                    <h2 className="sr-only">Product information</h2>
                    <p className="text-4xl font-black text-luxury">₹{product.price}</p>
                    <p className="text-sm text-ash-grey mt-1">Inclusive of all taxes</p>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Size Selection */}
                <div className="mt-8">
                    <h3 className="text-sm font-bold text-luxury uppercase tracking-wider">Size</h3>
                    <div className="mt-3 flex items-center gap-3">
                        {availableSizes.map(s => (
                            <button
                                key={s}
                                onClick={() => { setSelectedSize(s); setSelectedColor('') }}
                                className={`px-6 py-3 border text-sm font-bold uppercase tracking-wider transition-all ${selectedSize === s ? 'bg-luxury text-white border-luxury' : 'bg-white text-luxury border-gray-300 hover:border-luxury'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Color Selection */}
                <div className="mt-6">
                    <h3 className="text-sm font-bold text-luxury uppercase tracking-wider">Color</h3>
                    <div className="mt-3 flex items-center gap-3">
                        {availableColors.map(c => (
                            <button
                                key={c}
                                onClick={() => setSelectedColor(c)}
                                disabled={!selectedSize}
                                className={`px-6 py-3 border text-sm font-bold uppercase tracking-wider transition-all ${selectedColor === c ? 'bg-luxury text-white border-luxury' : 'bg-white text-luxury border-gray-300 hover:border-luxury'} ${!selectedSize ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add to Cart */}
                <div className="mt-10">
                    <button
                        onClick={addToCart}
                        disabled={adding}
                        className="w-full btn-gold py-4 text-base font-bold uppercase tracking-wider"
                    >
                        {adding ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>

                {/* Reviews Section */}
                <div className="mt-12 border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-black text-luxury uppercase tracking-wider mb-6">Customer Reviews</h3>
                    <div className="space-y-6">
                        {reviews.map(review => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-bold text-sm">{review.name}</span>
                                    <span className="text-xs text-ash-grey">{review.date}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-gold text-gold' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-700">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
