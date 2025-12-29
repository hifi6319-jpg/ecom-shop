import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

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

    const fetchData = async () => {
        setLoading(true)
        const [{ data: prods }, { data: cats }] = await Promise.all([
            supabase.from('products').select('*, categories(name), product_variants(size, color)'),
            supabase.from('categories').select('*')
        ])
        setProducts(prods || [])
        setCategories(cats || [])
        setLoading(false)
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

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-64 space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">Category</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setSearchParams({})}
                            className={`block text-sm ${!selectedCategory ? 'font-bold text-indigo-600' : 'text-gray-600'}`}
                        >
                            All
                        </button>
                        {categories.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSearchParams({ category: c.name })}
                                className={`block text-sm ${selectedCategory === c.name ? 'font-bold text-indigo-600' : 'text-gray-600'}`}
                            >
                                {c.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Size</h3>
                    <div className="flex flex-wrap gap-2">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                                className={`px-3 py-1 text-sm border rounded hover:border-indigo-500 ${selectedSize === size ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">Color</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Black', 'White', 'Red', 'Blue'].map(color => (
                            <button
                                key={color}
                                onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                                className={`px-3 py-1 text-sm border rounded hover:border-indigo-500 ${selectedColor === color ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700'}`}
                            >
                                {color}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
                {loading ? <p>Loading products...</p> : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map(product => (
                            <Link key={product.id} to={`/products/${product.id}`} className="group block">
                                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                                    <img
                                        src={product.image_url || 'https://via.placeholder.com/300'}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                                    />
                                </div>
                                <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
                                <p className="mt-1 text-lg font-medium text-gray-900">₹{product.price}</p>
                            </Link>
                        ))}
                        {filteredProducts.length === 0 && <p>No products found.</p>}
                    </div>
                )}
            </div>
        </div>
    )
}
