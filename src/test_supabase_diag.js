import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
    console.log("Testing Supabase Connection...")
    try {
        const { data, error } = await supabase.from('products').select('*').limit(1)
        if (error) {
            console.error("Supabase Error Details:", JSON.stringify(error, null, 2))
        } else {
            console.log("Supabase Success:", data)
        }
    } catch (err) {
        console.error("Unexpected Error:", err)
    }
}

testConnection()
