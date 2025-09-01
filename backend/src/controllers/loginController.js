import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import Customer from '../models/Customer.js';
import ServiceProvider from '../models/ServiceProvider.js';
import Category from '../models/Category.js';
import transporter from '../confg/nodemailer.js';

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    let is_verified = true; // default for normal users/admins

    if (user.role === "provider") {
      const provider = await ServiceProvider.findOne({ user: user._id });
      if (!provider) return res.status(404).json({ error: "Provider not found" });
      is_verified = provider.is_verified;
    }

    // generate token if you use JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      username: user.username,
      email: user.email,
      role: user.role,
      is_verified, // ✅ send this field
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// -------------------- CREATE CUSTOMER ACCOUNT --------------------
export const createAccount = async (req, res) => {
  const { username, email, password, role, name, phone, age, gender } = req.body;

  if (!username || !password || !email || !role || !name || !phone || !age || !gender) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role });
    const savedUser = await newUser.save();

    const newCustomer = new Customer({
      name,
      phone,
      age,
      gender,
      user: savedUser._id
    });
    await newCustomer.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Account Created Successfully',
      text: `Welcome ${username}, your account has been created successfully!`
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User and Customer created successfully" });
  } catch (error) {
    console.error("CreateAccount error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};

// -------------------- LOGOUT --------------------
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- CREATE SERVICE PROVIDER --------------------
export const createServiceProvider = async (req, res) => {
  try {
    const { name, phone, address, username, email, password } = req.body;
    console.log("Request body:", req.body);

    // Basic validation
    if (!name || !phone || !address || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    // Create user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'provider', // matches enum in schema
    });
    const savedUser = await newUser.save();
    console.log("User saved:", savedUser._id);

    // Create service provider (without category)
    const newProvider = new ServiceProvider({
      name,
      phone,
      address,
      user: savedUser._id,
      is_verified: false,
      is_available: true,
    });
    await newProvider.save();
    console.log("Service Provider saved");

    // Send email notification
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Service Provider Account Created',
      text: `Hello ${name}, your service provider account has been created successfully!`,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent to provider");

    res.status(201).json({
      message: 'Service Provider created successfully',
      provider: newProvider,
    });

  } catch (error) {
    console.error("Error in createServiceProvider:", error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};
