import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("church.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    firstName TEXT,
    lastName TEXT,
    gender TEXT,
    dob TEXT,
    maritalStatus TEXT,
    occupation TEXT,
    phone TEXT,
    email TEXT,
    hometown TEXT,
    region TEXT,
    residence TEXT,
    gpsAddress TEXT,
    fatherName TEXT,
    fatherContact TEXT,
    motherName TEXT,
    motherContact TEXT,
    emergencyContact TEXT,
    baptismStatus TEXT,
    baptismDate TEXT,
    ministry TEXT,
    homeCell TEXT,
    bibleStudyGroup TEXT,
    photo TEXT,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );
`);

// Seed Admin
const seedAdmin = db.prepare("INSERT OR REPLACE INTO admins (id, email, password) VALUES (1, ?, ?)");
seedAdmin.run("abensu.database@gmail.com", "Abensu123456?");

const app = express();
app.use(express.json({ limit: "10mb" }));

// API Routes
app.post("/api/register", (req, res) => {
  try {
    const data = req.body;
    const stmt = db.prepare(`
      INSERT INTO members (
        title, firstName, lastName, gender, dob, maritalStatus, occupation, 
        phone, email, hometown, region, residence, gpsAddress, 
        fatherName, fatherContact, motherName, motherContact, emergencyContact,
        baptismStatus, baptismDate, ministry, homeCell, bibleStudyGroup, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      data.title, data.firstName, data.lastName, data.gender, data.dob, data.maritalStatus, data.occupation,
      data.phone, data.email, data.hometown, data.region, data.residence, data.gpsAddress,
      data.fatherName, data.fatherContact, data.motherName, data.motherContact, data.emergencyContact,
      data.baptismStatus, data.baptismDate, data.ministry, data.homeCell, data.bibleStudyGroup, data.photo
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const admin = db.prepare("SELECT * FROM admins WHERE LOWER(TRIM(email)) = LOWER(TRIM(?)) AND password = ?").get(email, password);
  
  if (admin) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/api/members", (req, res) => {
  const members = db.prepare("SELECT * FROM members ORDER BY createdAt DESC").all();
  res.json(members);
});

app.post("/api/members/:id/approve", (req, res) => {
  db.prepare("UPDATE members SET status = 'approved' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.post("/api/members/:id/reject", (req, res) => {
  db.prepare("UPDATE members SET status = 'rejected' WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

app.put("/api/members/:id", (req, res) => {
  try {
    const data = req.body;
    const stmt = db.prepare(`
      UPDATE members SET 
        title = ?, firstName = ?, lastName = ?, gender = ?, dob = ?, 
        maritalStatus = ?, occupation = ?, phone = ?, email = ?, 
        hometown = ?, region = ?, residence = ?, gpsAddress = ?, 
        fatherName = ?, fatherContact = ?, motherName = ?, motherContact = ?, 
        emergencyContact = ?, baptismStatus = ?, baptismDate = ?, 
        ministry = ?, homeCell = ?, bibleStudyGroup = ?, photo = ?
      WHERE id = ?
    `);
    
    stmt.run(
      data.title, data.firstName, data.lastName, data.gender, data.dob, data.maritalStatus, data.occupation,
      data.phone, data.email, data.hometown, data.region, data.residence, data.gpsAddress,
      data.fatherName, data.fatherContact, data.motherName, data.motherContact, data.emergencyContact,
      data.baptismStatus, data.baptismDate, data.ministry, data.homeCell, data.bibleStudyGroup, data.photo,
      req.params.id
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/api/members/:id", (req, res) => {
  db.prepare("DELETE FROM members WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

// Vite Middleware
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static("dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
}

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
