const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs").promises; // Use promises for async file operations

const bcrypt = require("bcryptjs"); // Assuming you hashed passwords
const Accounts = require("../models/account.model"); // Path to your model

const SESSION_FILE_PATH = "./sessions.json"; // Path to your session file

// Function to read sessions from the file
async function readSessions() {
  try {
    const data = await fs.readFile(SESSION_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return {}; // Return an empty object if the file doesn't exist or can't be read
  }
}

// Function to write sessions to the file
async function writeSessions(sessions) {
  await fs.writeFile(SESSION_FILE_PATH, JSON.stringify(sessions));
}

// Initialize cookie-parser
// Middleware to handle cookies
function initCookieParser(req, res) {
  const cookies = req.headers.cookie;
  console.log("Cookies in request:", cookies); // Log cookies for debugging
  req.cookies = {};
  if (cookies) {
    cookies.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      req.cookies[parts[0].trim()] = decodeURIComponent(parts[1]);
    });
  }
}

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

// Authentication middleware
async function authMiddleware(req, res, next) {
  initCookieParser(req, res);
  const sessionId = req.cookies.sessionId;
  const sessions = await readSessions(); // Read sessions from the file
  req.user = sessionId && sessions[sessionId] ? sessions[sessionId].user : null;
  
  next();
}

async function checkLogin(req, res, next) {
  initCookieParser(req, res);
  const sessionId = req.cookies.sessionId;
  const sessions = await readSessions(); // Read sessions from the file
  req.user = sessionId && sessions[sessionId] ? sessions[sessionId].user : null;
  console.log("Check SESSION ID ========> ", sessionId);
  console.log("Check SESSION USER ========> ", req.user);
  return req.user
}

async function register(req, res) {
  const { userName, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await Accounts.findOne({ userName: userName });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new account
    const newUser = new Accounts({
      userName: userName,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    // Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Login function (to be called when a user logs in)
async function login(req, res) {
  const { userName, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await Accounts.findOne({ userName: userName });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Validate the password (assuming passwords are hashed)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Generate a session ID and store the user session
    const sessionId = uuidv4();
    const sessions = await readSessions(); // Read current sessions
    sessions[sessionId] = { user: { id: user._id, userName: user.userName } };
    await writeSessions(sessions); // Write updated sessions back to file

    // Set session ID in cookies (valid for 1 day)
    res.setHeader(
      "Set-Cookie",
      `sessionId=${sessionId}; HttpOnly; Max-Age=86400 ; Path=/`
    );

    console.log(
      "Setting cookie:",
      `sessionId=${sessionId}; HttpOnly; Max-Age=86400`
    );

    // Send success response
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

// Logout function
async function logout(req, res) {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    const sessions = await readSessions();
    delete sessions[sessionId]; // Remove session
    await writeSessions(sessions); // Write updated sessions back to file
    res.setHeader("Set-Cookie", "sessionId=; HttpOnly; Max-Age=0; Path=/"); // Clear cookie
  }
}

module.exports = {
  authMiddleware,
  register,
  login,
  logout,
  checkLogin,
  hashPassword,
};
