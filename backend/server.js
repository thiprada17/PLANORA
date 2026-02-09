const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')

const http = require("http")
const { Server } = require("socket.io")

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  socket.on("send_message", (data) => {
    io.emit("receive_message", data)
  })

  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})

const server = http.createServer(app)

const app = express()

app.use(cors())
app.use(bodyParser.json())

const supabaseUrl = 'https://qoxczgyeamhsuxmxhpzr.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveGN6Z3llYW1oc3V4bXhocHpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTY4NDA1OSwiZXhwIjoyMDg1MjYwMDU5fQ.5_HoLWXUPAQn7IzgMwRmkUjFUpYaGd3d0s54_f7VMIU' // service key secret
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// สร้าง server ให้น้องถุงเท้า
const http = require("http")
const { Server } = require("socket.io")
const server = http.createServer(app)

// เชื่อมถุงเท้ากับเชิฟ
const io = new Server(server, {
  cors: { origin: "*" },
  transports: ["websocket"]
})

// client เชื่อม
io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // รับข้อความ (data) จาก client (event "send_message")
  socket.on("send_message", (data) => {
    // ส่ง data ให้ทุกคนที่เชื่อมอยู่
    io.emit("receive_message", data)
  })

  // ปิด
  socket.on("disconnect", () => {
    console.log("User disconnected")
  })
})


//signup hash แย้วจ้า
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing fields' })
    }

    try {
        //เช็กเมล
        const { data: existingUser } = await supabase
            .from('user_profile')
            .select('user_id')
            .eq('email', email)
            .single()

        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' })
        }

        const hashedPassword = await bcrypt.hash(password, 6)
        const cleanEmail = email.trim().toLowerCase()

        const { data, error } = await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
                data: {
                    full_name: username,  
                },
            },
        })

        const user = data.user

        console.log(user)


        if (error) {
            console.log(error)
            throw error
        }

        await supabase
            .from('user_profile')
            .insert({
                user_id: user.id,
                username: username,
                email: cleanEmail,
                created_by: 'system'
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

//Login ยังไม่ 100% นะ
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'กรุณากรอกอีเมลและรหัสผ่าน'
        })
    }

    try {
        const cleanEmail = email.trim().toLowerCase()

        const { data: user, error } = await supabase
            .from('user')
            .select('*')
            .eq('email', cleanEmail)
            .single()
        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
            })
        }

        res.status(200).json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ!',
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email
            }
        })

    } catch (err) {
        console.error('Login Error:', err)
        res.status(500).json({
            success: false,
            message: 'เกิดข้อผิดพลาดภายใน Server'
        })
    }
})

app.post('/create/post', async (req, res) => {
    const { project_name, deadline, subject, member } = req.body
    const created_at = new Date().toISOString();

    try {
        const { data: projectData, error: projectError } = await supabase
            .from('project')
            .insert({ project_name, deadline, subject, created_at, created_by: 1 })
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

// Create project >> Homepage
app.get('/display/projects', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('project')
            .select('*')
            .order('create_at', { ascending: false });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

server.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000')
})
