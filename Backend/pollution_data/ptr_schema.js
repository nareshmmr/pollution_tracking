const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const PtrSchema = new Schema({
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'userdata'
    },
    nodeSettingID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'ptrnodesettings'
    },
    ParamName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    oracleAddress: {
        type: String,
        required: true
    },
    jobID: {
        type: String,
        required: true
    },
    jobSource: {
        type: String,
        required: true
    },
    jobProvider: {
        type: String,
        required: true
    },
    cost: {
        type: String,
    },
    contractAddress: {
        type: String,
        required: true
    },
    network: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    adminNotes: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = PtrData = mongoose.model('ptrdata', PtrSchema);