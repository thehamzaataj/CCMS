const mongoose = require("mongoose")

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Teacher"
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true
    },
    teachSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject'
    },
    teachSclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass'
    }
}, { timestamps: true });

module.exports = mongoose.model("teacher", teacherSchema)