import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Heart, Star, X } from 'lucide-react'

export default function ProductList() {
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchParams, setSearchParams] = useSearchParams()

    const selectedCategory = searchParams.get('category')
    const [selectedSize, setSelectedSize] = useState('')
    const [selectedColor, setSelectedColor] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        filterProducts()
    }, [products, selectedCategory, selectedSize, selectedColor])

    const clearFilters = () => {
        setSearchParams({})
        setSelectedSize('')
        setSelectedColor('')
    }

    const fetchData = async () => {
        setLoading(true)
        try {
            const [{ data: prods, error: prodError }, { data: cats, error: catError }] = await Promise.all([
                supabase.from('products').select('*, categories(name), product_variants(size, color)'),
                supabase.from('categories').select('*')
            ])

            if (prodError || catError) throw new Error('Supabase Error')

            setProducts(prods || [])
            setCategories(cats || [])
        } catch (error) {
            console.error('Fetching data failed, using mock data:', error)
            // Mock Data Fallback
            setProducts([
                {
                    id: 1,
                    name: 'Classic Navy Tee',
                    price: 599,
                    image_url: '/images/product-navy.png',
                    description: 'Premium quality navy cotton t-shirt.',
                    categories: { name: 'Men' },
                    product_variants: [{ size: 'M', color: 'Navy' }, { size: 'L', color: 'Navy' }]
                },
                {
                    id: 2,
                    name: 'Vibrant Red Tee',
                    price: 599,
                    image_url: '/images/product-red.png',
                    description: 'Bold red casual t-shirt.',
                    categories: { name: 'Women' },
                    product_variants: [{ size: 'S', color: 'Red' }]
                },
                {
                    id: 3,
                    name: 'Essential Black Tee',
                    price: 549,
                    image_url: 'https://placehold.co/400x400/000000/FFFFFF/png?text=Black+Tee',
                    description: 'Classic black tee for everyday wear.',
                    categories: { name: 'Men' },
                    product_variants: [{ size: 'L', color: 'Black' }]
                },
                {
                    id: 4,
                    name: 'Pure White Tee',
                    price: 549,
                    image_url: 'https://placehold.co/400x400/FFFFFF/000000/png?text=White+Tee',
                    description: 'Crisp white tee, essential for any wardrobe.',
                    categories: { name: 'Unisex' },
                    product_variants: [{ size: 'M', color: 'White' }]
                }
            ])
            setCategories([
                { id: 1, name: 'Men' },
                { id: 2, name: 'Women' },
                { id: 3, name: 'Boys' },
                { id: 4, name: 'Unisex' }
            ])
        } finally {
            setLoading(false)
        }
    }

    const filterProducts = () => {
        let result = products

        if (selectedCategory) {
            result = result.filter(p => p.categories?.name === selectedCategory)
        }

        if (selectedSize) {
            result = result.filter(p => p.product_variants.some(v => v.size === selectedSize))
        }

        if (selectedColor) {
            result = result.filter(p => p.product_variants.some(v => v.color === selectedColor))
        }

        setFilteredProducts(result)
    }

    // Color palette for visual color swatches
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Red': '#EF4444',
        'Blue': '#3B82F6',
        'Navy': '#1E3A8A',
        'Gray': '#6B7280',
        'Green': '#10B981'
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-72 lg:sticky lg:top-24 h-fit">
                <div className="glass-card p-6 space-y-8">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-primary rounded-full" />
                            Category
                        </h3>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSearchParams({})}
                                className={`block w-full text-left px-4 py-3 rounded-xl transition-all border ${!selectedCategory
                                    ? 'bg-gradient-primary text-white font-bold shadow-lg border-transparent'
                                    : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300 hover:shadow-sm font-medium'
                                    }`}
                            >
                                All Products
                            </button>
                            {categories.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSearchParams({ category: c.name })}
                                    className={`block w-full text-left px-4 py-3 rounded-xl transition-all border ${selectedCategory === c.name
                                        ? 'bg-gradient-primary text-white font-bold shadow-lg border-transparent'
                                        : 'bg-white text-gray-900 border-gray-200 hover:border-gray-300 hover:shadow-sm font-medium'
                                        }`}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-primary rounded-full" />
                            Size
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                                    className={`px-5 py-3 text-sm font-bold rounded-xl border-2 transition-all hover-lift ${selectedSize === size
                                        ? 'bg-gradient-primary text-white border-transparent shadow-lg'
                                        : 'bg-white text-gray-900 border-gray-200 hover:border-gray-400'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-200">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-gradient-primary rounded-full" />
                            Color
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            {['Black', 'White', 'Red', 'Blue'].map(color => (
                                <button
                                    key={color}
                                    onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                                    className={`group relative flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all hover-lift ${selectedColor === color
                                        ? 'bg-gradient-primary text-white border-transparent shadow-lg'
                                        : 'border-gray-200 bg-white hover:border-gray-400'
                                        }`}
                                    title={color}
                                >
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 ${color === 'White' ? 'border-gray-300' : 'border-transparent'}`}
                                        style={{ backgroundColor: colorMap[color] || '#999' }}
                                    />
                                    <span className={`text-sm font-bold ${selectedColor === color ? 'text-white' : 'text-gray-900'}`}>{color}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(selectedCategory || selectedSize || selectedColor) && (
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                onClick={clearFilters}
                                className="w-full px-4 py-2 text-sm font-bold text-red-600 border-2 border-red-600 rounded-xl hover:bg-red-50 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </aside >

            {/* Product Grid */}
            < div className="flex-1" >
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-3xl font-bold gradient-text">
                        {selectedCategory || 'All Products'}
                    </h2>
                    <p className="text-gray-600">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                    </p>
                </div>

                {
                    loading ? (
                        /* Loading Skeletons */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="premium-card animate-pulse">
                                    <div className="aspect-square bg-gray-200 shimmer" />
                                    <div className="p-6 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded shimmer" />
                                        <div className="h-3 bg-gray-200 rounded w-2/3 shimmer" />
                                        <div className="h-6 bg-gray-200 rounded w-1/3 shimmer" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        /* Empty State */
                        <div className="text-center py-20">
                            <div className="inline-block p-8 bg-gradient-mesh rounded-3xl mb-6">
                                <Heart className="h-16 w-16 text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No products found</h3>
                            <p className="text-gray-500 mb-8">Try adjusting your filters or category.</p>
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl border-2 border-red-100 hover:bg-red-100 hover:border-red-200 transition-all hover-lift"
                            >
                                <X className="h-5 w-5" />
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        /* Product Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map((product, index) => (
                                <Link
                                    key={product.id}
                                    to={`/products/${product.id}`}
                                    className="group premium-card animate-fade-in-up"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                                        <img
                                            src={product.image_url || 'https://via.placeholder.com/400'}
                                            alt={product.name}
                                            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Wishlist Heart */}
                                        <button
                                            className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-white"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                // Add to wishlist logic here
                                            }}
                                        >
                                            <Heart className="h-5 w-5 text-gray-700" />
                                        </button>

                                        {/* Quick View */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="btn-primary text-sm py-2 px-6 text-white hover:text-white border-white hover:border-white">
                                                Quick View
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-1 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                                />
                                            ))}
                                            <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors line-clamp-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                                            {product.description || 'Premium Quality T-Shirt'}
                                        </p>
                                        <p className="text-2xl font-bold gradient-text">₹{product.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )
                }
            </div >
        </div >
    )
}
