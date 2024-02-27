const asyncHandler = require("express-async-handler");
const {User} = require("../models/UserSchema");
const {Doctor} = require("../models/DoctorSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();


///The token will receive user as a parameter, 
/// Parameter 1: Payload Object
/// Parameter 2 : Secret Key => generate it using
/// new terminal, node click enter, type this => crypto.randomBytes(256).toString('base64')
/// Destructure Object to obtain certain fields
const generateToken = user => {
    return jwt.sign({id: user._id, role: user.role}, process.env.ACCESS_TOKEN_STRING,{
        expiresIn:'5d',
    })
}

///----------    Check the list of doctors available  ------------------
const getDoctors = asyncHandler(async (req, res) => {
    try {
        const doctors = await Doctor.find();
        console.log("The request body is " + req.body);
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

///---------- ---------------------   LOGIN ---------------------  ------------------

const Userlogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        
        let user = null; // Change const to let

        //console.log("Received request body:", req.body);

        if (!email || !password) {
            res.status(400).json({ error: "All fields are mandatory!" });
            return;
        }

        // Check if the user is a patient
         user = await User.findOne({ email });
         

        // If not found, check if the user is a doctor
        if (!user) {
            user = await Doctor.findOne({ email });
            
        }

        // If user not found, return error
        if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
        }

        // Compare passwords
        const isPasswordMatch =  bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            // res.json(password);
            return res.status(400).json({ status: false, message: "Invalid credentials" });
        }

        // Generate token
        const token = generateToken(user);

        // Omit sensitive information from user object
        const { password: _, role, appointments, ...userData } = user._doc;

        res.status(200).json({
            status: true,
            message: "Successfully logged in",
            token,
            data: { ...userData },
            role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "Failed to login" });
    }
};


//-------------------- Sign UP process for users, <Doctors and Patients> ----   ----------
const CreateUser = asyncHandler(async (req, res) => {

    const {email, password, name, role, photo, gender} = req.body;

    try {

        let user = null;

        if (!email || !password || !name || !role || !gender) {
            console.log("Missing Fields!");
            return res.status(400).json({ message: "Missing fields" });
        }

            if(role === 'patient'){
                user = await User.findOne({ email})
            }
            else if (role === 'doctor')
                user = await Doctor.findOne({ email})


        ////If user exists already

                if (user) {
                    return res.status(400).json({message: 'user exists already !!'});
                }

                ///hash password
                const hashedPassword = await bcrypt.hash(password, 10);
                console.log("HashedPassword: " + hashedPassword);
                
                if(role === 'patient'){
                    user = new User({
                        name,
                        email,
                        password,
                        photo,
                        gender,
                        role
                    })
                }
                if(role === 'doctor'){
                    user = new Doctor({
                        name,
                        email,
                        password,
                        photo,
                        gender,
                        role
                    })
                }

                await user.save();
                res.status(200).json({success:true, message:"User successfully Registered"});

                
    } catch (error) {
        console.error(error);
        res.status(500).json({ success:false, message: "Internal Server Error" });
    }
});

module.exports = { Userlogin, CreateUser, getDoctors };
