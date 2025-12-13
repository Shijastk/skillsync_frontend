import jsonServer from 'json-server';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// Read all database files
const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/users.json'), 'utf-8'));
const swapsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/swaps.json'), 'utf-8'));
const groupsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/groups.json'), 'utf-8'));
const messagesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/messages.json'), 'utf-8'));
const transactionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/transactions.json'), 'utf-8'));
const postsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'db/posts.json'), 'utf-8'));

// Combine all database files
const db = {
    ...usersData,
    ...swapsData,
    ...groupsData,
    ...messagesData,
    ...transactionsData,
    ...postsData
};

const router = jsonServer.router(db);

// Custom middleware for authentication
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Enable CORS
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Custom routes
server.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find(u => u.email === email && u.password === password);

    if (user) {
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            user: userWithoutPassword,
            token: `fake-jwt-token-${user.id}`
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
});

server.post('/api/auth/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }

    // Create new user
    const newUser = {
        id: String(db.users.length + 1),
        email,
        password,
        firstName,
        lastName,
        avatar: `https://i.pravatar.cc/150?img=${db.users.length + 1}`,
        bio: '',
        location: '',
        skillsToTeach: [],
        skillsToLearn: [],
        credits: 50,
        joinedDate: new Date().toISOString(),
        isActive: true
    };

    db.users.push(newUser);

    // Save to file
    fs.writeFileSync(
        path.join(__dirname, 'db/users.json'),
        JSON.stringify({ users: db.users }, null, 2)
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
        success: true,
        user: userWithoutPassword,
        token: `fake-jwt-token-${newUser.id}`
    });
});

// Use default router for other routes
server.use('/api', router);

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`🚀 JSON Server is running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🔐 Auth endpoints:`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   - POST http://localhost:${PORT}/api/auth/register`);
});
