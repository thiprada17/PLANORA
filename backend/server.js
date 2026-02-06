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
        const cleanEmail = email.trim().toLowerCase()
        const { data, error } = await supabase
            .from('user')
            .insert({
                username,
                email: cleanEmail,
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

app.post('/create/post', async (req, res) => {
<<<<<<< Updated upstream
    const { project_name, deadline, subject, member } = req.body
    const create_at = Date.now
    try {
        const { data: projectData, error: projectError } = await supabase
            .from('project')
            .insert({ project_name, deadline, subject, create_at, created_by: 1 })
=======
    const { project_name, deadline, subject, member, owner_id} = req.body
    const created_at = new Date().toISOString();

    try {
        const { data: projectData, error: projectError } = await supabase
            .from('project')
            .insert({ project_name, deadline, subject, created_at, create_by: owner_id })
>>>>>>> Stashed changes
            .select()
            .single()

        if (projectError) throw projectError
        const project_id = projectData.project_id

        for (const i of member) {
            await supabase
                .from('project_members')
                .insert({
                    project_id: project_id,
                    user_id: i.id,
                    username: i.name
                })
        }
        res.json({ success: true })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false })
    }
})

<<<<<<< Updated upstream
=======
// Create project >> Homepage
app.get('/display/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('project')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

>>>>>>> Stashed changes
app.post('/search/member', async (req, res) => {
    const email = req.body.email.trim().toLowerCase()

    console.log(email)

    try {
        const { data, error } = await supabase
            .from('user')
            .select('user_id, username')
            .eq('email', email)
            .single()

        if (error || !data) {
            return res.json({ found: false })
        }

        res.json({
            found: true,
            user_id: data.user_id,
            username: data.username
        })
    } catch (error) {
        res.status(500).json({ found: false });
    }

})

app.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000')
})
