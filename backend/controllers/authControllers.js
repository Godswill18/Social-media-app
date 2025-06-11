import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  try {
    const { username, fullName, email, password } = req.body;

    // Validate required fields
    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already exists" });
    }

    if(password.length < 4) {
      return res.status(400).json({ error: "Password must be at least 4 characters long" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
    });

    if(newUser){
       // Save the user and generate a token
       generateTokenAndSetCookie(newUser._id, res);
        await newUser.save();

    res.status(201).json({
     _id: newUser._id,
     fullName: newUser.fullName,
     username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });
  } else {
    res.status(400).json({ error: "User creation failed" });
  }

   
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const login = async (req, res) => {
  try{
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if(!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
    // Generate a token and set it in the cookie
    generateTokenAndSetCookie(user._id, res);
    // console.log(generateTokenAndSetCookie())
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });


  }catch(error){
    console.log("Error in login controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }


};

export const logout = async (req, res) => {
try{
  res.cookie("jwt", "", {maxAge: 0});
  res.status(200).json({ message: "Logged out successfully" });

}catch(error){
  console.log("Error in logout controller:", error.message);
  res.status(500).json({ error: "Internal server error" });
}
};

export const getMe = async (req, res) => {
  try{
    const user = await User.findById(req.user._id).select("-password"); // The user is already attached to the request object by the protectRoute middleware
    res.status(200).json(user)

  }catch(error){
    console.log("Error in getMe controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}