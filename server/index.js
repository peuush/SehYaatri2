/* Simple Express + SQLite backend for auth and feedback */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), 'server_data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const FEEDBACK_FILE = path.join(DATA_DIR, 'feedback.json');
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, '[]');
if (!fs.existsSync(FEEDBACK_FILE)) fs.writeFileSync(FEEDBACK_FILE, '[]');

function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
function writeJson(file, data) { fs.writeFileSync(file, JSON.stringify(data, null, 2)); }

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

function auth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
  const hash = bcrypt.hashSync(password, 10);
  const users = readJson(USERS_FILE);
  if (users.find(u => u.email === email.trim().toLowerCase())) {
    return res.status(400).json({ error: 'User exists' });
  }
  const user = { id: users.length ? users[users.length - 1].id + 1 : 1, email: email.trim().toLowerCase(), name: name || '', password_hash: hash, role: 'owner' };
  users.push(user);
  writeJson(USERS_FILE, users);
  return res.json({ token: createToken(user) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const users = readJson(USERS_FILE);
  const row = users.find(u => u.email === (email?.trim().toLowerCase()));
  if (!row) return res.status(401).json({ error: 'Invalid credentials' });
  if (!bcrypt.compareSync(password || '', row.password_hash)) return res.status(401).json({ error: 'Invalid credentials' });
  return res.json({ token: createToken(row) });
});

app.post('/api/feedback', (req, res) => {
  const { payload, email } = req.body || {};
  if (!payload) return res.status(400).json({ error: 'Missing payload' });
  const list = readJson(FEEDBACK_FILE);
  const item = { id: list.length ? list[list.length - 1].id + 1 : 1, user_email: email || null, payload, created_at: new Date().toISOString() };
  list.push(item);
  writeJson(FEEDBACK_FILE, list);
  return res.json({ ok: true });
});

app.get('/api/feedback', auth, (req, res) => {
  const rows = readJson(FEEDBACK_FILE).reverse();
  const list = rows.map(r => ({ id: r.id, userEmail: r.user_email, data: r.payload, createdAt: r.created_at }));
  return res.json({ feedback: list });
});

const PORT = process.env.PORT || 5175;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));


