import express from 'express';
import { createChef,sendDummyOtp,verifyDummyOtp, getAllChefs, getChefById, updateChefById, deleteChefById,sendOtp , verifyOtp, updateVerificationStatus, getChefProfile } from '../controllers/chefController.js';
import verifyToken from '../middlewares/authrizatoin.config.js';
import upload from '../middlewares/multer.config.js'
const router = express.Router();

router.post('/createChef', upload.fields([{ name: "profilePic" }, { name: "front" }, { name: "back" }]), createChef);     // Create a new user
router.get('/getAllChefs' , getAllChefs);         // Get all users
router.get('/getChefById/:id',verifyToken , getChefById);   // Get a user by ID
router.put('/updateChefById/:id' , updateChefById);    // Update a user by ID
router.delete('/deleteChefById/:id' , deleteChefById); // Delete a user by ID
router.put('/UpdateVerification/:chefId', updateVerificationStatus); // verification update
router.post('/sendOtpForLogin', sendOtp)
router.post('/sendDummyOtpForLogin', sendDummyOtp)
router.post('/verifyOtpForLogin', verifyOtp)
router.post('/verifyDummyOtpForLogin', verifyDummyOtp)
// User Profile Route
router.get('/getProfile', verifyToken, getChefProfile);
export default router;
