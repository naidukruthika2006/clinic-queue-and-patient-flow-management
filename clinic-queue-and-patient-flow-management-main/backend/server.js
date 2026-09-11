const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const User = require("./models/User");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "clinic-secret";
const DATA_FILE = path.join(__dirname, "data", "users.json");
const MONGO_URI = process.env.MONGO_URI;

let useMongo = false;

function ensureDataFile() {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "[]", "utf8");
  }
}

function readUsers() {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.warn("Unable to read user data file, using empty store.", error.message);
    return [];
  }
}

function writeUsers(users) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function connectToDatabase() {
  if (!MONGO_URI) {
    return false;
  }

  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    useMongo = true;
    console.log("✅ MongoDB connected");
    return true;
  } catch (error) {
    console.warn("⚠️ MongoDB unavailable, falling back to local JSON storage.", error.message);
    return false;
  }
}

async function seedDefaultUser() {
  if (useMongo) {
    const count = await User.countDocuments();
    if (count === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "System Admin",
        username: "admin",
        password: hashedPassword,
        role: "admin"
      });
    }
    return;
  }

  const users = readUsers();
  if (!users.some((entry) => String(entry.username).toLowerCase() === "admin")) {
    users.push({
      id: Date.now().toString(),
      name: "System Admin",
      username: "admin",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin"
    });
    writeUsers(users);
  }
}

function createToken(user) {
  return jwt.sign(
    {
      id: user.id || user._id,
      name: user.name,
      username: user.username,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

function serializeUser(user) {
  return {
    id: user.id || user._id,
    name: user.name,
    username: user.username,
    role: user.role
  };
}

async function getUserByUsername(username) {
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (useMongo) {
    return User.findOne({ username: normalizedUsername });
  }

  const users = readUsers();
  return users.find((entry) => String(entry.username).trim().toLowerCase() === normalizedUsername) || null;
}

async function createUserRecord(userData) {
  if (useMongo) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await User.create({
      name: userData.name,
      username: userData.username,
      password: hashedPassword,
      role: userData.role
    });
    return user;
  }

  const users = readUsers();
  const newUser = {
    id: `user-${Date.now()}`,
    name: userData.name,
    username: userData.username,
    password: bcrypt.hashSync(userData.password, 10),
    role: userData.role
  };
  users.push(newUser);
  writeUsers(users);
  return newUser;
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token." });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", mode: useMongo ? "mongodb" : "json" });
});

app.post("/register", async (req, res) => {
  const { name, username, password, role = "patient" } = req.body || {};
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!name || !normalizedUsername || !password) {
    return res.status(400).json({ message: "Name, username and password are required." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters." });
  }

  const existingUser = await getUserByUsername(normalizedUsername);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists." });
  }

  const createdUser = await createUserRecord({
    name: String(name).trim(),
    username: normalizedUsername,
    password: String(password),
    role: String(role).trim() || "patient"
  });

  res.status(201).json({
    message: "User created successfully.",
    user: serializeUser(createdUser),
    token: createToken(createdUser)
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  const normalizedUsername = String(username || "").trim().toLowerCase();

  if (!normalizedUsername || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  const user = await getUserByUsername(normalizedUsername);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const match = await bcrypt.compare(String(password), user.password);
  if (!match) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const token = createToken(user);
  res.json({ token, user: serializeUser(user) });
});

app.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

app.listen(PORT, async () => {
  await connectToDatabase();
  await seedDefaultUser();
  console.log(`🚀 Auth server running on http://localhost:${PORT}`);
});
