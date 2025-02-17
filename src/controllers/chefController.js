import User from '../models/chefsModel.js';
import twilio from 'twilio';

const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.YOUR_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
const otpStore = new Map();

// Create a new user
const createUser = async (req, res) => {
    try {
        const { fullName, businessName, address, PhoneNo, chefServices, homemakerServices, document } = req.body;

        const newUser = new User({
            fullName,
            businessName,
            address,
            PhoneNo,
            chefServices,
            homemakerServices,
            document
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
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
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
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
        const deletedUser = await User.findByIdAndDelete(req.params.id);
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

        const user = await User.findOne({ PhoneNo });
        if (!user) return res.status(404).json({ error: "User not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(PhoneNo, otp);

        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: twilioPhone,
            to: PhoneNo,
        });

        res.json({ message: "OTP sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
const verifyOtp = async (req, res) => {
    try {
        const { PhoneNo, otp } = req.body;
        const storedOtp = otpStore.get(PhoneNo);

        if (!storedOtp || storedOtp !== otp) {
            return res.status(401).json({ error: "Invalid OTP" });
        }

        otpStore.delete(PhoneNo);
        res.json({ status: "Login successful" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { createUser, getAllUsers, getUserById, updateUser, deleteUser, sendOtp, verifyOtp };
