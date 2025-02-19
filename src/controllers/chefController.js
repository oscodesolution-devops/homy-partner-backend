import Chef from '../models/chefsModel.js';
import jwt from "jsonwebtoken";
import uploadToCloudinary from '../connections/cloudinary.config.js';
import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;
const client = twilio(accountSid, authToken);
// const otpStore = new Map();
import multer from 'multer';


// create a chef
const createChef = async (req, res) => {
    try {
        const { fullName, businessName, address, PhoneNo, chefServices, homemakerServices, documentType, documentNo } = req.body;

        if (!fullName || !businessName || !PhoneNo || !chefServices || !documentType || !documentNo) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        if (!address || !address.address1 || !address.city || !address.state || !address.pincode) {
            return res.status(400).json({ message: "All address fields (address1, city, state, pincode) are required." });
        }

        if (!req.files || !req.files.profilePic || !req.files.front || !req.files.back) {
            return res.status(400).json({ message: "Profile picture, front and back document images are required." });
        }

        const profilePicUrl = await uploadToCloudinary(req.files.profilePic[0].path, "chefs/profilePics");
        const frontDocUrl = await uploadToCloudinary(req.files.front[0].path, "chefs/documents");
        const backDocUrl = await uploadToCloudinary(req.files.back[0].path, "chefs/documents");

        const homemakerServicesBoolean = homemakerServices === 'true' || homemakerServices === true;

        const newChef = new Chef({
            fullName,
            profilePic: profilePicUrl,
            businessName,
            address,
            PhoneNo,
            chefServices,
            homemakerServices: homemakerServicesBoolean,
            document: {
                type: documentType,
                documentNo,
                docsPhoto: {
                    front: frontDocUrl,
                    back: backDocUrl
                }
            },
            verificationStatus: "Pending"
        });

        await newChef.save();

        // Generate JWT Token
        const token = jwt.sign(
            { id: newChef._id, PhoneNo: newChef.PhoneNo },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            message: "User created successfully",
            chef: newChef,
            token: token,
        });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "An error occurred while creating the user.", error: error.message });
    }
};

// Get all users
const getAllChefs = async (req, res) => {
    try {
        const users = await Chef.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by ID
const getChefById = async (req, res) => {
    try {
        const user = await Chef.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a user by ID
const updateChefById = async (req, res) => {
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
const deleteChefById = async (req, res) => {
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

        // Send OTP via Twilio Verify API
        const verification = await client.verify.v2.services(verifySid)
            .verifications
            .create({ to: PhoneNo, channel: 'sms' });

        res.json({ message: "OTP sent successfully", verificationSid: verification.sid });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP for verifiation
const verifyOtp = async (req, res) => {
    try {
        const { PhoneNo, otp } = req.body;

        // Verify OTP using Twilio
        const verificationCheck = await client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: PhoneNo, code: otp });

        if (verificationCheck.status === 'approved') {
            const user = await Chef.findOne({ PhoneNo });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const token = jwt.sign(
                { id: user._id, PhoneNo: user.PhoneNo },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );

            res.json({
                message: "OTP verified successfully",
                token: token,
                user: user
            });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export { createChef, getAllChefs, getChefById, updateChefById, deleteChefById, sendOtp, verifyOtp };
