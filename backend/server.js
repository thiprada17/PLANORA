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

// สร้าง server ให้น้องถุงเท้า
const http = require("http")
const { Server } = require("socket.io")
const { create } = require('domain')
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

app.get("/chat/history/:projectId", async (req, res) => {
    const { projectId } = req.params;

    const { data, error } = await supabase
        .from("message")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

    if (error) return res.status(500).json(error);
    res.json(data);
});

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

//Login
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

    // login ด้วย Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    })

    if (error || !data.user) {
      return res.status(401).json({
        success: false,
        message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง'
      })
    }

    const user = data.user

    // ดึงข้อมูลจาก user_profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profile')
      .select('user_id, username, email, avatar_url')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return res.status(404).json({
        success: false,
        message: 'ไม่พบข้อมูลผู้ใช้'
      })
    }

    // ส่งกลับให้ frontend
    res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      session: data.session,
      user: profile
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


    try {
        const { data: projectData, error: projectError } = await supabase
            .from('project')
            .insert({ project_name, deadline, subject, created_by: null})
            .select()
            .single()

        if (projectError) throw projectError

        const project_id = projectData.project_id

        console.log(member)

        const membersData = member.map(i => ({
            project_id,
            user_id: i.id,
            username: i.name,
            email: i.email
        }))

        const { error } = await supabase
            .from('project_members')
            .insert(membersData)

        if (error) throw error
        res.json({ success: true })

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false })
    }
})

// Create project >> Homepage
app.get('/display/projects/:userId', async (req, res) => {
    const {userId} = req.params;
            console.log(userId)
    try {
        const { data, error } = await supabase
            .from('project_members')
            .select(`
                project:project_id (
                project_id,
                project_name,
                subject,
                deadline,
                created_at
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
        if (error) throw error;
        console.log(data)
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// edit project
app.put('/api/project/:project_id', async (req, res) => {
  const { project_id } = req.params
  const { project_name, deadline, subject } = req.body

  try {
    const { data, error } = await supabase
      .from('project')
      .update({
        project_name,
        deadline,
        subject
      })
      .eq('project_id', project_id)
      .select()
      .single()

    if (error) throw error

    res.json({ success: true, project: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
})

// delete project
app.delete('/api/project/:project_id', async (req, res) => {
  const { project_id } = req.params

  try {
    // ลบ message
    await supabase.from('message').delete().eq('project_id', project_id)

    // ลบ members
    await supabase.from('project_members').delete().eq('project_id', project_id)

    // ถ้ามี task ก็ลบๆไปซะ
    await supabase.from('task').delete().eq('project_id', project_id)

    // ลบ project
    const { error } = await supabase
      .from('project')
      .delete()
      .eq('project_id', project_id)

    if (error) throw error

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false })
  }
})

app.post('/search/member', async (req, res) => {
    const email = req.body.email.trim().toLowerCase()

    console.log(email)

    try {
        const { data, error } = await supabase
            .from('user_profile')
            .select('user_id, username, email')
            .eq('email', email)
            .single()

        if (error || !data) {
            return res.json({ found: false })
        }

        res.json({
            found: true,
            user_id: data.user_id,
            username: data.username,
            email: data.email
        })
    } catch (error) {
        res.status(500).json({ found: false });
    }

})

server.listen(3000, '0.0.0.0', () => {
    console.log('Server running on port 3000')
})