import express from 'express';
import { createChef, getAllChefs, getChefById, updateChefById, deleteChefById,sendOtp , verifyOtp } from '../controllers/chefController.js';
import verifyToken from '../middlewares/authrizatoin.config.js';
import upload from '../middlewares/multer.config.js'
const router = express.Router();

router.post('/createChef', upload.fields([{ name: "profilePic" }, { name: "front" }, { name: "back" }]), createChef);     // Create a new user
router.get('/getAllChefs',verifyToken , getAllChefs);         // Get all users
router.get('/getChefById/:id',verifyToken , getChefById);   // Get a user by ID
router.put('/updateChefById/:id',verifyToken , updateChefById);    // Update a user by ID
router.delete('/deleteChefById/:id',verifyToken , deleteChefById); // Delete a user by ID

router.post('/sendOtpForLogin', sendOtp)
router.post('/verifyOtpForLogin', verifyOtp)
export default router;
