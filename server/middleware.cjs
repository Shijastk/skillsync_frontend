const fs = require('fs');
const path = require('path');

module.exports = (req, res, next) => {
    // Enable CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    const dbPath = path.join(__dirname, 'db.json');

    // Custom login endpoint
    if (req.path === '/auth/login' && req.method === 'POST') {
        const { email, password } = req.body;
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
        const user = db.users.find(u => u.email === email && u.password === password);

        if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return res.json({
                success: true,
                user: userWithoutPassword,
                token: `fake-jwt-token-${user.id}`
            });
        } else {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }
    }

    // Custom register endpoint
    if (req.path === '/auth/register' && req.method === 'POST') {
        const { email, password, firstName, lastName } = req.body;
        const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

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
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({
            success: true,
            user: userWithoutPassword,
            token: `fake-jwt-token-${newUser.id}`
        });
    }

    // Continue to json-server router
    next();
};
