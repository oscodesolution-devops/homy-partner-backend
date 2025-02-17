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
const router = express.Router();


router.post("/createOrder", createOrder);                   // Create a new order
router.get("/getAllOrders", getOrders);                      // Get all orders
router.get("/getOrderbyId/:id", getOrderById);                  // Get a single order by ID
router.put("/updateOrderById/:id", updateOrder);                // Update an order by ID
router.delete("/deleteOrderbyId/:id", deleteOrder);                  // Delete an order by ID
router.put("/ChefChekIn/:id", checkInChef);                 // Chef Check-in
router.put("/chefCheckOut/:id", upload.array("checkoutImage", 5),checkOutChef);                 // Chef Check-out

export default router;
