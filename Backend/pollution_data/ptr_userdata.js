const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDataSchema = new Schema({
    name:{
        type: String,
        required: true
    }
})

module.exports = UserData = mongoose.model('userdata', userDataSchema);