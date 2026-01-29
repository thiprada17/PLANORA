const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')

const app = express()

app.use(cors())
app.use(bodyParser.json())

const supabaseUrl = 'https://qoxczgyeamhsuxmxhpzr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveGN6Z3llYW1oc3V4bXhocHpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY4NDA1OSwiZXhwIjoyMDg1MjYwMDU5fQ.5_HoLWXUPAQn7IzgMwRmkUjFUpYaGd3d0s54_f7VMIU' // service key secret
const supabase = createClient(supabaseUrl, supabaseServiceKey)

//signup hash แย้วจ้า
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' })
    }

    try {
        //เช็กเมล
        const { data: existingUser } = await supabase
            .from('user')
            .select('user_id')
            .eq('email', email)
            .single()

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 6)
        const { data, error } = await supabase
            .from('user')
            .insert({
                username,
                email,
                password: hashedPassword,
                create_by: 'system'
            })
            .select()

        if (error) {
            return res.status(400).json({ error: error.message })
        }

        res.status(201).json({
            message: 'Signup success',
            user: data[0]
        })

    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on port 3000')
})
