import mongoose from 'mongoose';

const chefsModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    PhoneNo: {
        type: Number,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 13,
    },
    chefServices: {
        type: String,
        required: true
    },
    homemakerServices: {
        type: Boolean,
        default: false
    },
    document: {
        type: {
            type: String,
            required: true
        },
        documentNo: {
            type: String,
            required: true
        },
        docsPhoto: {
            front: {
                type: String,
                required: true
            },
            back: {
                type: String,
                required: true
            }
        }
    }
    
}, { timestamps: true });

const Chef = mongoose.model('Chef', chefsModel);
export default Chef;
