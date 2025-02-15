import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser,sendOtp , verifyOtp } from '../controllers/UserController.js';

const router = express.Router();

router.post('/createUser', createUser);      // Create a new user
router.get('/getAllUsers', getAllUsers);         // Get all users
router.get('/getUsedById/:id', getUserById);   // Get a user by ID
router.put('/UpdateUserById/:id', updateUser);    // Update a user by ID
router.delete('/DeleteUserById/:id', deleteUser); // Delete a user by ID

router.post('/sendOtpForLogin', sendOtp)
router.post('/verifyOtpForLogin', verifyOtp)
export default router;
