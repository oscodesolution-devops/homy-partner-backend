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

const router = express.Router();


router.post("/createOrder", createOrder);                   // Create a new order
router.get("/getAllOrders", getOrders);                      // Get all orders
router.get("/getOrderbyId/:id", getOrderById);                  // Get a single order by ID
router.put("/updateorderById/:id", updateOrder);                // Update an order by ID
router.delete("/deleteorderbyId/:id", deleteOrder);                  // Delete an order by ID
router.put("/ChefChekIn/:id/checkin", checkInChef);                 // Chef Check-in
router.put("/chefCheckOut/:id/checkout", checkOutChef);                 // Chef Check-out

export default router;
