import Chef from '../models/chefsModel.js';
import jwt from "jsonwebtoken";
import uploadToCloudinary from '../connections/cloudinary.config.js';
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

if (!accountSid || !authToken || !verifySid) {
    console.error("Missing Twilio credentials");
}

const client = twilio(accountSid, authToken);

import multer from 'multer';


// create a chef
const createChef = async (req, res) => {
    try {
        const { 
            fullName, 
            businessName, 
            address, 
            PhoneNo, 
            chefServices, 
            homemakerServices, 
            documentType, 
            documentNo,
            profilePic,
            documentFront,
            documentBack
        } = req.body;

        if (!fullName || !businessName || !PhoneNo || !chefServices || !documentType || !documentNo) {
            return res.status(400).json({ message: "All required fields must be filled." });
        }

        if (!address || !address.address1 || !address.city || !address.state || !address.pincode) {
            return res.status(400).json({ message: "All address fields (address1, city, state, pincode) are required." });
        }

        if (!profilePic || !documentFront || !documentBack) {
            return res.status(400).json({ message: "Profile picture, front and back document image URLs are required." });
        }

        const homemakerServicesBoolean = homemakerServices === 'true' || homemakerServices === true;
        const chefServicesArray = Array.isArray(chefServices) ? chefServices : [chefServices];

        const newChef = new Chef({
            fullName,
            profilePic,
            businessName,
            address,
            PhoneNo,
            chefServices: chefServicesArray,
            homemakerServices: homemakerServicesBoolean,
            document: {
                type: documentType,
                documentNo,
                docsPhoto: {
                    front: documentFront,
                    back: documentBack
                }
            },
            verificationStatus: "Pending"
        });

        await newChef.save();

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
        
        const chefServicesArray = chefServices ? (Array.isArray(chefServices) ? chefServices : [chefServices]) : undefined;

        const updatedUser = await Chef.findByIdAndUpdate(
            req.params.id, 
            {
                fullName,
                businessName,
                address,
                PhoneNo,
                chefServices: chefServicesArray,
                homemakerServices,
                document
            }, 
            { new: true }
        );

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
        
        if (!PhoneNo) {
            return res.status(400).json({ error: "Phone number is required" });
        }

        console.log('Attempting to send OTP to:', PhoneNo);

        if (!PhoneNo.startsWith('+')) {
            return res.status(400).json({ error: "Phone number must be in E.164 format (e.g., +1234567890)" });
        }

        const user = await Chef.findOne({ PhoneNo });
        if (!user) return res.status(404).json({ error: "User not found" });
        
        if (user.verificationStatus !== "Verified") {
            return res.status(403).json({ error: "User is not verified. OTP cannot be sent." });
        }

        console.log('Sending OTP via Twilio...');
        const verification = await client.verify.v2.services(verifySid)
            .verifications
            .create({ to: PhoneNo, channel: 'sms' });

        console.log('Twilio response:', verification);
        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error('Error in sendOtp:', error);
        res.status(500).json({ error: error.message || "Authentication failed" });
    }
};

//sending dummy otp
const sendDummyOtp = async (req, res) => {
    try {
        const { PhoneNo } = req.body;

        if (!PhoneNo.startsWith('+')) {
            return res.status(400).json({ error: "Phone number must be in E.164 format (e.g., +1234567890)" });
        }

        const user = await Chef.findOne({ PhoneNo });
        if (!user) return res.status(404).json({ error: "User not found" });

        if (user.verificationStatus !== "Verified") {
            return res.status(403).json({ error: "User is not verified. OTP cannot be sent." });
        }
        const otp = 12345

        res.json({ message: "OTP sent successfully",otp: otp });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//verify dummy otp
const verifyDummyOtp = async (req, res) => {
    try {
        const { PhoneNo, otp } = req.body;

        // Verify OTP using Twilio
        
        if (otp == 12345) {
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
            });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
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
            });
        } else {
            res.status(400).json({ error: "Invalid OTP" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// update verification status
const updateVerificationStatus = async (req, res) => {
    try {
        const { chefId } = req.params;
        const { verificationStatus } = req.body;

        // Validate verificationStatus
        if (!['Pending', 'Verified', 'Rejected'].includes(verificationStatus)) {
            return res.status(400).json({ message: 'Invalid verification status' });
        }

        const updatedChef = await Chef.findByIdAndUpdate(
            chefId,
            { verificationStatus },
            { new: true, runValidators: true }
        );

        if (!updatedChef) {
            return res.status(404).json({ message: 'Chef not found' });
        }

        res.status(200).json({ 
            success: true,
            message: `Chef verification status successfully updated to ${verificationStatus}`
        });
    } catch (error) {
        console.error('Error updating verification status:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const uploadImage = async (req, res) => {
    try {
        const { imageData, folder } = req.body;

        if (!imageData || !folder) {
            return res.status(400).json({ message: "Image data and folder are required" });
        }

        // Verify that the image data is a valid base64 string
        if (!imageData.startsWith('data:image')) {
            return res.status(400).json({ message: "Invalid image format" });
        }

        // Upload to cloudinary
        const uploadResponse = await uploadToCloudinary(imageData, folder);

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: uploadResponse
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "An error occurred while uploading the image", error: error.message });
    }
};

export { createChef,sendDummyOtp,verifyDummyOtp, getAllChefs, getChefById, updateChefById, deleteChefById, sendOtp, verifyOtp, updateVerificationStatus, uploadImage };
