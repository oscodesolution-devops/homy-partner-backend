import Order from '../models/orderscheck.js'
import uploadToCloudinary from '../connections/cloudinary.config.js';



// Create a new order
const createOrder = async (req, res) => {
    try {
        const { orderId, userId, chefId, tiffinServiceDays, timeSlot, noOfPeople, address, menu } = req.body;

        if (!orderId || !userId || !tiffinServiceDays || !timeSlot || !noOfPeople || !address) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order created successfully", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("chefId");
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Invalid order ID" });

        const order = await Order.findById(id).populate("chefId");
        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update an order
const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Invalid order ID" });

        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Invalid order ID" });

        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Chef Check-in
const checkInChef = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Invalid order ID" });

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.chefCheckedIn) {
            return res.status(400).json({ message: "Chef has already checked in" });
        }

        order.chefCheckedIn = true;
        order.checkedInAt = new Date();
        await order.save();

        res.status(200).json({ message: "Chef checked in successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Chef Check-out
const checkOutChef = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).json({ message: "Invalid order ID" });

        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.chefCheckedOut) {
            return res.status(400).json({ message: "Chef has already checked out" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No images uploaded!" });
        }        

        order.chefCheckedOut = true;
        order.checkedOutAt = new Date();
        const uploadedImages = await Promise.all(
            req.files.map(async (file) => {
                return await uploadToCloudinary(file.path, "checkout_images");
            })
        );

        order.checkoutImage.push(...uploadedImages); // Append Cloudinary URLs to order

        await order.save();
        res.status(200).json({ message: "Chef checked out successfully", order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export  {
    createOrder,
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    checkInChef,
    checkOutChef
};
