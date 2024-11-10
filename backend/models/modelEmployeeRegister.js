import mongoose from 'mongoose';

const schema1 = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    designation: String,
    gender: String,
    image: String,
    course: {
        type: Array,
        default: []
    },
});

const modelEmployeeRegister = mongoose.model("modelEmployeeRegister1", schema1);

export default modelEmployeeRegister;
