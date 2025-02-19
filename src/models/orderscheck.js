import mongoose from 'mongoose';

const orderscheck = new mongoose.Schema({
    orderId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    userId: { 
        type: String,
        required: true,
    },
    chefId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Chef" 
    },
    tiffinServiceDays: { 
        type: Number, 
        required: true 
    },
    timeSlot: { 
        type: String, 
        required: true 
    },
    menu: { 
        type: String, 
        // required: true 
    },
    noOfPeople: { 
        type: Number, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    chefCheckedIn: { 
        type: Boolean, 
        default: false 
    },
    checkedInAt: { 
        type: Date 
    },
    chefCheckedOut: { 
        type: Boolean, 
        default: false 
    },
    checkedOutAt: { 
        type: Date 
    },
    checkoutImage: {
        type: [String], // Ensure it's an array of strings (file paths)
        default: [],
    }    
},{timestamps: true});

const Order = mongoose.model("Order", orderscheck);
export default Order;