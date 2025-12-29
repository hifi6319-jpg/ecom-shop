import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash, Plus, X } from 'lucide-react'

export default function ProductManager() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(true)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image: null
    })
    const [variants, setVariants] = useState([{ size: 'M', color: 'Black', stock: 10 }])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const [{ data: prods }, { data: cats }] = await Promise.all([
            supabase.from('products').select('*, categories(name)'),
            supabase.from('categories').select('*')
        ])
        setProducts(prods || [])
        setCategories(cats || [])
        setLoading(false)
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }))
    }

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants]
        newVariants[index][field] = value
        setVariants(newVariants)
    }

    const addVariant = () => {
        setVariants([...variants, { size: 'M', color: 'Black', stock: 10 }])
    }

    const removeVariant = (index) => {
        const newVariants = variants.filter((_, i) => i !== index)
        setVariants(newVariants)
    }

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage.from('products').getPublicUrl(filePath)
        return data.publicUrl
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            let imageUrl = ''
            if (formData.image) {
                imageUrl = await uploadImage(formData.image)
            }

            // 1. Insert Product
            const { data: product, error: prodError } = await supabase
                .from('products')
                .insert({
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    category_id: formData.category_id,
                    image_url: imageUrl
                })
                .select()
                .single()

            if (prodError) throw prodError

            // 2. Insert Variants
            const variantData = variants.map(v => ({
                product_id: product.id,
                size: v.size,
                color: v.color,
                stock: v.stock
            }))

            const { error: varError } = await supabase
                .from('product_variants')
                .insert(variantData)

            if (varError) throw varError

            setShowForm(false)
            // Reset form
            setFormData({ name: '', description: '', price: '', category_id: '', image: null })
            setVariants([{ size: 'M', color: 'Black', stock: 10 }])
            fetchData()

        } catch (error) {
            console.error(error)
            alert('Error creating product: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const deleteProduct = async (id) => {
        if (!confirm("Delete product?")) return
        await supabase.from('products').delete().eq('id', id)
        fetchData()
    }

    if (loading && !showForm) return <div>Loading...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Products</h2>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    {showForm ? 'Cancel' : 'Add New Product'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-8 border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select name="category_id" required value={formData.category_id} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Image</label>
                                <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Variants</h3>
                            {variants.map((v, index) => (
                                <div key={index} className="flex gap-4 items-end mb-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500">Size</label>
                                        <select value={v.size} onChange={(e) => handleVariantChange(index, 'size', e.target.value)} className="mt-1 block w-24 border border-gray-300 rounded-md p-1">
                                            {['S', 'M', 'L', 'XL', 'XXL'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500">Color</label>
                                        <input type="text" value={v.color} onChange={(e) => handleVariantChange(index, 'color', e.target.value)} className="mt-1 block w-32 border border-gray-300 rounded-md p-1" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500">Stock</label>
                                        <input type="number" value={v.stock} onChange={(e) => handleVariantChange(index, 'stock', e.target.value)} className="mt-1 block w-24 border border-gray-300 rounded-md p-1" />
                                    </div>
                                    <button type="button" onClick={() => removeVariant(index)} className="text-red-600 pb-1">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            ))}
                            <button type="button" onClick={addVariant} className="text-sm text-indigo-600 hover:text-indigo-900 font-medium flex items-center">
                                <Plus className="h-4 w-4 mr-1" /> Add Variant
                            </button>
                        </div>

                        <div className="flex justify-end">
                            <button type="submit" disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50">
                                {loading ? 'Creating...' : 'Create Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {products.map((product) => (
                        <li key={product.id} className="p-4 flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={product.image_url || 'https://via.placeholder.com/50'} alt="" className="h-10 w-10 rounded-full object-cover mr-4" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                    <p className="text-sm text-gray-500">{product.categories?.name} · ₹{product.price}</p>
                                </div>
                            </div>
                            <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
