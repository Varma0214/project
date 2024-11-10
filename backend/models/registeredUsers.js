import mongoose from 'mongoose';

const schema1 = new mongoose.Schema({
    name: String,
    email: String,
    cnfPassword: String,
});

const registeredUsers = mongoose.model('registeredUsers1', schema1);

export default registeredUsers;
