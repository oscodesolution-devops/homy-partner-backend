import express from 'express';
import { 
    createOrder, 
    getOrders, 
    getOrderById, 
    updateOrder, 
    deleteOrder, 
    checkInChef, 
    checkOutChef 
} from '../controllers/orderscheckControllers.js';
import upload from '../middlewares/multer.config.js'
import verifyToken from '../middlewares/authrizatoin.config.js'
const router = express.Router();


router.post("/createOrder", createOrder);                   // Create a new order
router.get("/getAllOrders",verifyToken, getOrders);                      // Get all orders
router.get("/getOrderbyId/:id",verifyToken, getOrderById);                  // Get a single order by ID
router.put("/updateOrderById/:id",verifyToken, updateOrder);                // Update an order by ID
router.delete("/deleteOrderbyId/:id",verifyToken, deleteOrder);                  // Delete an order by ID
router.put("/ChefChekIn/:id",verifyToken, checkInChef);                 // Chef Check-in
router.put("/chefCheckOut/:id",verifyToken, upload.array("checkoutImage", 5),checkOutChef);                 // Chef Check-out

export default router;
