import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/Users.js';
import Customer from '../models/Customer.js';
import ServiceProvider from '../models/ServiceProvider.js';
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

    // send token in httpOnly cookie and in response body
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .json({
        username: user.username,
        email: user.email,
        role: user.role,
        is_verified, // send verification status
        token,       // include for frontend if needed
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
// -------------------- CREATE CUSTOMER ACCOUNT --------------------
export const createAccount = async (req, res) => {
  const { username, email, password, role, name, phone, age, gender, address } = req.body;

  // ✅ include address in validation
  if (!username || !password || !email || !role || !name || !phone || !age || !gender || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  let savedUser = null;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role });
    savedUser = await newUser.save();

    try {
      const newCustomer = new Customer({
        name,
        phone,
        age,
        gender,
        address, // ✅ save address in customer record
        user: savedUser._id
      });
      await newCustomer.save();
    } catch (customerError) {
      // rollback user if customer creation fails
      await User.findByIdAndDelete(savedUser._id);
      throw customerError;
    }

    const token = jwt.sign(
      { id: savedUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 2 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Account Created Successfully",
      text: `Welcome ${username}, your account has been created successfully!`,
    };
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User and Customer created successfully" });
  } catch (error) {
    console.error("CreateAccount error:", error);
    res.status(500).json({ error: "Internal server error: " + error.message });
  }
};


// -------------------- LOGOUT --------------------
// controllers/authController.js

export const logout = (req, res) => {
  try {
    // Clear the cookie with the same options used when setting it
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      path: "/", // must match the path when cookie was set
    });

    // Respond with success message
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};



// -------------------- CREATE SERVICE PROVIDER --------------------
export const createServiceProvider = async (req, res) => {
  try {
    const { name, phone, address, username, email, password } = req.body;

    if (!name || !phone || !address || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'provider',
    });
    const savedUser = await newUser.save();

    try {
      const newProvider = new ServiceProvider({
        name,
        phone,
        address,
        user: savedUser._id,
        is_verified: false,
        is_available: true,
      });
      await newProvider.save();

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: 'Service Provider Account Created',
        text: `Hello ${name}, your service provider account has been created successfully!`,
      };
      await transporter.sendMail(mailOptions);

      res.status(201).json({
        message: 'Service Provider created successfully',
        provider: newProvider,
      });
    } catch (spError) {
      // rollback user if provider creation fails
      await User.findByIdAndDelete(savedUser._id);
      throw spError;
    }

  } catch (error) {
    console.error("Error in createServiceProvider:", error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};



export const useCheckLogin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user; // attach user to request
    next(); // continue to next middleware or route
  } catch (err) {
    console.error("useCheckLogin error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};