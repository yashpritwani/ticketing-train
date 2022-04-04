const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
    index: {
        type: String,
        required: true
    },
    name: {
        type:String,
        required: true
    },
    weekDays: [],
    stations: []
})

module.exports = mongoose.model('Trains', TrainSchema);