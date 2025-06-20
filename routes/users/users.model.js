import mongoose, { Schema } from "mongoose";

const modelName = 'users';
const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    roles: {
        type: [String],
        enum: ['admin', 'user'],
        default: ['user'],
    },
    district: {
        type: String
    },
    registeredAt: {
        type: Date
    }
}, {
    timestamps: true
});

const User = mongoose.model(modelName, schema);

export default User;