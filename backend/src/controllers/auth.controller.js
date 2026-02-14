const User = require("../models/user.model");
const generateToken = require("../utils/generateToken");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || "user",
    });

    user.password = undefined;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error during signup",
    });
  }
};

const loginUser = async (req,res)=>{
  try{
    const {email,password} = req.body;

    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        status:"fail",
        message:"Invalid email"
      });
    }

    const isMatch = await user.comparePassword(password);

    if(!isMatch){
      return res.status(400).json({
        status:"fail",
        message:"Invalid password"
      });
    }

    res.status(200).json({
      status:"success",
      message:"Login successful",
      token: generateToken(user._id),
      user:{
        id:user._id,
        name:user.name,
        email:user.email
      }
    });

  }catch(err){
    res.status(500).json({
      status:"error",
      message:err.message
    });
  }
};

module.exports = ({signup, loginUser})
