import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Trash, Plus } from 'lucide-react'

export default function CategoryManager() {
    const [categories, setCategories] = useState([])
    const [newCat, setNewCat] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchCats()
    }, [])

    const fetchCats = async () => {
        const { data } = await supabase.from('categories').select('*')
        setCategories(data || [])
        setLoading(false)
    }

    const addCategory = async (e) => {
        e.preventDefault()
        if (!newCat) return
        const slug = newCat.toLowerCase().replace(/\s+/g, '-')
        const { error } = await supabase.from('categories').insert({ name: newCat, slug })
        if (error) alert(error.message)
        else {
            setNewCat('')
            fetchCats()
        }
    }

    const deleteCategory = async (id) => {
        if (!confirm('Are you sure?')) return
        const { error } = await supabase.from('categories').delete().eq('id', id)
        if (error) alert(error.message)
        else fetchCats()
    }

    return (
        <div className="bg-white shadow sm:rounded-lg mb-8 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>

            <form onSubmit={addCategory} className="flex gap-4 mb-6">
                <input
                    type="text"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="New Category Name"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                />
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="-ml-1 mr-2 h-5 w-5" /> Add
                </button>
            </form>

            <ul className="divide-y divide-gray-200">
                {categories.map((cat) => (
                    <li key={cat.id} className="py-4 flex justify-between items-center">
                        <span>{cat.name} <span className="text-gray-400 text-sm">({cat.slug})</span></span>
                        <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:text-red-900">
                            <Trash className="h-5 w-5" />
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
