const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        trim: true,
        lowercase: true,
    },
    phoneNum: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: false,
    },
    bookings: [{
        trainId:{
            type:String
        },
        date: {
            type: Date,
        },
        seat : {
            type: String
        }
    }],
}, {timestamps: true});

module.exports = mongoose.model('Users', UserSchema);