'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, 'users.json');

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) return {};
        const raw = fs.readFileSync(USERS_FILE, 'utf8');
        return JSON.parse(raw || '{}');
    } catch (err) {
        return {};
    }
}

function saveUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

function createUser(username, password) {
    if (!username || !password) throw new Error('Username and password required');
    const users = loadUsers();
    if (users[username]) throw new Error('User already exists');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    users[username] = { passwordHash: hash, createdAt: Date.now() };
    saveUsers(users);
    return true;
}

function verifyUser(username, password) {
    const users = loadUsers();
    const user = users[username];
    if (!user) return false;
    return bcrypt.compareSync(password, user.passwordHash);
}

function userExists(username) {
    const users = loadUsers();
    return !!users[username];
}

module.exports = {
    loadUsers,
    saveUsers,
    createUser,
    verifyUser,
    userExists,
};
