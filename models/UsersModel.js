import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
    },
    Buiness_Name: {
        type: String,
        required: true,
        unique: true
    },
    Address: {
        state: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
        address1: {
            type: String,
            required: true
        },
        address2: {
            type: String
        },
    },
    Profile_Pic: {
        type: String,
        default: 'https://picsum.photos/200',
    },  
    PhoneNo: {
        type: Number,
        required: true,
        unique: true,
        minLength: 10,
        maxLength: 13,
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
export default User;
