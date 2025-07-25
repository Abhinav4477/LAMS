import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/Users.js';
import transporter from '../confg/nodemailer.js';

//login controller function
export const  login=async(req,res)=>{
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    try {
      // Here you would typically check the user credentials against the database
      const user = await userModel.findOne({ username });  
        if (!user) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '2h'
            });

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 4*24 * 60 * 60 * 1000, // for 4 days
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict' // Helps prevent CSRF attacks
        });

        return res.status(200).json({ message: "Login successful", role: user.role,  });

}
catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
}


//create account controller function
export const createAccount= async(req,res)=>{
 const {username,email, password ,role} = req.body;

 if (!username || !password || !email || !role) {
   return res.status(400).json({ error: "All fields are required" });
 }
 try {
   // Here you would typically save the user to the database
   // For now, we will just return a success message
const existingUser = await userModel.findOne({username}) ;

if(existingUser){
   return res.status(400).json({ error: "User already exists" });
    }
    // Hash the password before saving(encrypting the password)
  const hashedPassword =await  bcrypt.hash(password, 10);

    const newUser = new userModel({ username, email, password:hashedPassword, role });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
        sameSite: process.env.NODE_ENV === 'production' ? 'none' :'strict' // Helps prevent CSRF attacks
    });
   const mailOptions = {
     from: process.env.SENDER_EMAIL,
     to: email,
     subject: 'Account Created Successfully',
     text: `Welcome ${username}, your account has been created successfully!`
   };

   await transporter.sendMail(mailOptions);
   res.status(201).json({ message: "Account created successfully" });
 } catch (error) {
   res.status(500).json({ error: "Internal server error"+error.message });
 }
}

//user logout controller function
// This function clears the cookie containing the JWT token

export const logout = async (req, res) => {
    try{
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
  });
  res.status(200).json({ message: "Logout successful" });
} catch (error) {
  res.status(500).json({ error: "Internal server error" });
    }
}