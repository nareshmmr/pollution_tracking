const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nodeSettingsSchema = new Schema({
    nodename:{
        type: String,
        required: true
    }
})

module.exports = PtrNodeSetting = mongoose.model('ptrnodesettings', nodeSettingsSchema);