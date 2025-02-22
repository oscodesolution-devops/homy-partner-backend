import mongoose from 'mongoose';

const chefsModel = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    profilePic: {
        type: String,
        required: true, 
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
        type: String,  // Changed to String to support minLength & maxLength
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 13,
        trim:true
    },
    chefServices: {
        type: [String],
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
    },
    verificationStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Verified', 'Rejected']
    }
}, { timestamps: true });

const Chef = mongoose.model('Chef', chefsModel);
export default Chef;
