
import express from 'express';
import Database from 'better-sqlite3';
import cors from 'cors';
import dayjs from 'dayjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
const dbPath = path.join(dataDir, 'app.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL UNIQUE,
  node TEXT,
  ip TEXT,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS paypals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT NOT NULL UNIQUE,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS email_paypal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_id INTEGER NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  paypal_id INTEGER NOT NULL REFERENCES paypals(id) ON DELETE CASCADE,
  created_at TEXT DEFAULT (datetime('now')),
  UNIQUE(email_id, paypal_id)
);

CREATE TABLE IF NOT EXISTS income (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,                 -- YYYY-MM-DD
  email_id INTEGER NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
  paypal_id INTEGER REFERENCES paypals(id) ON DELETE SET NULL,
  gross REAL NOT NULL CHECK (gross >= 0),
  fee REAL NOT NULL DEFAULT 0 CHECK (fee >= 0),
  net REAL NOT NULL DEFAULT 0,
  note TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_income_email ON income(email_id);
CREATE INDEX IF NOT EXISTS idx_income_paypal ON income(paypal_id);
`);

// Helpers
const ok = (res, data={}) => res.json({ ok: true, ...data });
const err = (res, message='Error', code=400) => res.status(code).json({ ok: false, message });

// Seed minimal rows if DB empty
const emailCount = db.prepare('SELECT COUNT(*) AS c FROM emails').get().c;
if (emailCount === 0) {
  const e1 = db.prepare('INSERT INTO emails (address, node, ip) VALUES (?, ?, ?)').run('dominiquebeckwith724@gmail.com', 'node22-101', '192.168.1.101');
  const p1 = db.prepare('INSERT INTO paypals (address) VALUES (?)').run('minhhungtsbd.me@gmail.com');
  db.prepare('INSERT OR IGNORE INTO email_paypal (email_id, paypal_id) VALUES (?, ?)').run(e1.lastInsertRowid, p1.lastInsertRowid);
  const incStmt = db.prepare('INSERT INTO income (date, email_id, paypal_id, gross, fee, net) VALUES (?, ?, ?, ?, ?, ?)');
  const seed = [
    ['2025-01-01', 22.18, 0.43],
    ['2025-01-02', 19.53, 0.38],
    ['2025-01-03', 23.37, 0.45],
    ['2025-01-04', 27.59, 0.54],
    ['2025-01-05', 27.08, 0.53],
  ];
  for (const [d,g,f] of seed) incStmt.run(d, e1.lastInsertRowid, p1.lastInsertRowid, g, f, g - f);
// Seed default admin user if not exists
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
if (userCount.count === 0) {
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run("Admin", "Calomam@12@@");
}
  console.log('Seeded initial data.');
}

// -------- Emails CRUD --------
// ===== AUTH =====
app.post('/api/login', (req,res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ ok: false, error: 'Username and password required' });
  try {
    const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);
    if (user) {
      return res.json({ ok: true, user: { id: user.id, username: user.username } });
    }
    return res.json({ ok: false, error: 'Invalid credentials' });
  } catch (e) {
    return res.json({ ok: false, error: e.message });
  }
});


app.get('/api/emails', (req,res) => {
  const rows = db.prepare(`
    SELECT e.*, 
      GROUP_CONCAT(pp.address, ', ') AS paypal_addresses
    FROM emails e
    LEFT JOIN email_paypal ep ON ep.email_id = e.id
    LEFT JOIN paypals pp ON pp.id = ep.paypal_id
    GROUP BY e.id
    ORDER BY e.id DESC
  `).all();
  ok(res, { items: rows });
});

app.post('/api/emails', (req,res) => {
  const { address, node, ip, note } = req.body;
  if (!address) return err(res, 'address is required');
  try {
    const r = db.prepare('INSERT INTO emails (address, node, ip, note) VALUES (?, ?, ?, ?)').run(address.trim(), node||null, ip||null, note||null);
    ok(res, { id: r.lastInsertRowid });
  } catch (e) {
    return err(res, e.message);
  }
});

app.put('/api/emails/:id', (req,res) => {
  const { id } = req.params;
  const { address, node, ip, note } = req.body;
  const row = db.prepare('SELECT id FROM emails WHERE id=?').get(id);
  if (!row) return err(res, 'Not found', 404);
  try {
    db.prepare('UPDATE emails SET address=?, node=?, ip=?, note=? WHERE id=?')
      .run(address, node, ip, note, id);
    ok(res);
  } catch (e) { return err(res, e.message); }
});

app.delete('/api/emails/:id', (req,res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM emails WHERE id=?').run(id);
  ok(res);
});

// -------- Paypals CRUD --------
app.get('/api/paypals', (req,res) => {
  const rows = db.prepare(`
    SELECT p.*,
      GROUP_CONCAT(e.address, ', ') AS email_addresses
    FROM paypals p
    LEFT JOIN email_paypal ep ON ep.paypal_id = p.id
    LEFT JOIN emails e ON e.id = ep.email_id
    GROUP BY p.id
    ORDER BY p.id DESC
  `).all();
  ok(res, { items: rows });
});

app.post('/api/paypals', (req,res) => {
  const { address, note } = req.body;
  if (!address) return err(res, 'address is required');
  try {
    const r = db.prepare('INSERT INTO paypals (address, note) VALUES (?, ?)').run(address.trim(), note||null);
    ok(res, { id: r.lastInsertRowid });
  } catch (e) { return err(res, e.message); }
});

app.put('/api/paypals/:id', (req,res) => {
  const { id } = req.params;
  const { address, note } = req.body;
  const row = db.prepare('SELECT id FROM paypals WHERE id=?').get(id);
  if (!row) return err(res, 'Not found', 404);
  try {
    db.prepare('UPDATE paypals SET address=?, note=? WHERE id=?').run(address, note, id);
    ok(res);
  } catch (e) { return err(res, e.message); }
});

app.delete('/api/paypals/:id', (req,res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM paypals WHERE id=?').run(id);
  ok(res);
});

// -------- Link/Unlink Email<->PayPal --------
app.get('/api/email-paypal', (req,res) => {
  const rows = db.prepare(`
    SELECT ep.id, e.address AS email, p.address AS paypal, ep.email_id, ep.paypal_id, ep.created_at
    FROM email_paypal ep
    JOIN emails e ON e.id = ep.email_id
    JOIN paypals p ON p.id = ep.paypal_id
    ORDER BY ep.id DESC
  `).all();
  ok(res, { items: rows });
});

app.post('/api/email-paypal', (req,res) => {
  const { email_id, paypal_id } = req.body;
  if (!email_id || !paypal_id) return err(res, 'email_id and paypal_id are required');
  try {
    const r = db.prepare('INSERT OR IGNORE INTO email_paypal (email_id, paypal_id) VALUES (?, ?)').run(email_id, paypal_id);
    ok(res, { id: r.lastInsertRowid || null });
  } catch (e) { return err(res, e.message); }
});

app.delete('/api/email-paypal/:id', (req,res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM email_paypal WHERE id=?').run(id);
  ok(res);
});

// -------- Income CRUD --------
app.get('/api/income', (req,res) => {
  const { from, to, email_id, paypal_id } = req.query;
  let sql = `
    SELECT income.*, e.address AS email, p.address AS paypal
    FROM income 
    JOIN emails e ON e.id = income.email_id
    LEFT JOIN paypals p ON p.id = income.paypal_id
    WHERE 1=1
  `;
  const params = [];
  if (from) { sql += ' AND date >= ?'; params.push(from); }
  if (to) { sql += ' AND date <= ?'; params.push(to); }
  if (email_id) { sql += ' AND email_id = ?'; params.push(Number(email_id)); }
  if (paypal_id) { sql += ' AND paypal_id = ?'; params.push(Number(paypal_id)); }
  sql += ' ORDER BY date DESC, id DESC';
  const rows = db.prepare(sql).all(...params);
  ok(res, { items: rows });
});

app.post('/api/income', (req,res) => {
  const { date, email_id, paypal_id=null, gross, fee=0, note=null } = req.body;
  if (!date || !email_id || gross == null) return err(res, 'date, email_id, gross are required');
  const net = Number(gross) - Number(fee || 0);
  try {
    const r = db.prepare('INSERT INTO income (date, email_id, paypal_id, gross, fee, net, note) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(date, email_id, paypal_id || null, gross, fee || 0, net, note);
    ok(res, { id: r.lastInsertRowid });
  } catch (e) { return err(res, e.message); }
});

app.put('/api/income/:id', (req,res) => {
  const { id } = req.params;
  const row = db.prepare('SELECT id FROM income WHERE id=?').get(id);
  if (!row) return err(res, 'Not found', 404);
  const { date, email_id, paypal_id=null, gross, fee=0, note=null } = req.body;
  const net = Number(gross) - Number(fee || 0);
  try {
    db.prepare('UPDATE income SET date=?, email_id=?, paypal_id=?, gross=?, fee=?, net=?, note=? WHERE id=?')
      .run(date, email_id, paypal_id || null, gross, fee || 0, net, note, id);
    ok(res);
  } catch (e) { return err(res, e.message); }
});

app.delete('/api/income/:id', (req,res) => {
  const { id } = req.params;
  db.prepare('DELETE FROM income WHERE id=?').run(id);
  ok(res);
});

// -------- Reports --------
app.get('/api/reports/daily', (req,res) => {
  const { from, to } = req.query;
  const sql = `
    SELECT date, 
      SUM(gross) AS gross, SUM(fee) AS fee, SUM(net) AS net
    FROM income
    WHERE date >= ? AND date <= ?
    GROUP BY date
    ORDER BY date ASC
  `;
  const rows = db.prepare(sql).all(from || '1900-01-01', to || '2999-12-31');
  ok(res, { items: rows });
});

app.get('/api/reports/monthly', (req,res) => {
  const { year } = req.query;
  let y = Number(year) || dayjs().year();
  const sql = `
    SELECT substr(date,1,7) AS month, 
      SUM(gross) AS gross, SUM(fee) AS fee, SUM(net) AS net
    FROM income
    WHERE substr(date,1,4) = ?
    GROUP BY substr(date,1,7)
    ORDER BY month ASC
  `;
  const rows = db.prepare(sql).all(String(y));
  ok(res, { items: rows });
});

app.get('/api/options', (req,res) => {
  const emails = db.prepare('SELECT id, address FROM emails ORDER BY address ASC').all();
  const paypals = db.prepare('SELECT id, address FROM paypals ORDER BY address ASC').all();
  ok(res, { emails, paypals });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
