import Chef from '../models/chefsModel.js';
import twilio from 'twilio';
import jwt from "jsonwebtoken";
const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.YOUR_TWILIO_PHONE_NUMBER;
import multer from 'multer';
const client = twilio(accountSid, authToken);
const otpStore = new Map();


// Create a new user
const createUser = async (req, res) => {
    try {

        const { fullName, businessName, address, PhoneNo, chefServices, homemakerServices, documentType, documentNo } = req.body;
        if (!fullName || !businessName || !PhoneNo || !chefServices || !homemakerServices || !documentType || !documentNo) {
            return res.status(400).json({ message: "All fields are required" });
        }        
        if (!address || !address.address1 || !address.city || !address.state || !address.pincode) {
            return res.status(400).json({ message: "All address fields (address1, city, state, pincode) are required" });
        }

        if (!req.files || !req.files.front || !req.files.back) {
            return res.status(400).json({ message: "Both front and back document images are required" });
        }

        const homemakerServicesBoolean = homemakerServices === 'true' || homemakerServices === true;

        const newUser = new Chef({
            fullName,
            businessName,
            address,
            PhoneNo,
            chefServices,
            homemakerServices: homemakerServicesBoolean,
            document: {
                type: documentType,
                documentNo,
                docsPhoto: {
                    front: req.files.front[0].path,
                    back: req.files.back[0].path
                }
            }
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });

    } catch (error) {
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: error.message });
        } else {
            // General errors
            res.status(500).json({ message: "An error occurred while creating the user.", error: error.message });
        }
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await Chef.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await Chef.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const { fullName, businessName, address, PhoneNo, chefServices, homemakerServices, document } = req.body;
        
        const updatedUser = await Chef.findByIdAndUpdate(req.params.id, {
            fullName,
            businessName,
            address,
            PhoneNo,
            chefServices,
            homemakerServices,
            document
        }, { new: true });

        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await Chef.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Send OTP for verification
const sendOtp = async (req, res) => {
    try {
        const { PhoneNo } = req.body;

        if (!PhoneNo.startsWith('+')) {
            return res.status(400).json({ error: "Phone number must be in E.164 format (e.g., +1234567890)" });
        }

        const user = await Chef.findOne({ PhoneNo });
        if (!user) return res.status(404).json({ error: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log("DDDDDDDDDDDDDDDDDDDDDDD:",otp)
        // otpStore.set(PhoneNo, otp);

        // await client.messages.create({
        //     body: `Your OTP is ${otp}`,
        //     from: twilioPhone,
        //     to: PhoneNo,
        // });

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP throw twillio
// const verifyOtp = async (req, res) => {
//     try {
//         const { PhoneNo, otp } = req.body;
//         const storedOtp = otpStore.get(PhoneNo);

//         if (!storedOtp || storedOtp !== otp) {
//             return res.status(401).json({ error: "Invalid OTP" });
//         }

//         otpStore.delete(PhoneNo);

//         // JWT Token Generate करें
//         const token = jwt.sign({ PhoneNo }, process.env.JWT_SECRET, { expiresIn: "7d" });

//         res.json({ status: "Login successful", token });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };





const verifyOtp = async (req, res) => {
    try {
        let { PhoneNo, otp } = req.body;

        // Static PhoneNo और OTP
        PhoneNo = 6261448735; 
        const correctOtp = 12345;

        if (otp == correctOtp) {
            const token = jwt.sign({ PhoneNo }, process.env.JWT_SECRET, { expiresIn: "7d" });
            return res.json({ status: "Login successful", token });
        }

        return res.status(401).json({ status: "Login Failed", error: "Invalid OTP" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export { createUser, getAllUsers, getUserById, updateUser, deleteUser, sendOtp, verifyOtp };
