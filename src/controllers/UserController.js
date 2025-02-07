import User from '../models/UsersModel.js';
import twilio from 'twilio';
const accountSid = process.env.YOUR_TWILIO_ACCOUNT_SID;
const authToken = process.env.YOUR_TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.YOUR_TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);
const otpStore = new Map();

// Create a new user
const createUser = async (req, res) => {
    try {
        const { Name, Buiness_Name, Address, Profile_Pic, PhoneNo } = req.body;

        if (!Name || !Buiness_Name || !Address || !PhoneNo) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        const { state, city, pincode, address1, address2 } = Address;
        if (!state || !city || !pincode || !address1) {
            return res.status(400).json({ error: "Incomplete address details" });
        }

        const newUser = new User({
            Name,
            Buiness_Name,
            Address: { state, city, pincode, address1, address2 },
            Profile_Pic: Profile_Pic || 'https://picsum.photos/200',
            PhoneNo
        });

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a user by ID
const updateUser = async (req, res) => {
    try {
        const { Name, Buiness_Name, Address, Profile_Pic, PhoneNo } = req.body;

        if (!Name || !Buiness_Name || !Address || !PhoneNo) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        const { state, city, pincode, address1, address2 } = Address;
        if (!state || !city || !pincode || !address1) {
            return res.status(400).json({ error: "Incomplete address details" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                Name,
                Buiness_Name,
                Address: { state, city, pincode, address1, address2 },
                Profile_Pic,
                PhoneNo
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Step 1: Send OTP
const sendOtp = async (req, res) => {
    try {
        const { PhoneNo } = req.body;
        const user = await User.findOne({ PhoneNo });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
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

// Step 2: Verify OTP
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

export { createUser, getUsers, getUserById, updateUser, deleteUser, sendOtp ,verifyOtp };
