import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser,sendOtp , verifyOtp } from '../controllers/chefController.js';
import verifyToken from '../middlewares/authrizatoin.config.js';
import upload from '../middlewares/multer.config.js'
const router = express.Router();

router.post('/createUser', upload.fields([{ name: "profilePic" }, { name: "front" }, { name: "back" }]), createUser);     // Create a new user
router.get('/getAllUsers',verifyToken , getAllUsers);         // Get all users
router.get('/getUsedById/:id',verifyToken , getUserById);   // Get a user by ID
router.put('/UpdateUserById/:id',verifyToken , updateUser);    // Update a user by ID
router.delete('/DeleteUserById/:id',verifyToken , deleteUser); // Delete a user by ID

router.post('/sendOtpForLogin', sendOtp)
router.post('/verifyOtpForLogin', verifyOtp)
export default router;
